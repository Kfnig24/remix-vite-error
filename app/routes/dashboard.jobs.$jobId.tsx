import { User, createClerkClient } from "@clerk/remix/api.server"
import { getAuth } from "@clerk/remix/ssr.server"
import { LoaderFunction, redirect } from "@remix-run/node"
import { Form, useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, CheckCircle2, XCircle } from "lucide-react"
import invariant from "tiny-invariant"
import { Button } from "~/components/ui/button"
import UpdateJobDialogWrapper, { UpdateJobDialogTrigger } from "~/components/updateJobDialog"
import { CATEGORIES } from "~/lib/constants"
import prisma from "~/lib/db"

type JobParam = {
  address: string;
  id: string;
  created_at: Date;
  author: {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
  };
  title: string;
  description: string;
  categorie: string;
  paid: boolean;
  completed: boolean;
  city: string;
  date: Date;
  hours: number;
}

type Propositions = {
  teen: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    note: string | null;
  };
  id: string;
  created_at: Date;
  accepted: boolean;
  jobId: string;
}[]

type AcceptedProp = {
  teen: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    note: string | null;
  };
  id: string;
  created_at: Date;
  accepted: boolean;
  jobId: string;
}

type Proposition = {
  id: string;
  created_at: Date;
  accepted: boolean;
  teen: string;
  jobId: string;
}

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (!userId) return redirect('/auth/sign-in')

  invariant(args.params.jobId, "jobId manquant")

  const data = await prisma.job.findUnique({ where: { id: args.params.jobId } })
  if (!data) return redirect('/dashboard')

  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  const user = await clerkClient.users.getUser(userId)

  let propositions: Proposition[] = []

  let acceptedProp: Proposition | undefined | null = undefined
  let acceptedTeen: User | null = null

  let teenProp: Proposition | undefined | null = undefined

  if (user.publicMetadata.accountType === 'pro' && !data.paid) {
    propositions = await prisma.proposition.findMany({ where: { job: { id: data.id } } })
    console.log(propositions)
  } else if (user.publicMetadata.accountType === "pro" && data.paid) {
    acceptedProp = await prisma.proposition.findFirst({ where: { accepted: true, job: { id: data.id } } })

    if (!acceptedProp) return redirect('/dashboard')

    acceptedTeen = await clerkClient.users.getUser(acceptedProp.teen)
  } else if (user.publicMetadata.accountType === 'teen') {
    teenProp = await prisma.proposition.findUnique({ where: { teen_jobId: { teen: userId, jobId: data.id } } })
  } else return redirect('/dashboard')

  return {
    job: {
      ...data,
      address: data.paid ? data.address : "",
      author: {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        id: data.author
      }
    },
    userId,
    propositions: await Promise.all(propositions?.map(async prop => {
      const teen = await clerkClient.users.getUser(prop.teen)

      return {
        ...prop,
        teen: {
          id: prop.teen,
          first_name: teen.firstName,
          last_name: teen.lastName,
          note: teen.publicMetadata.note?.toString()
        }
      }
    })),
    acceptedProp: acceptedProp ? {
      ...acceptedProp,
      teen: {
        id: acceptedProp?.teen,
        first_name: acceptedTeen?.firstName,
        last_name: acceptedTeen?.lastName,
        note: acceptedTeen?.publicMetadata.note?.toString()
      }
    } : null,
    teenProp
  }
}

