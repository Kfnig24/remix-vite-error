import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { fr } from "date-fns/locale"
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '~/components/ui/calendar'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '~/components/ui/alert-dialog'
import { ActionFunction, LoaderFunction, json, redirect } from '@remix-run/node'
import { getAuth } from '@clerk/remix/ssr.server'
import { Form, Link, useFetcher, useLoaderData } from '@remix-run/react'
import { createClerkClient } from '@clerk/remix/api.server'

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const user = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUser(userId)
    if (user.publicMetadata.accountType !== 'teen') return redirect(`/onboarding/${user.publicMetadata.accountType}`)

    if (user.privateMetadata.paid) return redirect('/onboarding/teen/stripeAccount')

    return {
        initialOpen: user.privateMetadata.birthdate ? true : false
    }
}

export const action: ActionFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const formData = await args.request.formData()
    const year_string = formData.get('birthdate_year')?.toString()
    if (!year_string) return json({ success: false })

    const month_string = formData.get('birthdate_month')?.toString()
    if (!month_string) return json({ success: false })

    const day_string = formData.get('birthdate_day')?.toString()
    if (!day_string) return json({ success: false })

    const year = +year_string
    const month = +month_string
    const day = +day_string

    await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }).users.updateUser(userId, { publicMetadata: { onboarded: false, accountType: 'teen', note: 5 }, privateMetadata: { birthdate: new Date(year, month, day + 2) } })

    return json({
        success: true
    })
}

const OnBoardingTeen = () => {
    const { initialOpen } = useLoaderData<typeof loader>()
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [open, setOpen] = useState(initialOpen)
    const fetcher = useFetcher()

    useEffect(() => {
        // @ts-ignore
        if (fetcher.data && fetcher.data.success) setOpen(true)
    }, [fetcher.state])

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!date) return console.log('No date')

        const formData = new FormData()
        formData.append('birthdate_year', date.getFullYear().toString())
        formData.append('birthdate_month', (date.getUTCMonth()).toString())
        formData.append('birthdate_day', (date.getUTCDate()).toString())
        fetcher.submit(formData, { method: 'POST' })
    }

    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-700 mb-8">
                Terminer la création de votre compte <span className="text-primary">Teen</span>
            </h2>

            <form onSubmit={submit}>


                <div className="flex md:flex-row flex-col items-center justify-between gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                size={'lg'}
                                className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                {date ? (
                                    format(date, "PPP", { locale: fr })
                                ) : (
                                    <span>Votre date de naissance</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                locale={fr}
                                mode="single"
                                selected={date}
                                captionLayout="dropdown-buttons"
                                fromYear={1980}
                                toYear={2030}
                                onSelect={setDate}
                                required
                                disabled={(date) =>
                                    date > new Date() || new Date().getFullYear() - date.getFullYear() < 15
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <Button type="submit" size={'lg'}>
                        Continuer
                    </Button>
                </div>

            </form>

            <AlertDialog open={open} defaultOpen={initialOpen}>
                <AlertDialogContent className="rounded-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-800 text-xl mb-2">
                            Frais d'inscription <span className="font-bold"><span className="text-primary">Job</span>Teen.</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Nous demandons 0.99€ de frais d'inscription pour accéder au réseau <span className="font-bold"><span className="text-primary">Job</span>Teen.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col md:flex-row justify-between gap-4 mt-4">
                        <Button asChild variant={'destructive'} size={'lg'}>
                            <Link to={'/onboarding/teen/stripeAccount'}>
                                S'en occuper plus tard
                            </Link>
                        </Button>

                        <Form method='POST' action='payFee'>
                            <Button size={'lg'}>
                                Les regler maintenant
                            </Button>
                        </Form>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default OnBoardingTeen