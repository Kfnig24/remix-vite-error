'use client'

import { Button } from "@/components/ui/button"
import { payFee } from "@/lib/actions/stripe"
import { deleteUser } from "@/lib/actions/user"

const PayFeeButton = () => {
    return (
        <div className="flex flex-col gap-4 md:flex-row items-center justify-center">
            <Button size={'lg'} onClick={async () => await payFee(location.origin)}>
                Les payer maintenant
            </Button>
            <Button size={'lg'} variant={'destructive'} onClick={async () => await deleteUser()}>
                Finalement je veux pas me faire d'argent
            </Button>
        </div>
    )
}

export default PayFeeButton