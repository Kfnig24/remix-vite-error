import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { FaPersonShelter, FaPersonWalking } from "react-icons/fa6"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getAccountType } from "@/lib/actions/cached_action"

const OnBoarding = async () => {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return redirect('/auth')

  if (await getAccountType(session.user.id)) return redirect(`/${await getAccountType(session.user.id)}/auth`)

  const redirectToCorrectOnBoarding = async (formData: FormData) => {
    'use server'

    const account_type = formData.get('account_type')

    return redirect(`/${account_type?.toString()}/auth`)
  }
  
  return (
    <form action={redirectToCorrectOnBoarding} className="text-center">
      <h2 className="text-2xl font-semibold text-gray-800">
        Quel type de <span className="text-primary">compte</span> voulez vous <span className="text-primary">créer</span> ?
      </h2>

      <Select name="account_type" required>
        <SelectTrigger className="p-6 text-md mt-8 mb-4">
          <SelectValue placeholder="Type de compte" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="client"><div className="flex flex-row items-center gap-2 text-md p-2"><span className="text-primary text-xl"><FaPersonShelter /></span> Client</div></SelectItem>
          <SelectItem value="teen"><div className="flex flex-row items-center gap-2 text-md p-2"><span className="text-primary text-xl"><FaPersonWalking /></span> Teen</div></SelectItem>
        </SelectContent>
      </Select>

      <Button size={'lg'} type="submit">
        Continuer
      </Button>
    </form>
  )
}

export default OnBoarding