const JobDetails = () => {
  const { accountType } = useOutletContext<{ accountType: string }>()
  const { job, userId, teenProp, propositions, acceptedProp } = useLoaderData<{ job: JobParam, userId: string, teenProp: Proposition | undefined | null, propositions: Propositions, acceptedProp: AcceptedProp | undefined | null }>()
  const navigate = useNavigate()

  const categorie = CATEGORIES.find(el => el.name === job.categorie)
  if (!categorie) return navigate('/client/dashboard')

  return (
    <UpdateJobDialogWrapper job_data={{ ...job, date: new Date(job.date) }}>
      <main className="px-8 text-gray-700">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            <h4 className="text-xl font-semibold">
              {job.title}
            </h4>
            {accountType === "pro" && userId === job.author.id ? <UpdateJobDialogTrigger>
              <Button>
                Modifier
              </Button>
            </UpdateJobDialogTrigger> : ""}
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

              <div className="flex flex-row items-center justify-between">
                <span>Nombre d'heures prévues</span> <span >{job.hours}h</span>
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
                <span className="font-medium text-gray-700">Ville:</span> {job.city}
              </div>

              {(teenProp?.accepted) || userId === job.author.id ? (
                <div className="flex flex-row items-center justify-between">
                  <span className="font-medium text-gray-700">Addresse:</span> {job.address}
                </div>
              ) : ""}

              <div className="flex flex-row items-center justify-between">
                <span className="font-medium text-gray-700">Email:</span> {job.author.email}
              </div>
            </div>
          </div>

          {
            accountType === 'teen' ? (

              <div className="text-center">
                {job.paid ?
                  (teenProp?.accepted ?
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
                  (teenProp ?
                    <>
                      <h6 className="text-gray-700 font-medium mb-4 mt-16 md:mt-8">
                        Vous vous êtes déjà proposé pour ce job
                      </h6>
                      <Form method="post" action={`/proposition/${job.id}/delete`}>
                        <Button type="submit" variant={'destructive'} size={'lg'}>
                          Se retirer
                        </Button>
                      </Form>
                    </>
                    :
                    <>
                      <h6 className="text-gray-700 font-medium mb-4 mt-16 md:mt-8">
                        Interessé par ce job ?
                      </h6>
                      <Form method="post" action={`/proposition/${job.id}/create`}>
                        <Button type="submit" size={'lg'}>
                          Se proposer
                        </Button>
                      </Form>
                    </>)
                }
              </div>

            ) : (

              <div className="mt-16 w-80">
                <h6 className="text-lg font-semibold text-primary">
                  Propositions:
                </h6>

                <div className="px-4 mt-4">
                  {propositions?.length === 0 && !acceptedProp ?
                    <span className="text-muted-foreground">
                      Il n'y a aucune proposition pour le moment
                    </span>
                    : (!acceptedProp ?
                      propositions?.map(prop => (
                        <div key={prop.id} className="flex flex-row justify-between items-center w-96 bg-slate-50 p-2 rounded-md">
                          <div className="flex flex-row gap-1 items-center">
                            <h6>
                              {prop.teen.first_name} {prop.teen.last_name}
                            </h6>
                            <p className="text-muted-foreground text-sm pl-2">
                              {prop.teen.note}
                            </p>
                          </div>

                          <div className="flex flex-row gap-4">
                            <Form method="post" action={`/proposition/${prop.id}/accept`}>
                              <Button type="submit" size={'icon'}>
                                <CheckCircle2 />
                              </Button>
                            </Form>
                          </div>
                        </div>
                      ))
                      : (job.completed ? (
                        <div className="flex flex-row justify-between items-center w-96 bg-slate-50 p-2 rounded-md">
                          <h6 className="text-primary">
                            Job completé par:
                          </h6>
                          <p className="text-muted-foreground">
                            {acceptedProp.teen.first_name} {acceptedProp.teen.last_name}
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
                                {acceptedProp.teen.first_name} {acceptedProp.teen.last_name}
                              </h6>
                              <p className="text-muted-foreground text-sm pl-2">
                                {acceptedProp.teen.note}
                              </p>
                            </div>
                          </div>
                          <Form method="post" action={`/job/${job.id}/complete`}>
                            <Button type="submit">
                              Terminé
                            </Button>
                          </Form>
                        </div>)
                      ))
                  }
                </div>

              </div>
            )
          }

        </section>


      </main>
    </UpdateJobDialogWrapper>
  )
}

export default JobDetails