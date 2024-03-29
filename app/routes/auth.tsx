import { getAuth } from "@clerk/remix/ssr.server"
import type { LoaderFunction, MetaFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Outlet } from "@remix-run/react"


export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (userId) return redirect('/onboarding')

  return {}
}

const Auth = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex justify-center items-center">
        <Outlet />
    </div>
  )
}

export default Auth