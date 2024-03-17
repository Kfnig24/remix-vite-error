import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunction, redirect } from "@vercel/remix";
import Stripe from "stripe";
import invariant from "tiny-invariant";
import prisma from "~/lib/db";

export const action: ActionFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    invariant(args.params.propId, 'propId manquant')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)
    if (user.publicMetadata.accountType !== 'pro') return redirect('/dashboard')

    const proposition = await prisma.proposition.findUnique({ where: { id: args.params.propId }, include: { job: true } })
    if (!proposition) return redirect('/dashboard')
    const teen = await clerkClient.users.getUser(proposition.teen)
    if (!teen.privateMetadata.stripe_id) return redirect('/dashboard')

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    if (await prisma.stripeVerificationToken.findUnique({ where: { user_id: userId } })) {
        await prisma.stripeVerificationToken.delete({ where: { user_id: userId } })
    }

    let customer = await prisma.customer.findFirst({ where: { teen: teen.id, pro: userId } })

    if (!customer) {
        const stripeCustomer = (await stripe.customers.create({
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
        }, { stripeAccount: teen.privateMetadata.stripe_id.toString() })).id

        customer = await prisma.customer.create({ data: { id: stripeCustomer, teen: teen.id, pro: userId } })
    }

    const securityToken = await prisma.stripeVerificationToken.create({ data: { user_id: userId } })

    const stripeSession = await stripe.checkout.sessions.create(
        {
            customer: customer.id,
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'EUR',
                        product_data: {
                            name: "Paiement du job",
                            description: `Paiment pour le job: ${proposition.job.title} (payé en fonction des heures)`
                        },
                        unit_amount: 1000
                    },
                    quantity: proposition.job.hours
                }
            ],
            payment_intent_data: {
                application_fee_amount: ((1000 * proposition.job.hours) * 10) / 100
            },
            // TODO: Update to https before deploying
            success_url: `http://${args.request.headers.get('host')}/dashboard/pro/stripeCallback/success?token=${securityToken.id}&propId=${proposition.id}`,
            cancel_url: `http://${args.request.headers.get('host')}/dashboard/pro/stripeCallback/canceled?propId=${proposition.id}`
        },
        {
            stripeAccount: teen.privateMetadata.stripe_id.toString(),
        }
    )

    return redirect(stripeSession.url as string)
}