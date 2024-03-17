import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunction, redirect } from "@vercel/remix";
import prisma from "~/lib/db";

export const action: ActionFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect(`/auth/sign-in`)

    const job_id = args.params.jobId
    if (!job_id) return redirect(`/dashboard`)

    await prisma.job.delete({ where: { id: job_id, author: userId } })

    return redirect(`/dashboard`)
}