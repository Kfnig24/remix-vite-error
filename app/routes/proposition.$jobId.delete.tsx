import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunction, redirect } from "@vercel/remix";
import invariant from "tiny-invariant";
import prisma from "~/lib/db";

export const action: ActionFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)
    if (user.publicMetadata.accountType !== 'teen') return redirect('/dashboard')

    invariant(args.params.jobId, 'jobId manquant')

    const prop = await prisma.proposition.deleteMany({ where: { jobId: args.params.jobId, teen: userId } })

    return redirect(`/dashboard/jobs/${args.params.jobId}`)
}