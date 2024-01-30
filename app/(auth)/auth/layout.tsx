import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const ConnectionLayout = async ({
    children
} : {
    children: React.ReactNode
}) => {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (session) return redirect('/connected')

  return (
    <>
        {children}
    </>
  )
}

export default ConnectionLayout