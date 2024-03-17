import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunction, redirect } from "@vercel/remix";
import { Outlet } from "@remix-run/react";
import Stripe from 'stripe'
import prisma from "~/lib/db";

export const action: ActionFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const user = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(userId)
    if (!user.publicMetadata.accountType) return redirect('/onboarding')
    if (user.privateMetadata.paid) return redirect('/onboarding/teen/stripeAccount')

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    if (await prisma.stripeVerificationToken.findUnique({ where: { user_id: userId } })) {
        await prisma.stripeVerificationToken.delete({ where: { user_id: userId } })
    }

    let customerId: string
    if (!user.privateMetadata.customerId) {
        customerId = (await stripe.customers.create({
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress
        })).id

        await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.updateUser(userId, { privateMetadata: { customerId, ...user.privateMetadata } })
    } else {
        customerId = user.privateMetadata.customerId.toString()
    }

    const securityToken = await prisma.stripeVerificationToken.create({ data: { user_id: userId } })

    const stripeSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: 'EUR',
                    product_data: {
                        name: "Frais JobTeen"
                    },
                    unit_amount: 99
                },
                quantity: 1
            }
        ],
        // TODO: Update to https before deploying
        success_url: `http://${args.request.headers.get('host')}/onboarding/teen/payFee/success?token=${securityToken.id}`,
        cancel_url: `http://${args.request.headers.get('host')}/onboarding/teen/payFee/canceled`
    })
    return redirect(stripeSession.url as string)
}

const PayFee = () => {
  return <Outlet />
}

export default PayFee