import { getClientAccount } from "@/lib/actions/cached_action"
import { isClientOnboarded } from "@/lib/actions/user"
import { CLIENT_NAVBAR_LINKS } from "@/lib/contants"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"
import UpdateClientAccountDialogWrapper from "@/components/updateClientAccountDialog"

const ClientUserLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    if (await isClientOnboarded() !== "onboarded") return redirect('/onboarding')

    const supabase = await createServerComponentClient({ cookies })

    const client = await getClientAccount((await supabase.auth.getSession()).data.session?.user.id as string)
    if (!client) return redirect('/auth')

    return (
        <>
            <UpdateClientAccountDialogWrapper client_data={{
                first_name: client.first_name,
                last_name: client.last_name,
                address: client.address,
                city: client.city,
                email: client.email as string
            }}>
                <main className="flex flex-row">
                    <Sidebar links={CLIENT_NAVBAR_LINKS} />
                    <section className="w-full">
                        <Topbar first_name={client?.first_name as string} type={'client'} />
                        <div className="p-4">
                            {children}
                        </div>
                    </section>
                </main>
            </UpdateClientAccountDialogWrapper>
        </>
    )
}

export default ClientUserLayout