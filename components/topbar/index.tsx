import { NavLinks } from "@/lib/contants"
import MobileDropdown from "./mobileDropdown"

const Topbar = ({ first_name, type } : { first_name: string, type: 'client' | 'teen' }) => {
    return (
        <div className="p-6 w-full flex flex-row justify-between md:justify-end items-center font-semibold text-gray-700">
            <span>Bienvenue, <span className="text-primary">{first_name}</span></span>
            <div className="md:hidden">
                <MobileDropdown type={type} />
            </div>
        </div>
    )
}

export default Topbar