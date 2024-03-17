import { NavLinks } from "~/lib/constants"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Link } from "@remix-run/react"
import { UserButton } from "@clerk/remix"
import { HiMenuAlt3 } from "react-icons/hi";

const Topbar = ({ links, first_name }: { links: NavLinks[], first_name: string }) => {
    return (
        <div className="p-6 w-full flex flex-row justify-between items-center font-semibold text-gray-700">
            <span className="hidden lg:block">Bienvenue, <span className="text-primary">{first_name}</span></span>

            <div>
                <UserButton />

            </div>

            <div className="lg:hidden">

                <DropdownMenu>
                    <DropdownMenuTrigger className="text-2xl bg-primary rounded-full text-white p-2">
                        <HiMenuAlt3 />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {links.map(link => (
                            <DropdownMenuItem className="text-md gap-4 justify-start text-primary font-semibold hover:bg-primary hover:text-white" asChild key={link.name}>
                                <Link className="hover:bg-primary hover:text-white" to={link.href}>
                                    <link.icon /> {link.name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}

export default Topbar