'use client'

import { CLIENT_NAVBAR_LINKS, TEEN_NAVBAR_LINKS } from "@/lib/contants"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { IoMdAdd } from "react-icons/io"
import Link from "next/link"
import { Button } from "../ui/button"
import { MdOutlineAccountCircle } from "react-icons/md"
import { IoLogOutOutline } from "react-icons/io5"
import { signOut } from "@/lib/actions/user"
import { UpdateAccountDialogTrigger } from "../updateClientAccountDialog"

const MobileDropdown = ({ type }: { type: 'client' | 'teen' }) => {
    const links = type === 'client' ? CLIENT_NAVBAR_LINKS : TEEN_NAVBAR_LINKS

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-2xl bg-primary rounded-full text-white p-2">
                <IoMdAdd />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {links.map(link => (
                    <DropdownMenuItem className="text-md gap-4 justify-start text-primary font-semibold hover:bg-primary hover:text-white" asChild key={link.name}>
                        <Link className="hover:bg-primary hover:text-white" href={link.href}>
                            <link.icon /> {link.name}
                        </Link>
                    </DropdownMenuItem>
                ))}

                <UpdateAccountDialogTrigger>
                    <DropdownMenuItem asChild>
                        <Button variant={'ghost'} className="text-md gap-4 justify-start text-primary font-semibold hover:bg-primary hover:text-white">
                            <MdOutlineAccountCircle className="text-2xl" /> Mon compte
                        </Button>
                    </DropdownMenuItem>
                </UpdateAccountDialogTrigger>

                <DropdownMenuItem asChild>
                    <Button onClick={async () => await signOut()} variant={'ghost'} className="text-md gap-4 justify-start text-primary font-semibold hover:bg-primary hover:text-white">
                        <IoLogOutOutline className="text-2xl" /> Déconnexion
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MobileDropdown