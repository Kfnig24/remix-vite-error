import { JobCategorie } from "@/components/jobs"
import { getJobsFromCategorie } from "@/lib/actions/cached_action"
import { CATEGORIES } from "@/lib/contants"

const TeenDashboard = async () => {
  const jobs: {
    categorie: string, jobs: {
      title: string,
      description: string,
      date: string,
      id: number,
      categorie: string,
    }[] | null
  }[] = await Promise.all(CATEGORIES.map(async (cat) => {
    const catJobs = await getJobsFromCategorie(cat.name)

    return {
      categorie: cat.name,
      jobs: catJobs
    }
  }))

  
  return (
    <section>
      {jobs.map(cat => <JobCategorie key={cat.categorie} type="teen" title={cat.categorie} jobs={cat.jobs} />)}
    </section>
  )
}

export default TeenDashboard