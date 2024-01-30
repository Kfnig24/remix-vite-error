import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAccountType, getJob } from "@/lib/actions/cached_action"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { unstable_cache } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const getAcceptedProposition = unstable_cache(async (job_id: number) => {
  const supabase = createServerActionClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return null

  const { data } = await supabase.from('propositions').select(`
      accepted,
      teens (
          first_name,
          last_name,
          note
      ),
      user_id,
      id
  `).eq('job', job_id).eq("accepted", true).single()

  return data
}, [], { revalidate: 3600, tags: ['propositions', 'jobs'] })


const NotePage = async ({ params: { id } }: { params: { id: number } }) => {
  const job = await getJob(id)
  const prop = await getAcceptedProposition(id)

  if (!job || !prop || !job.completed || !prop.teens?.note) return redirect('/client/dashboard')

  const noteTeen = async (formData: FormData) => {
    'use server'

    const formNote = formData.get('note')?.toString()
    if (!formNote) return
    const note = +formNote

    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const account_type = await getAccountType(session.user.id)
    if (!account_type) return redirect('/onboarding')
    if (account_type !== 'client') return redirect('/teen/dashboard')

    let { count } = await supabase.from('propositions').select('', { count: 'exact', head: true }).eq('user_id', prop.user_id).eq('accepted', true)
    if (!count) count = 0

    const newNote: number = ((prop.teens?.note as number)*count + note)/(count + 1)
    await supabase.from('teens').update({ note: newNote }).eq('user_id', prop.user_id)

    return redirect(`/client/jobs/${id}`)
  }

  return (
    <section className="p-4 text-gray-700">
      <h2 className="text-xl text-gray-800 font-semibold text-right md:text-left">
        Comment avez vous trouvé la prestation de {prop.teens?.first_name} {prop.teens?.last_name} ?
      </h2>

      <form className="flex flex-col gap-8 mt-8 items-start" action={noteTeen}>

        <Input name="note" type="number" min={0} required max={10} placeholder="Note" className="w-3/4 p-6 text-md" />

        <Button size={'lg'} type="submit">
          Le noter
        </Button>

      </form>
    </section>
  )
}

export default NotePage