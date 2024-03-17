import { createClerkClient } from "@clerk/remix/api.server";
import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/use-toast";

export const loader: LoaderFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)
    if (user.publicMetadata.accountType !== 'pro') return redirect(`/dashboard`)

    return {
        address: user.privateMetadata.address,
        city: user.privateMetadata.city
    }
}

export const action: ActionFunction = async (args) => {
    const { userId } = await getAuth(args)
    if (!userId) return redirect('/auth/sign-in')

    const formData = await args.request.formData()
    const address = formData.get('address')
    const city = formData.get('city')

    if (!address || !city) {
        return json({ error: 'Adresse ou ville manquant', success: false })
    }

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    const user = await clerkClient.users.getUser(userId)

    await clerkClient.users.updateUser(userId, { privateMetadata: { address, city, ...user.privateMetadata } })

    return json({ success: true, error: null })
}

export default function ProAccountUpdate() {
    const { address, city } = useLoaderData<typeof loader>()
    const data = useActionData<typeof action>()

    useEffect(() => {
        if (data && data.error) {
            toast({ title: data.error, variant: 'destructive' })
            return
        } else if (data && data.success) {
            toast({ title: 'Informations mis à jour', variant: 'default' })
        }
    }, [data])

    return (
        <section className="p-8 text-gray-700">
            <h2 className="text-2xl text-gray-800 font-semibold text-right md:text-left">
                Mettre à jour vos <span className="text-primary">informations</span>
            </h2>

            <Form method="POST">
                <div className="flex flex-col gap-4 my-8">
                    <Label htmlFor="address" className="text-md">Adresse</Label>
                    <Textarea
                        placeholder="Adresse"
                        className="resize-none p-4 text-md max-w-2xl"
                        name="address"
                        minLength={6}
                        defaultValue={address}
                        required
                    />

                    <Label htmlFor="city" className="text-md">Ville</Label>
                    <Input name="city" placeholder="Ville" required minLength={2} className="p-6 text-md max-w-2xl" defaultValue={city} />
                </div>

                <div className="max-w-2xl text-start md:text-end">
                    <Button type="submit" size={'lg'}>
                        Mettre à jour
                    </Button>
                </div>
            </Form>
        </section>
    )
}