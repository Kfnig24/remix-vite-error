import { Button } from "@/components/ui/button"
import { getJob } from "@/lib/actions/cached_action"
import { checkIfTeenProposed } from "@/lib/actions/job"
import { CATEGORIES } from "@/lib/contants"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, CheckCircle2, XCircle } from "lucide-react"
import { redirect } from "next/navigation"
import { PropositionButton, RetirePropositionButton } from "./proposition_button"

const JobDetailPage = async ({ params }: { params: { id: number } }) => {
    const job = await getJob(params.id)
    const proposition = await checkIfTeenProposed(params.id)

    if (!job) return redirect('/teen/dashboard')

    const categorie = CATEGORIES.find(el => el.name === job.categorie)
    if (!categorie) return redirect('/teen/dashboard')

    return (
        <main className="px-8 text-gray-700">
            <div className="flex flex-row justify-between items-center">
                <h4 className="text-xl font-semibold">
                    {job.title}
                </h4>
                <p className="text-lg">
                    Par <span className="text-primary">{job.author.first_name}</span>
                </p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">

                <p className="text-muted-foreground text-left">
                    {job.description}
                </p>

                <div className="flex flex-row justify-end">
                    <div className="flex flex-col gap-4 text-right w-72">

                        <div className="flex flex-row items-center justify-between">
                            <span className="text-primary mr-8"><categorie.icon /></span> {job.categorie}
                        </div>

                        <div className="flex flex-row items-center justify-between">
                            <span className="text-primary mr-8"><Calendar /></span> {format(job.date, 'PPP', { locale: fr })}
                        </div>

                        <div className="flex flex-row items-center justify-between">
                            Disponible {job.paid ? <XCircle className="text-red-500" /> : <CheckCircle2 className="text-green-500" />}
                        </div>

                        <div className="flex flex-row items-center justify-between">
                            Completé {!job.completed ? <XCircle className="text-red-500" /> : <CheckCircle2 className="text-green-500" />}
                        </div>

                    </div>
                </div>

            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-row justify-end md:order-last">
                    <div className="flex flex-col gap-4 w-72 text-muted-foreground">
                        <h6 className="text-lg font-semibold text-primary">
                            Client :
                        </h6>

                        <div className="flex flex-row items-center justify-between">
                            <span className="font-medium text-gray-700">Nom:</span> {job.author.first_name} {job.author.last_name}
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <span className="font-medium text-gray-700">Ville:</span> {job.author.city}
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <span className="font-medium text-gray-700">Email:</span> {job.author.email}
                        </div>
                    </div>
                </div>


                <div className="text-center">
                    {job.paid ?
                        (proposition?.accepted ?
                            (job.completed ?
                                <>
                                    <span className="text-primary">Ce job est terminé</span>
                                </>
                                :
                                <>
                                    <span className="text-primary">Votre proposition a été accepté</span>
                                </>)
                            :
                            <>
                                <span className="text-primary">Ce job n'est plus disponible</span>
                            </>)
                        :
                        (proposition ?
                            <>
                                <h6 className="text-gray-700 font-medium mb-4 mt-16 md:mt-8">
                                    Vous vous êtes déjà proposé pour ce job
                                </h6>
                                <RetirePropositionButton job_id={params.id} />
                            </>
                            :
                            <>
                                <h6 className="text-gray-700 font-medium mb-4 mt-16 md:mt-8">
                                    Interessé par ce job ?
                                </h6>
                                <PropositionButton job_id={params.id} />
                            </>)
                    }
                </div>
            </section>


        </main>
    )
}

export default JobDetailPage