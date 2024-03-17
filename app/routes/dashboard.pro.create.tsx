import { createClerkClient } from "@clerk/remix/api.server"
import { getAuth } from "@clerk/remix/ssr.server"
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node"
import { Form, useActionData, useNavigate, useSubmit } from "@remix-run/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { CATEGORIES } from "~/lib/constants"
import { cn } from "~/lib/utils"
import prisma from "~/lib/db"
import { toast } from "~/components/ui/use-toast"

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)
    if (user.publicMetadata.accountType !== 'pro') return redirect(`/dashboard`)

    return {}
}

export const action: ActionFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const formData = await args.request.formData()

    const hours = formData.get('hours')
    const date_year = formData.get('date_year')
    const date_month = formData.get('date_month')
    const date_day = formData.get('date_day')
    const title = formData.get('title')
    const description = formData.get('description')
    const categorie = formData.get('categorie')
    if (!date_year || !date_month || !date_day || !hours || !title || !description || !categorie) return { success: false }

    const data = {
        title: title.toString(),
        description: description.toString(),
        categorie: categorie.toString(),
        hours: +hours,
        date: new Date(+date_year, +date_month, +date_day + 2)
    }

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)

    const city = user.privateMetadata.city
    const address = user.privateMetadata.address
    if (!city || !address) return { success: false }

    try {
        await prisma.job.create({
            data: {
                author: userId,
                city: city.toString(),
                address: address.toString(),
                ...data
            }
        })
    } catch(e) {
        console.error(e)
        return { success: false }
    }

    return { success: true }
}

const DashboardCreate = () => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [categorie, setCategorie] = useState<string>("")
    const [hours, setHours] = useState<number>(1)
    const submit = useSubmit()
    const data = useActionData<typeof action>()
    const navigate = useNavigate()

    useEffect(() => {
        if (data && data.success) {
            toast({ title: 'Job créé' })
            navigate('/dashboard')
        }
        else if (data && !data.success) toast({ title: 'Une erreur est survenu lors de la création du job', variant: 'destructive' })
    }, [data])

    return (
        <section className="p-4 text-gray-700">
            <h2 className="text-2xl text-gray-800 font-semibold text-right md:text-left">
                Créer un <span className="text-primary">Job</span>
            </h2>

            <Form method="post" className="mt-8 flex flex-col gap-8 w-full max-w-2xl" onSubmit={(event => {
                event.preventDefault()

                if (!date) return

                const params = {
                    title,
                    description,
                    categorie,
                    hours,

                    date_year: date.getFullYear().toString(),
                    date_month: (date.getUTCMonth()).toString(),
                    date_day: (date.getUTCDate()).toString()
                }

                submit(params, { method: 'post' })
            })}>

                <div className="flex flex-col gap-2 justify-start w-full">
                    <Label htmlFor="title" className="text-md">Titre</Label>
                    <Input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} className="w-3/4 p-6 text-md" name="title" required minLength={4} maxLength={30} />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="description" className="text-md">Description</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="w-3/4 h-52 p-6 text-md resize-none"
                        name="description"
                        required
                        minLength={4}
                        maxLength={200} />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="categorie" className="text-md">Catégorie</Label>
                    <Select required name="categorie" value={categorie} onValueChange={(val) => setCategorie(val)}>
                        <SelectTrigger className="p-6 w-3/4 text-md">
                            <SelectValue placeholder="Veuillez sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(cat => (
                                <SelectItem key={cat.name} value={cat.name}>
                                    <div className="flex flex-row w-full items-center text-md"><cat.icon className="mr-2 w-6 h-6 text-primary" /> {cat.name}</div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="date" className="text-md">Date du <span className="text-primary">Job</span></Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-3/4 pl-3 text-left font-normal text-md p-6",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                {date ? (
                                    format(date, "PPP", { locale: fr })
                                ) : (
                                    <span>Sélectionner une date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                required
                                locale={fr}
                                disabled={(date) =>
                                    date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col gap-2 justify-start w-full">
                    <Label htmlFor="hours" className="text-md">Nombre d'heures prévues</Label>
                    <Input placeholder="Heures" value={hours} onChange={(e) => setHours(+e.target.value)} className="w-3/4 p-6 text-md" name="hours" type="number" required min={1} />
                </div>


                <div className="w-3/4 text-start md:text-end">
                    <Button type="submit" size={'lg'}>
                        Créer un job
                    </Button>
                </div>

            </Form>
        </section>
    )
}

export default DashboardCreate