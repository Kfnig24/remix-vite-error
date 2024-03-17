import { createClerkClient } from "@clerk/remix/api.server"
import { getAuth } from "@clerk/remix/ssr.server"
import { LoaderFunction, redirect } from "@vercel/remix"
import { useLoaderData, useOutletContext } from "@remix-run/react"
import { JobCategorie } from "~/components/jobs"
import { CATEGORIES } from "~/lib/constants"
import prisma from "~/lib/db"

type JobsParams = {
    title: string;
    jobs: {
        address: string;
        id: string;
        created_at: Date;
        author: string;
        title: string;
        description: string;
        categorie: string;
        paid: boolean;
        completed: boolean;
        city: string;
        date: Date;
        hours: number;
    }[];
}[]

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)

    if (user.publicMetadata.accountType === 'pro') {
        const myJobs = await prisma.job.findMany({ where: { author: userId } })
        
        return {
            jobs: [
                {
                    title: "Jobs terminés",
                    jobs: myJobs.filter(job => job.completed).map(job => { return { ...job, address: "" } })
                },
                {
                    title: "Jobs acceptés",
                    jobs: myJobs.filter(job => job.paid).map(job => { return { ...job, address: "" } })
                },
                {
                    title: "Jobs récents",
                    jobs: myJobs.filter(job => (new Date().getTime() - job.created_at.getTime()) <= 604800000).map(job => { return { ...job, address: "" } })
                }
            ]
        }
    } else if (user.publicMetadata.accountType === 'teen') {
        const jobs = await Promise.all(CATEGORIES.map(async (cat) => {
            const catJobs = await prisma.job.findMany({ where: { categorie: cat.name, paid: false, completed: false } })
        
            return {
              title: cat.name,
              jobs: catJobs.map(job => { return { ...job, address: "" } })
            }
          }))

        return {
            jobs
        }
    } else {
        return {}
    }
}

const DashboardIndex = () => {
    const { accountType } = useOutletContext<{ accountType: string }>()
    const { jobs } = useLoaderData<{ jobs: JobsParams }>()

    return (
        <section>
            {jobs.map((cat) => <JobCategorie key={cat.title} title={cat.title} jobs={cat.jobs} />)}
        </section>
    )
}

export default DashboardIndex