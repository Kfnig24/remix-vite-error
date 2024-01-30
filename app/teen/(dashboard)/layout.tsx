import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"
import { getTeenAccount } from "@/lib/actions/cached_action"
import { isTeenOnboarded } from "@/lib/actions/user"
import { TEEN_NAVBAR_LINKS } from "@/lib/contants"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import UpdateTeenAccountDialogWrapper from "@/components/updateTeenAccountDialog"

const ClientUserLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const authStatus = await isTeenOnboarded()
    if (authStatus === 'charges_unabled') return redirect('/teen/auth/stripeOnboarding?status=return')
    if (authStatus === 'authenticated') return redirect('/onboarding')
    if (authStatus === 'non-paid') return redirect('/teen/auth/non-paid')

    const supabase = await createServerComponentClient({ cookies })

    const teen = await getTeenAccount((await supabase.auth.getSession()).data.session?.user.id as string)
    if (!teen) return redirect('/auth')

    return (
        <>
            <UpdateTeenAccountDialogWrapper teen_data={{
                first_name: teen.first_name,
                last_name: teen.last_name,
                email: teen.email as string
            }}>
                <main className="flex flex-row">
                    <Sidebar links={TEEN_NAVBAR_LINKS} />
                    <section className="w-full">
                        <Topbar first_name={teen?.first_name as string} type={'teen'} />
                        <div className="p-4">
                            {children}
                        </div>
                    </section>
                </main>
            </UpdateTeenAccountDialogWrapper>
        </>
    )
}

export default ClientUserLayout