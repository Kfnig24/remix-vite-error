import { createClerkClient } from "@clerk/remix/api.server"
import { getAuth } from "@clerk/remix/ssr.server"
import { LoaderFunction, MetaFunction, json, redirect } from "@vercel/remix"
import { Form, Outlet, useLoaderData } from "@remix-run/react"
import Sidebar from "~/components/sidebar"
import Topbar from "~/components/topbar"
import { Button } from "~/components/ui/button"
import { PRO_NAVBAR_LINKS, TEEN_NAVBAR_LINKS } from "~/lib/constants"

export const meta: MetaFunction = () => [
    { title: 'JobTeen | Dashboard' }
]

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)

    if (!user.publicMetadata.onboarded) return redirect('/onboarding')

    if (!user.privateMetadata.paid) return json({
        accountType: user.publicMetadata.accountType,
        first_name: user.firstName,
        block: true
    })

    return json({
        accountType: user.publicMetadata.accountType,
        first_name: user.firstName,
    })
}

const Dashboard = () => {
    const { accountType, first_name, block } = useLoaderData<typeof loader>()
    const links = accountType === 'teen' ? TEEN_NAVBAR_LINKS : PRO_NAVBAR_LINKS

    return (
        <main className="flex flex-row">
            <Sidebar links={links} />
            <section className="w-full lg:ml-64">
                <Topbar first_name={first_name} links={links} />
                <div className="p-4">

                    {
                        block ? (
                            <div className="text-center">
                                <h2 className="text-lg text-gray-700 font-semibold mb-4">
                                    Le paiement des frais d'inscription est nécessaire pour accéder au réseau JobTeen.
                                </h2>
                                <div className="flex flex-col gap-4 md:flex-row items-center justify-center">
                                    <Form method="post" action="/onboarding/teen/payFee">
                                        <Button type="submit" size={'lg'}>
                                            Les payer maintenant
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        ) : (<Outlet context={{ accountType }} />)
                    }

                </div>
            </section>
        </main>
    )
}

export default Dashboard