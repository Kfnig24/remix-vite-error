import { getAuth } from "@clerk/remix/ssr.server"
import { LoaderFunction, redirect } from "@remix-run/node"

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    return {}
}

const DashboardIndex = () => {
    return (
        <div>Dashboard</div>
    )
}

export default DashboardIndex