import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CATEGORIES } from "@/lib/contants"
import { redirect } from "next/navigation"

const HeroForm = () => {

    const onSubmit = async (formData: FormData) => {
        'use server'

        const values = {
            title: formData.get('title'),
            categorie: formData.get('categorie')
        }

        const newCat = CATEGORIES.find(cat => cat.name === values.categorie)
        if (!newCat) return

        return redirect(`/client/create?title=${values.title}&categorie=${values.categorie}`)
    }

    return (
            <form className="flex flex-col gap-4 my-12 md:my-0" action={onSubmit}>
                    
                <Input className="text-md p-6" placeholder="Quel est la tache à accomplir ?" name="title" type={"text"} required min={4} />


                <Select required name="categorie">
                        <SelectTrigger className="p-6 text-md">
                            <SelectValue placeholder="Quel est la categorie ?" />
                        </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat.name} value={cat.name}>
                                <div className="flex flex-row w-full items-center text-md"><cat.icon className="mr-2 w-6 h-6 text-primary" /> {cat.name}</div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button size={'lg'} type="submit">
                    Poster un <span className="font-bold ml-1">Job</span>
                </Button>
            </form>
    )
}

export default HeroForm