import { createClerkClient } from "@clerk/remix/api.server"
import { getAuth } from "@clerk/remix/ssr.server"
import { LoaderFunction, redirect } from "@vercel/remix"
import { Outlet, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import prisma from "~/lib/db"

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (!userId) return redirect('/auth/sign-in')

  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  const user = await clerkClient.users.getUser(userId)
  if (user.publicMetadata.accountType !== 'pro') return redirect('/dashboard')

  invariant(args.params.status, "Status de la transaction n'est pas fourni")

  const status = args.params.status

  const url = new URL(args.request.url)
  const token = url.searchParams.get('token')
  const propId = url.searchParams.get('propId')
  if (!propId) return redirect('/dashboard')

  const proposition = await prisma.proposition.findUnique({ where: { id: propId } })
  if (!proposition) return redirect('/dashboard')

  if (status === 'canceled') return redirect(`/dashboard/jobs/${proposition.jobId}`)

  if (!token) return redirect('/dashboard')

  const dbToken = await prisma.stripeVerificationToken.findUnique({ where: { id: token } })
  if (!dbToken) return { status, error: "Token non valide" }
  if (dbToken.user_id !== userId) return { status, error: "Token non valide" }

  await prisma.stripeVerificationToken.delete({ where: { id: dbToken.id } })

  await prisma.proposition.update({ where: { id: propId }, data: { accepted: true } })
  await prisma.job.update({ where: { id: proposition.jobId }, data: { paid: true } })

  return redirect(`/dashboard/jobs/${proposition.jobId}`)
}

export default function stripeCallback () {
  return <Outlet />
}