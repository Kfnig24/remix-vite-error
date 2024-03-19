import { getAuth } from "@clerk/remix/ssr.server"
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node"
import { Outlet } from "@remix-run/react"
import Topbar from "~/components/topbar"

export const meta: MetaFunction = () => [
    { title: 'JobTeen | Dashboard' }
]

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    return {}
}

const Dashboard = () => {
    return (
        <main className="flex flex-row">
            <section className="w-full lg:ml-64">
                <Topbar />
                <div className="p-4">

                    (<Outlet />)


                </div>
            </section>
        </main>
    )
}

export default Dashboard