import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { CATEGORIES } from "~/lib/constants"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { cn } from "~/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar } from "./ui/calendar"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { Form, useSubmit } from "@remix-run/react"

export const UpdateJobDialogTrigger = ({ children }: { children: React.ReactNode }) => {
    return (
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
    )
}

const UpdateJobDialogContent = ({ job_data }: { job_data: { id: string, title: string, description: string, categorie: string, date: Date, hours: number } }) => {
    const [deleteOpen, setDeleteOpen] = useState(false)
    const submit = useSubmit()

    const [title, setTitle] = useState(job_data.title)
    const [description, setDescription] = useState(job_data.description)
    const [categorie, setCategorie] = useState(job_data.categorie)
    const [date, setDate] = useState<Date | undefined>(job_data.date)
    const [hours, setHours] = useState(job_data.hours)

    return (
        <DialogContent className="rounded-md text-gray-700">
            <DialogHeader>
                <DialogTitle className="text-xl">Modifier votre <span className="text-primary">Job</span></DialogTitle>
            </DialogHeader>

            <form className="mt-8 flex flex-col gap-8" onSubmit={(event) => {
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

                submit(params, { method: 'post', action: `/job/${job_data.id}/update` })
            }}>

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

                <div className="flex-row flex justify-between">
                    <Button type="button" onClick={() => setDeleteOpen(true)} variant={'destructive'} size={"lg"}>
                        Supprimer mon Job
                    </Button>

                    <Button type="submit" size={"lg"}>
                        Modifier mon Job
                    </Button>
                </div>
            </form>

            <AlertDialog open={deleteOpen}>
                <AlertDialogContent className="rounded-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-700">Etes vous sûr de vouloir supprimer votre <span className="text-primary">Job</span> ?</AlertDialogTitle>
                        <AlertDialogDescription>Cette action est irréversible</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 md:justify-between">
                        <Form method="post" action={`/job/${job_data.id}/delete`}>
                            <Button type="submit" variant={'destructive'} size={'lg'}>
                                J'en suis sûr
                            </Button>
                        </Form>

                        <Button type="button" onClick={() => setDeleteOpen(false)} variant={'outline'} size={'lg'}>
                            Finalement non
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DialogContent>
    )
}

const UpdateJobDialogWrapper = ({ children, job_data }: { children: React.ReactNode, job_data: { id: string, title: string, description: string, categorie: string, date: Date, hours: number } }) => {
    return (
        <Dialog>
            {children}
            <UpdateJobDialogContent job_data={job_data} />
        </Dialog>
    )
}
export default UpdateJobDialogWrapper