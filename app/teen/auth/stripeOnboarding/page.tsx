'use client'

import { Button } from "@/components/ui/button"
import { getAccountLink, isAccountOnBoarded } from "@/lib/actions/stripe"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AiOutlineLoading } from "react-icons/ai"

const StripOnboardingCallback = () => {
    const searchParams = useSearchParams()
    const status = searchParams.get('status')

    const [isOnBoarded, setIsOnboarded] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const manageStatus = async () => {
            if (status === 'refresh') return await getAccountLink(location.origin)

            setIsOnboarded(await isAccountOnBoarded())
            setLoading(false)
        }

        manageStatus()
    }, [])

    if (loading) return <div className="text-primary text-4xl animate-spin"><AiOutlineLoading /></div>

    if (isOnBoarded) return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl text-gray-700 font-semibold text-center">
                Vous êtes prêt pour faire de l'argent ! 
            </h2>
            <Button asChild size={'lg'}>
                <Link href={'/teen/dashboard'}>
                    Let's go !
                </Link>
            </Button>
        </div>
    )

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl text-gray-700 font-semibold text-center">
                Vous avez besoin d'un compte Stripe valide pour continuer 
            </h2>
            <Button onClick={async () => await getAccountLink(location.origin)} size={'lg'}>
                Compris !
            </Button>
        </div>
    )
}

export default StripOnboardingCallback