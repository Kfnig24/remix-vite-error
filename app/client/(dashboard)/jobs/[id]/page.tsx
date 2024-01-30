import { Button } from "@/components/ui/button"
import UpdateJobDialogWrapper, { UpdateJobDialogTrigger } from "@/components/updateJobDialog"
import { getJob, getPropositionsFromJob } from "@/lib/actions/cached_action"
import { CATEGORIES } from "@/lib/contants"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, CheckCircle2, XCircle } from "lucide-react"
import { redirect } from "next/navigation"
import PropositionButtons, { FinishButton } from "./proposition_buttons"

const JobDetailPage = async ({ params }: { params: { id: number } }) => {
  const job = await getJob(params.id)
  const propositions = await getPropositionsFromJob(params.id)
  const acceptedProp = propositions?.filter(prop => prop.accepted)

  if (!job) return redirect('/client/dashboard')

  const categorie = CATEGORIES.find(el => el.name === job.categorie)
  if (!categorie) return redirect('/client/dashboard')

  return (
    <UpdateJobDialogWrapper job_data={job}>
      <main className="px-8 text-gray-700">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            <h4 className="text-xl font-semibold">
              {job.title}
            </h4>
            <UpdateJobDialogTrigger>
              <Button>
                Modifier
              </Button>
            </UpdateJobDialogTrigger>
          </div>
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

          <div className="mt-16 w-80">
            <h6 className="text-lg font-semibold text-primary">
              Propositions:
            </h6>

            <div className="px-4 mt-4">
              {propositions === null || propositions.length === 0 ?
                <span className="text-muted-foreground">
                  Il n'y a aucune proposition pour le moment
                </span>
                :( acceptedProp === undefined || acceptedProp.length === 0 ?
                  propositions.map(prop => (
                    <div key={prop.id} className="flex flex-row justify-between items-center w-96 bg-slate-50 p-2 rounded-md">
                      <div className="flex flex-row gap-1 items-center">
                        <h6>
                          {prop.teens?.first_name} {prop.teens?.last_name}
                        </h6>
                        <p className="text-muted-foreground text-sm pl-2">
                          {prop.teens?.note}
                        </p>
                      </div>

                      <PropositionButtons prop_id={prop.id} />
                    </div>
                  ))
                  : (job.completed ? (
                    <div className="flex flex-row justify-between items-center w-96 bg-slate-50 p-2 rounded-md">
                      <h6 className="text-primary">
                        Job completé par: 
                      </h6>
                      <p className="text-muted-foreground">
                        {acceptedProp[0].teens?.first_name} {acceptedProp[0].teens?.last_name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-row justify-between items-center w-96 bg-slate-50 p-2 rounded-md">
                      <div>
                        <h6 className="text-primary">
                          Teen:
                        </h6>
                        <div className="flex flex-row gap-1 items-center pl-2">
                          <h6>
                            {acceptedProp[0].teens?.first_name} {acceptedProp[0].teens?.last_name}
                          </h6>
                          <p className="text-muted-foreground text-sm pl-2">
                            {acceptedProp[0].teens?.note}
                          </p>
                        </div>
                      </div>
                      <FinishButton job_id={params.id} />
                    </div>)
                  ))
              }
            </div>

          </div>

        </section>


      </main>
    </UpdateJobDialogWrapper>
  )
}

export default JobDetailPage