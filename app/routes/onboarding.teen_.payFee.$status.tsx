import { createClerkClient } from "@clerk/remix/api.server"
import { getAuth } from "@clerk/remix/ssr.server"
import { LoaderFunction, redirect } from "@remix-run/node"
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react"
import { CiCircleCheck } from "react-icons/ci"
import { MdErrorOutline } from "react-icons/md"
import invariant from 'tiny-invariant'
import { Button } from "~/components/ui/button"
import prisma from "~/lib/db"

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (!userId) return redirect('/auth/sign-in')

  invariant(args.params.status, "Status de la transaction n'est pas fourni")
  const status = args.params.status
  if (status === 'canceled') return { status }

  const url = new URL(args.request.url)
  const token = url.searchParams.get('token')
  if (!token) return { status, error: "Token non valide" }

  const dbToken = await prisma.stripeVerificationToken.findUnique({ where: { id: token } })
  if (!dbToken) return { status, error: "Token non valide" }
  if (dbToken.user_id !== userId) return { status, error: "Token non valide" }

  await prisma.stripeVerificationToken.delete({ where: { id: dbToken.id } })

  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  const user = await clerkClient.users.getUser(userId)
  await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { paid: true, ...user.privateMetadata } })

  return {
    status
  }
}

const OnBoardingTeenStatus = () => {
  const { status, error } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  if (error) return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-red-500 text-8xl">
        <MdErrorOutline />
      </div>
      <h2 className="text-xl text-gray-700 font-semibold">
        {error}
      </h2>
      <div className="flex md:flex-row gap-2 flex-col">
        <Button disabled={navigation.state !== 'idle'} size={'lg'} variant={'destructive'} asChild>
          <Link to={'/onboarding/teen/stripeAccount'}>
            S'en occuper plus tard
          </Link>
        </Button>
        <Form method='POST' action='/onboarding/teen/payFee'>
          <Button disabled={navigation.state !== 'idle'} size={'lg'}>
            Recommencer
          </Button>
        </Form>
      </div>
    </div>
  )

  if (status === 'success') return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-green-500 text-8xl">
        <CiCircleCheck />
      </div>
      <h2 className="text-xl text-gray-700 font-semibold">
        Nous avons bien reçu votre paiement
      </h2>
      <Button disabled={navigation.state !== 'idle'} asChild size={'lg'} >
        <Link to={'/onboarding/teen/stripeAccount'}>
          Continuer
        </Link>
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-yellow-500 text-8xl">
        <MdErrorOutline />
      </div>
      <h2 className="text-xl text-gray-700 font-semibold">
        Le paiement a été abandonné
      </h2>
      <div className="flex md:flex-row gap-2 flex-col">
        <Button disabled={navigation.state !== 'idle'} size={'lg'} variant={'destructive'} asChild>
          <Link to={'/onboarding/teen/stripeAccount'}>
            S'en occuper plus tard
          </Link>
        </Button>
        <Form method='POST' action='/onboarding/teen/payFee'>
          <Button disabled={navigation.state !== 'idle'} size={'lg'}>
            Recommencer
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default OnBoardingTeenStatus