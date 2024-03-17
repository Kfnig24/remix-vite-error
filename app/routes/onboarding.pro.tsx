import { createClerkClient } from '@clerk/remix/api.server'
import { getAuth } from '@clerk/remix/ssr.server'
import { ActionFunction, LoaderFunction, redirect } from '@vercel/remix'
import { Form, useNavigation } from '@remix-run/react'
import { Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (!userId) return redirect('/auth/sign-in')

  const user = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(userId)
  if (user.publicMetadata.accountType !== 'pro') return redirect(`/onboarding/${user.publicMetadata.accountType}`)

  return {}
}

export const action: ActionFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (!userId) return redirect('/auth/sign-in')

  const formData = await args.request.formData()
  const params = { city: formData.get('city'), address: formData.get('address') }

  await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.updateUser(userId, { privateMetadata: { ...params } })

  return redirect('/dashboard')
}

function OnBoardingPro() {
  const navigation = useNavigation()

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">
        Terminer la création de votre compte <span className="text-primary">Client</span>
      </h2>

      <Form method='post'>
        <div className="flex flex-col gap-2 mb-8">

          <Textarea
            placeholder="Adresse"
            className="resize-none p-4 text-md"
            name="address"
            minLength={6}
            required
          />

          <Input name="city" placeholder="Ville" required minLength={2} className="p-6 text-md" />


        </div>

        <div className="flex-row flex justify-end">
          <Button type="submit" size={"lg"} disabled={navigation.state === 'submitting'}>
            {navigation.state === 'submitting' ? <Loader2 className='animate-spin w-8 h-8' /> : 'Créer un compte'}
          </Button>
        </div>

      </Form>
    </>
  )
}

export default OnBoardingPro