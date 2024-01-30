'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect, useRouter } from "next/navigation"
import { createStripeAccount, payFee } from "@/lib/actions/stripe"
import { createTeenAccount, createUser, isTeenOnboarded } from "@/lib/actions/user"

const formSchema = z.object({
  last_name: z.string().min(2),
  first_name: z.string().min(2),
  birthdate: z.date()
})

const TeenAuth = () => {
  const [open, setOpen] = useState<boolean | null>(false)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  useEffect(() => {
    const checkTeenDoesntExist = async () => {
      const authStatus = await isTeenOnboarded()
      if (authStatus === 'charges_unabled') setOpen(true)
      else setOpen(false)
    }

    checkTeenDoesntExist()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (new Date().getFullYear() - values.birthdate.getFullYear() < 15) {
      return toast({
        title: "Tu dois avoir plus de 15 ans pour pouvoir t'inscrire sur JobTeen."
      })
    }

    const resReg = await createUser({ account_type: 'teen' })
    if (!resReg || !resReg.data) return router.push('/auth')
    if (resReg.error) {
      return toast({
        title: "Une erreur survenue",
        description: resReg.error.message,
        variant: 'destructive'
      })
    }

    const teenError = await createTeenAccount({
      birthdate: values.birthdate,
      first_name: values.first_name,
      last_name: values.last_name,
      registery_id: resReg.data[0].id,
    })
    if (teenError) {
      await supabase.from('users').delete().eq('id', resReg.data[0].id)

      return toast({
        title: "Une erreur est survenu",
        description: teenError.message,
        variant: 'destructive'
      })
    }

    setOpen(true)
  }

  console.log(open)
  if (open === null) return <div>Loading...</div>

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">
        Terminer la création de votre compte <span className="text-primary">Teen</span>
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>

          <div className="flex flex-row gap-4 mb-8">

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="p-6 text-md" placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="p-6 text-md" placeholder="Prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex md:flex-row flex-col items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          size={'lg'}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Votre date de naissance</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={fr}
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown-buttons"
                        fromYear={2000}
                        toYear={2020}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size={'lg'}>
              Continuer
            </Button>
          </div>

        </form>
      </Form>

      <AlertDialog open={open}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-xl mb-2">
              Frais d'inscription <span className="font-bold"><span className="text-primary">Job</span>Teen.</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Nous demandons 14.99€ de frais d'inscription pour accéder au réseau <span className="font-bold"><span className="text-primary">Job</span>Teen.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col md:flex-row justify-between gap-4 mt-4">
            <Button onClick={async () => await createStripeAccount(location.origin)} variant={'destructive'} size={'lg'}>
              S'en occuper plus tard
            </Button>

            <Button onClick={async () => await payFee(location.origin)} size={'lg'}>
              Les regler maintenant
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default TeenAuth