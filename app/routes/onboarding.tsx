import { getAuth } from "@clerk/remix/ssr.server"
import { LoaderFunction, MetaFunction, TypedResponse, redirect } from "@vercel/remix"
import { createClerkClient } from '@clerk/remix/api.server'
import { Outlet, useLoaderData } from "@remix-run/react"
import Logo from "~/components/logo"
import { UserButton } from "@clerk/remix"

export const meta: MetaFunction = () => [
    { title: 'Créer son compte JobTeen' }
]

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const user = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(userId)
    if (user.publicMetadata.onboarded && user.publicMetadata.accountType) return redirect(`/dashboard`)

    return {
        accountType: user.publicMetadata.accountType
    }
}

function OnBoardingPage() {
    const { accountType } = useLoaderData<typeof loader>()

    return (
        <div className="relative flex justify-center items-center h-screen w-screen overflow-hidden bg-gradient-to-br from-white to-primary/20">
            <div className="absolute top-0 left-0 p-8 justify-between flex flex-row w-full">
                <Logo />
                <UserButton />
            </div>

            <main className="p-8 border-[1px] rounded-lg shadow-sm bg-white">
                <Outlet context={{ accountType }} />
            </main>
        </div>
    )
}

export default OnBoardingPage