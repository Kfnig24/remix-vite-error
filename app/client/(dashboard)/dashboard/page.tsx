import { JobCategorie } from "@/components/jobs"
import { Button } from "@/components/ui/button"
import { getCompleteJobsFromClient, getLatestJobsFromClient, getPaidJobsFromClient } from "@/lib/actions/cached_action"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

const ClientDashboardPage = async () => {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return redirect('/auth')

  const latestJobs = await getLatestJobsFromClient(session.user.id)
  const paidJobs = await getPaidJobsFromClient()
  const completeJobs = await getCompleteJobsFromClient()

  return (
    <section>
      <JobCategorie type="client" title="Jobs terminés" jobs={completeJobs} />
      <JobCategorie type="client" title="Jobs acceptés" jobs={paidJobs} />
      <JobCategorie type="client" title="Jobs récents" jobs={latestJobs} />
    </section>
  )
}

export default ClientDashboardPage