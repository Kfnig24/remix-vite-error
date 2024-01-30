'use client'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createJob } from "@/lib/actions/job"
import { CATEGORIES } from "@/lib/contants"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
    title: z.string().min(4).max(30),
    description: z.string().min(4).max(200),
    categorie: z.string().min(1),
    date: z.date({ required_error: 'Une date est nécessaire' })
})

const CreateJob = () => {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createJob(values)
        return router.push('/client/dashboard')
    }

    return (
        <section className="p-4 text-gray-700">
            <h2 className="text-2xl text-gray-800 font-semibold text-right md:text-left">
                Créer un job
            </h2>
            <Form {...form}>
                <form className="mt-8 flex flex-col gap-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>

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

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-md font-semibold">Date du job:</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-3/4 pl-3 text-left font-normal text-md p-6",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: fr })
                                                ) : (
                                                    <span>Sélectionner une date</span>
                                                )}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            locale={fr}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-3/4 text-start md:text-end">
                        <Button type="submit" size={'lg'}>
                            Créer un job
                        </Button>
                    </div>
                </form>
            </Form>
        </section>
    )
}

export default CreateJob