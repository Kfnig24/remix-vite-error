import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Stripe from "stripe";
import { Button } from "~/components/ui/button";

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)

    if (user.publicMetadata.accountType !== "teen") return redirect(`/dashboard`)
    if (!user.privateMetadata.birthdate) return redirect(`/onboarding/teen`)
    if (!user.privateMetadata.stripe_id) return redirect('/onboarding/teen/stripeAccount')

    const status = args.params.status
    if (status === "refresh") return redirect('/onboarding/teen/stripeAccount')

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const onboarded = (await stripe.accounts.retrieve({
        stripeAccount: user.privateMetadata.stripe_id.toString()
    })).charges_enabled

    if (onboarded) {
        await clerkClient.users.updateUser(userId, { publicMetadata: { onboarded: true, accountType: user.publicMetadata.accountType } })
    }

    return {
        onboarded
    }
}

export default function StripeAccountReturn() {
    const { onboarded } = useLoaderData<typeof loader>()

    if (onboarded) return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl text-gray-700 font-semibold text-center">
                Vous êtes prêt pour faire de l'argent !
            </h2>
            <Button asChild size={'lg'}>
                <Link to={'/dashboard'}>
                    Let's go !
                </Link>
            </Button>
        </div>
    )

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl text-gray-700 font-semibold text-center">
                Vous avez besoin d'un compte Stripe valide pour continuer
            </h2>
            <Button asChild size={'lg'}>
                <Link to={'/onboarding/teen/stripeAccount'}>
                    Compris !
                </Link>
            </Button>
        </div>
    )
}