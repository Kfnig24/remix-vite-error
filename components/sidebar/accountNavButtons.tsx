'use client'

import { Button } from "@/components/ui/button"
import { MdOutlineAccountCircle } from "react-icons/md"
import { IoLogOutOutline } from "react-icons/io5"
import { signOut } from "@/lib/actions/user"
import { UpdateAccountDialogTrigger } from "../updateClientAccountDialog"

const AccountNavButtons = () => {
    return (
        <>
            <UpdateAccountDialogTrigger>
                <Button variant={'ghost'} className="text-md gap-4 justify-start text-primary font-semibold hover:bg-primary hover:text-white">
                    <MdOutlineAccountCircle className="text-2xl" /> Mon compte
                </Button>
            </UpdateAccountDialogTrigger>

            <Button onClick={async () => await signOut()} variant={'ghost'} className="text-md gap-4 justify-start text-primary font-semibold hover:bg-primary hover:text-white">
                <IoLogOutOutline className="text-2xl" /> Déconnexion
            </Button>
        </>
    )
}

export default AccountNavButtons