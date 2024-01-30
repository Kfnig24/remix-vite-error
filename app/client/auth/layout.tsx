'use client'

import Logo from "@/components/logo"
import { isClientOnboarded } from "@/lib/actions/user"
import { redirect, useRouter } from "next/navigation"
import { useEffect } from "react"

const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    const router = useRouter()

    useEffect(() => {
        const manageAuth = async () => {
            const authStatus = await isClientOnboarded()
            if (authStatus === 'onboarded') return router.push('/client/dashboard')
        } 

        manageAuth()
    }, [])

    return (
        <div className="relative flex justify-center items-center h-screen w-screen overflow-hidden bg-gradient-to-br from-white to-primary/20">
            <div className="absolute top-8 left-8">
                <Logo />
            </div>

            <main className="p-8 border-[1px] rounded-lg shadow-sm bg-white">
                {children}
            </main>
        </div>
    )
}

export default AuthLayout