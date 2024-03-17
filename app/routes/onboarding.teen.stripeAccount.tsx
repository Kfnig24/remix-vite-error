import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@vercel/remix";
import { Outlet } from "@remix-run/react";
import Stripe from "stripe";

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)

    if (user.publicMetadata.accountType !== "teen") return redirect(`/dashboard`)
    if (!user.privateMetadata.birthdate) return redirect(`/onboarding/teen`)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    let stripe_id: string
    if (user.privateMetadata.stripe_id) {
        const onboarded = (await stripe.accounts.retrieve({
            stripeAccount: user.privateMetadata.stripe_id.toString()
        })).charges_enabled
        if (onboarded) return redirect('/dashboard')

        stripe_id = user.privateMetadata.stripe_id.toString()
    } else {
        const account = await stripe.accounts.create({
            type: 'standard',
            email: user.emailAddresses[0].emailAddress,
            business_type: 'individual',
            business_profile: {
                product_description: 'Service au particuliers et entreprises via JobTeen',
                url: 'http://jobteen.lu',
                mcc: '8999',
            },
            individual: {
                first_name: user.firstName?.toString(),
                last_name: user.lastName?.toString(),
                email: user.emailAddresses[0].emailAddress,
            }
        })
        await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { stripe_id: account.id, ...user.privateMetadata } })
        stripe_id = account.id
    }

    const accountLink = await stripe.accountLinks.create({
        account: stripe_id,
        type: 'account_onboarding',
        // TODO: Update to https before deploying
        return_url: `http://${args.request.headers.get('host')}/onboarding/teen/stripeAccount/return`,
        refresh_url: `http://${args.request.headers.get('host')}/onboarding/teen/stripeAccount/refresh`,
    })
    return redirect(accountLink.url)
}

export default function StripeAccount () {
    return <Outlet />
}