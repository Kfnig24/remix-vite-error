import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunction, LoaderFunction, redirect } from "@vercel/remix";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import prisma from "~/lib/db";

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)
    if (user.publicMetadata.accountType !== 'pro') return redirect('/dashboard')

    invariant(args.params.jobId, 'jobId manquant')

    const acceptedProp = await prisma.proposition.findFirst({ where: { jobId: args.params.jobId, accepted: true, job: { completed: true, paid: true } }, include: { job: true } })
    if (!acceptedProp || acceptedProp.job.author !== userId) return redirect('/dashboard')

    const teen = await clerkClient.users.getUser(acceptedProp.teen)

    return {
        teen: {
            first_name: teen.firstName,
            last_name: teen.lastName,
            id: teen.id
        }
    }
}

export const action: ActionFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)
    if (user.publicMetadata.accountType !== 'pro') return redirect('/dashboard')

    const formData = await args.request.formData()
    const formDataNote = formData.get('note')
    const teen_id = formData.get('teen_id')
    if (!formDataNote || !teen_id) return {}
    const note = +formDataNote

    const teen = await clerkClient.users.getUser(teen_id.toString())

    const count = await prisma.proposition.count({ where: { teen: teen.id, accepted: true } })

    await clerkClient.users.updateUser(teen.id, { publicMetadata: { ...teen.publicMetadata, note: ((teen.publicMetadata.note as number)*count + note)/(count + 1) } })

    return redirect(`/dashboard/jobs/${args.params.jobId}`)
}

export default function NoteTeen() {
    const { teen } = useLoaderData<typeof loader>()

    return (
        <section className="p-4 text-gray-700">
            <h2 className="text-xl text-gray-800 font-semibold text-right md:text-left">
                Comment avez vous trouvé la prestation de {teen.first_name} {teen.last_name} ?
            </h2>

            <Form className="flex flex-col gap-8 mt-8 items-start w-full max-w-2xl" method="post">

                <input type="hidden" name="teen_id" value={teen.id} />

                <div className="flex justify-between items-center">
                    <Input name="note" type="number" min={0} required max={10} placeholder="Note" className="w-3/4 p-6 text-md" />
                    <span>/ 10</span>
                </div>

                <Button size={'lg'} type="submit">
                    Le noter
                </Button>

            </Form>
        </section>
    )
}