import { NavLinks } from "~/lib/constants"
import { Button } from "./ui/button"
import { Link } from "@remix-run/react"

const Sidebar = ({ links }: { links: NavLinks[] }) => {

    return (
        <section className="hidden lg:flex fixed top-0 left-0 w-64 h-screen flex-col py-12 px-6 gap-4 bg-primary/5">
            <div className="text-2xl text-gray-800 font-bold cursor-pointer mb-6">
                <span className="text-primary">Job</span>Teen.
            </div>

            {links.map(link => (
                <Button variant={'ghost'} key={link.name} asChild className="text-md gap-4 justify-start text-primary font-semibold hover:bg-primary hover:text-white">
                    <Link to={link.href}>
                        <link.icon className="text-2xl" /> {link.name}
                    </Link>
                </Button>
            ))}
        </section>
    )
}

export default Sidebar