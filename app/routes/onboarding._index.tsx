import { Form, useNavigate, useOutletContext } from "@remix-run/react"
import { useEffect } from "react"
import { Button } from "~/components/ui/button"
import { FaPersonShelter, FaPersonWalking } from 'react-icons/fa6'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ActionFunction, redirect } from "@remix-run/node"
import { getAuth } from "@clerk/remix/ssr.server"
import { createClerkClient } from "@clerk/remix/api.server"

export const action: ActionFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (!userId) return redirect('/auth/sign-in')

  const formData = await args.request.formData()
  const accountType = formData.get('account_type')

  await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.updateUser(userId, { publicMetadata: { accountType, onboarded: false } })
  return redirect(`/onboarding/${accountType}`)
}

const OnBoardingAccountType = () => {
  const { accountType } = useOutletContext<{ accountType: string | undefined }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (accountType) return navigate(`/onboarding/${accountType}`)
  }, [accountType])

  return (
    <Form method="POST" className="text-center">
      <h2 className="text-2xl font-semibold text-gray-800">
        Quel type de <span className="text-primary">compte</span> voulez vous <span className="text-primary">créer</span> ?
      </h2>

      <Select name="account_type" required>
        <SelectTrigger className="p-6 text-md mt-8 mb-4">
          <SelectValue placeholder="Type de compte" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pro"><div className="flex flex-row items-center gap-2 text-md p-2"><span className="text-primary text-xl"><FaPersonShelter /></span> Pro</div></SelectItem>
          <SelectItem value="teen"><div className="flex flex-row items-center gap-2 text-md p-2"><span className="text-primary text-xl"><FaPersonWalking /></span> Teen</div></SelectItem>
        </SelectContent>
      </Select>

      <Button size={'lg'} type="submit">
        Continuer
      </Button>
    </Form>
  )
}

export default OnBoardingAccountType