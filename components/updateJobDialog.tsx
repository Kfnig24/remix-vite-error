'use client'

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { CATEGORIES } from "@/lib/contants"
import { Button } from "./ui/button"
import { useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { deleteJob, updateJob } from "@/lib/actions/job"
import { toast } from "./ui/use-toast"

export const UpdateJobDialogTrigger = ({ children }: { children: React.ReactNode }) => {
    return (
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
    )
}

const formSchema = z.object({
    title: z.string().min(4).max(30),
    description: z.string().min(4).max(200),
    categorie: z.string().min(1),
})

const UpdateJobDialogContent = ({ job_data }: { job_data: { id: number, title: string, description: string, categorie: string } }) => {
    const [deleteOpen, setDeleteOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: job_data.title,
            description: job_data.description,
            categorie: job_data.categorie,
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await updateJob(job_data.id, values)

        return toast({
            title: 'Compte modifié avec succès'
        })
    }

    return (
        <DialogContent className="rounded-md text-gray-700">
            <DialogHeader>
                <DialogTitle className="text-xl">Modifier votre <span className="text-primary">Job</span></DialogTitle>
            </DialogHeader>

            <Form {...form}>
                <form className="mt-8 flex flex-col gap-8" onSubmit={form.handleSubmit(onSubmit)}>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="justify-start w-full">
                                <FormLabel className="text-md font-semibold">Titre:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Titre" className="w-3/4 p-6 text-md" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-md font-semibold">Description:</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Description"
                                        className="w-3/4 h-52 p-6 text-md resize-none"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categorie"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-md font-semibold">Categorie:</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="p-6 w-3/4 text-md">
                                            <SelectValue placeholder="Veuillez sélectionner une catégorie" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat.name} value={cat.name}>
                                                <div className="flex flex-row w-full items-center text-md"><cat.icon className="mr-2 w-6 h-6 text-primary" /> {cat.name}</div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex-row flex justify-between">
                        <Button onClick={() => setDeleteOpen(true)} variant={'destructive'} size={"lg"}>
                            Supprimer mon Job
                        </Button>

                        <Button type="submit" size={"lg"}>
                            Modifier mon Job
                        </Button>
                    </div>
                </form>
            </Form>

            <AlertDialog open={deleteOpen}>
                <AlertDialogContent className="rounded-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-700">Etes vous sûr de vouloir supprimer votre <span className="text-primary">Job</span> ?</AlertDialogTitle>
                        <AlertDialogDescription>Cette action est irréversible</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 md:justify-between">
                        <Button onClick={async () => await deleteJob(job_data.id)} variant={'destructive'} size={'lg'}>
                            J'en suis sûr
                        </Button>

                        <Button onClick={() => setDeleteOpen(false)} variant={'outline'} size={'lg'}>
                            Finalement non
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DialogContent>
    )
}

const UpdateJobDialogWrapper = ({ children, job_data }: { children: React.ReactNode, job_data: { id: number, title: string, description: string, categorie: string } }) => {
    return (
        <Dialog>
            {children}
            <UpdateJobDialogContent job_data={job_data} />
        </Dialog>
    )
}
export default UpdateJobDialogWrapper