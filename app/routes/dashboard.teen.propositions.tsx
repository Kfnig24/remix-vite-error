import { createClerkClient } from "@clerk/remix/api.server"
import { getAuth } from "@clerk/remix/ssr.server"
import { LoaderFunction, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { JobCategorie } from "~/components/jobs"
import prisma from "~/lib/db"

type PropositionsParams = {
    title: string;
    jobs: ({
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
    })[]
}[]

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)
    if (user.publicMetadata.accountType !== 'teen') return redirect('/dashboard')

    const propositions = await prisma.proposition.findMany({ where: { teen: userId }, include: { job: true } })

    return {
        propositions: [
            {
                title: "Jobs complétés",
                jobs: propositions.filter(prop => prop.accepted && prop.job.completed).map(prop => { return { ...prop.job, address: '' } })
            },
            {
                title: "Jobs acceptés",
                jobs: propositions.filter(prop => prop.accepted && !prop.job.completed).map(prop => { return { ...prop.job, address: '' } })
            },
            {
                title: "Jobs en attente",
                jobs: propositions.filter(prop => !prop.accepted && !prop.job.completed && !prop.job.paid).map(prop => { return { ...prop.job, address: '' } })
            },
            {
                title: "Jobs refusés",
                jobs: propositions.filter(prop => !prop.accepted && (prop.job.completed || prop.job.paid)).map(prop => { return { ...prop.job, address: '' } })
            },
        ]
    }
}

const DashboardPropositionTeen = () => {
    const { propositions } = useLoaderData<{ propositions: PropositionsParams }>()

    return (
        <section>
            {propositions.map(cat => <JobCategorie key={cat.title} title={cat.title} jobs={cat.jobs} />)}
        </section>
    )
}

export default DashboardPropositionTeen