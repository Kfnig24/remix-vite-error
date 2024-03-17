import { Link } from "@remix-run/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export const JobCategorie = ({ title, jobs }: { title: string, jobs: ({ title: string, description: string, date: string, id: string, categorie: string } | undefined | null)[] | null }) => {
    if (!jobs || jobs.length === 0 || jobs.every(el => el === undefined)) return (
        <div className="flex flex-col w-full">
            <h2 className="text-end text-xl text-gray-700 font-semibold mb-8">
                {title}
            </h2>
            <div className="w-full p-8 text-muted-foreground">
                <div className="flex flex-col gap-2 w-52 mx-auto">
                    <span className="mb-4">
                        Aucun jobs n'a été créé
                    </span>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-end text-xl text-gray-700 font-semibold mb-8">
                {title}
            </h2>
            <div className="flex overflow-x-auto space-x-8 h-60 p-4 scrollbar-hide md:scrollbar-default">
                {jobs.map(job => <JobCard key={job?.id} job={job} />)}
            </div>
        </div>
    )
}

export const JobCard = ({ job }: { job: { title: string, description: string, date: string, id: string, categorie: string } | undefined | null }) => {
    if (!job) return null

    return (
        <div className="p-4 flex-shrink-0 rounded-md shadow-md w-96 h-48 text-gray-800 flex flex-col justify-between">
            <div className="flex flex-row justify-between items-center">
                <Link to={`/dashboard/jobs/${job.id}`}>
                    <h5 className="line-clamp-1 font-semibold text-lg">
                        {job.title}
                    </h5>
                </Link>
                <p className="text-primary line-clamp-4">
                    {job.categorie}
                </p>
            </div>

            <p className="text-sm text-muted-foreground">
                {job.description}
            </p>

            <div className="flex-row flex justify-end">
                <p className="text-">
                    {format(job.date, 'P', { locale: fr })}
                </p>
            </div>
        </div>
    )
}