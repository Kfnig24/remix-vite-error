import { JobCategorie } from "@/components/jobs"
import { Button } from "@/components/ui/button"
import { getPropositionsFromTeen } from "@/lib/actions/cached_action"
import Link from "next/link"

const PropositionsPage = async () => {
    const propositions = await getPropositionsFromTeen()

    if (!propositions) return (
        <div className="w-full p-8 text-muted-foreground">
            <div className="flex flex-col gap-2 w-52 mx-auto">
                <span className="mb-4 text-center">
                    Vous vous êtes proposé à aucun job
                </span>
                <Button asChild>
                    <Link href={'/teen/dashboard/'}>
                        Allez se proposer
                    </Link>
                </Button>
            </div>
        </div>
    )

    const completedJobs = propositions.map(prop => {
        // if (!prop.jobs) return redirect('/teen/dashboard')
        if (prop.accepted && prop.jobs?.completed) return prop.jobs
    })

    const acceptedJobs = propositions.map(prop => {
        // if (!prop.jobs) return redirect('/teen/dashboard')
        if (prop.accepted && !prop.jobs?.completed) return prop.jobs
    })
    
    const waitingJobs = propositions.map(prop => {
        // if (!prop.jobs) return redirect('/teen/dashboard')
        if (!prop.accepted) return prop.jobs
    })

    return (
        <section>
            <JobCategorie type="teen" title="Terminé" jobs={completedJobs} />
            <JobCategorie type="teen" title="Accepté" jobs={acceptedJobs} />
            <JobCategorie type="teen" title="En attente" jobs={waitingJobs} />
        </section>
    )
}

export default PropositionsPage