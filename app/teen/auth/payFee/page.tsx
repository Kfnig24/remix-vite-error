'use client'

import { Button } from "@/components/ui/button"
import { createStripeAccount, isAccountOnBoarded, payFee } from "@/lib/actions/stripe"
import { updateTeenPaidStatus } from "@/lib/actions/user"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useFormStatus } from "react-dom"
import { CiCircleCheck } from "react-icons/ci"
import { MdErrorOutline } from "react-icons/md"

const PayFeeCallback = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { pending } = useFormStatus()

  const status = searchParams.get('status')
  const token = searchParams.get('token')

  useEffect(() => {
    const updatePaidStatus = async () => {
      if (status === 'success') {
        const res = await updateTeenPaidStatus(token)
        if (res !== true) return router.push('/auth')

        if (await isAccountOnBoarded()) return router.push('/teen/dashboard')
      }
    }

    updatePaidStatus()
  }, [])

  if (status === 'success') return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-green-500 text-8xl">
        <CiCircleCheck />
      </div>
      <h2 className="text-xl text-gray-700 font-semibold">
        Nous avons bien reçu votre paiement
      </h2>
      <Button disabled={pending} onClick={async () => await createStripeAccount(location.origin)} size={'lg'} >
        Continuer
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-yellow-500 text-8xl">
        <MdErrorOutline />
      </div>
      <h2 className="text-xl text-gray-700 font-semibold">
        Le paiement a été abandonné
      </h2>
      <div className="flex md:flex-row gap-2 flex-col">
        <Button disabled={pending} onClick={async () => await createStripeAccount(location.origin)} size={'lg'} variant={'destructive'}>
          S'en occuper plus tard
        </Button>
        <Button disabled={pending} onClick={async () => await payFee(location.origin)} size={'lg'}>
          Recommencer
        </Button>
      </div>
    </div>
  )
}

export default PayFeeCallback