'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FaGoogle } from "react-icons/fa"

const AuthPage = ({
    searchParams
}: {
    searchParams: { next: string | undefined, [key: string]: string | string[] | undefined }
}) => {

    const authenticate = async (formData: FormData) => {
        const email = formData.get('email') as string
        const supabase = createClientComponentClient()

        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`
            }
        })

        if (error) {
            console.error(error)
            return toast({
                title: "Une erreur est survenu",
                variant: 'destructive'
            })
        }

        return toast({
            title: "Un email de connexion vous a été envoyé",
            description: "Veuillez consulter votre boite mail"
        })
    }

    return (
        <>
            <h2 className="text-gray-800 text-2xl font-semibold text-center">
                Se connecter à <span className="font-bold"><span className="text-primary">Job</span>Teen.</span>
            </h2>

            <form className="text-center" action={authenticate}>
                <Input className="p-6 mt-8 mb-4" name="email" type="email" required min={4} placeholder="Email" />

                <Button type="submit" size={"lg"}>
                    Se connecter
                </Button>
            </form>

            {/* <p className="text-center text-gray-700 text-xl my-8">
                OU
            </p>

            <div className="flex flex-col items-center">
                <Button disabled={loading} onClick={() => signInWithSocial(googleProvider)} variant={"outline"} size={"lg"}>
                    <FaGoogle className="text-primary w-6 h-6 mr-2" /> Se connecter avec Google
                </Button>
            </div> */}
        </>
    )
}

export default AuthPage