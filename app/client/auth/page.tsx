import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClientAccount, createUser } from "@/lib/actions/user"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

const schema = z.object({
  last_name: z.string().min(2),
  first_name: z.string().min(2),
  address: z.string().min(2),
  city: z.string().min(2)
})

const ClientAuth = () => {

  // Methods
  const onSubmit = async (formData: FormData) => {
    'use server'

    const supabase = createServerActionClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return redirect('/auth')

    const values = {
      last_name: formData.get('last_name'),
      first_name: formData.get('first_name'),
      address: formData.get('address'),
      city: formData.get('city'),
    }

    // Validate input data
    const validatedData = schema.safeParse(values)
    if (!validatedData.success) {
      console.log('Non valid data')
      return 'Veuillez fournir les données nécessaires'
    }

    // Add user to the users registery
    const resReg = await createUser({ account_type: 'client' })
    if (!resReg || !resReg.data) return redirect('/auth')
    if (resReg?.error) {
      console.error(resReg.error)
      return resReg.error
    }

    // Add user to the clients accounts table
    const clientError = await createClientAccount({
      last_name: validatedData.data.last_name,
      first_name: validatedData.data.first_name,
      address: validatedData.data.address,
      city: validatedData.data.city,
      registery_id: resReg.data[0].id
    })
    if (clientError) {
      console.error(clientError)
      return clientError
    }

    return redirect('/client/dashboard')
  }

  // Render
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">
        Terminer la création de votre compte <span className="text-primary">Client</span>
      </h2>

      <form action={onSubmit}>
        <div className="flex flex-row gap-4 mb-8">

          <Input name="last_name" required minLength={2} className="p-6 text-md" placeholder="Nom" />

          <Input name="first_name" placeholder="Prénom" required minLength={2} className="p-6 text-md" />

        </div>

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
          <Button type="submit" size={"lg"}>
            Créer un compte
          </Button>
        </div>

      </form>
    </>
  )
}

export default ClientAuth