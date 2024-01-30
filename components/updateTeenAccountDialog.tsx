'use client'

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { deleteUser, updateTeenAccount } from "@/lib/actions/user"
import { toast } from "./ui/use-toast"


// CLIENT: Dialog content && Form
const teenFormSchema = z.object({
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    email: z.string().email().min(4)
})

const UpdateTeenAccountDialogContent = ({ teen_data }: { teen_data: { first_name: string, last_name: string, email: string } }) => {
    const [deleteOpen, setDeleteOpen] = useState(false)

    const form = useForm<z.infer<typeof teenFormSchema>>({
        resolver: zodResolver(teenFormSchema),
        defaultValues: teen_data
    })

    const onSubmit = async (values: z.infer<typeof teenFormSchema>) => {
        const error = await updateTeenAccount(values)

        if (error !== null) return toast({ title: error, variant: 'destructive' })

        return toast({
            title: 'Compte modifié avec succès'
        })
    }

    return (
        <DialogContent className="rounded-md text-gray-700">
            <DialogHeader>
                <DialogTitle className="text-2xl">Modifier votre compte <span className="text-primary">Job</span>Teen.</DialogTitle>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="mt-8">
                                <FormLabel>Email:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" className="p-6 text-md" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col md:flex-row gap-4 my-4">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prénom:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Prénom" className="p-6 text-md" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nom" className="p-6 text-md" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex-row flex justify-between mt-8">
                        <Button type="button" onClick={() => setDeleteOpen(true)} variant={'destructive'} size={"lg"}>
                            Supprimer mon compte
                        </Button>

                        <Button type="submit" size={"lg"}>
                            Modifier mon compte
                        </Button>
                    </div>

                </form>
            </Form>

            <AlertDialog open={deleteOpen}>
                <AlertDialogContent className="rounded-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-700">Etes vous sûr de vouloir supprimer votre compte <span className="text-primary">Job</span>Teen. ?</AlertDialogTitle>
                        <AlertDialogDescription>Cette action est irréversible</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 md:justify-between">
                        <Button onClick={async () => await deleteUser()} variant={'destructive'} size={'lg'}>
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


const UpdateTeenAccountDialogWrapper = ({ children, teen_data }: { children: React.ReactNode, teen_data: { first_name: string, last_name: string, email: string } }) => {
    return (
        <Dialog>
            {children}
            <UpdateTeenAccountDialogContent teen_data={teen_data} />
        </Dialog>
    )
}
export default UpdateTeenAccountDialogWrapper