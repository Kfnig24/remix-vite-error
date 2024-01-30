import { Construction, Home, LucideIcon, Presentation } from "lucide-react";
import { IconType } from 'react-icons'
import { CiMail, CiViewList } from "react-icons/ci";
import { MdHomeFilled } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"
import { IoPersonSharp } from "react-icons/io5"
import { FaStripeS } from "react-icons/fa";

export type JobCategorie = {
    name: string
    icon: LucideIcon
}

export const CATEGORIES: JobCategorie[] = [
    {
        name: 'Aide à la personne',
        icon: Home
    },
    {
        name: 'Petits travaux',
        icon: Construction
    },
    {
        name: 'Stage/Emploi',
        icon: Presentation
    }
]

export type NavLinks = {
    name: string,
    icon: IconType,
    href: string
}

export const CLIENT_NAVBAR_LINKS: NavLinks[] = [
    {
        name: 'Dashboard',
        icon: MdHomeFilled,
        href: '/client/dashboard'
    },
    {
        name: 'Créer un job',
        icon: IoMdAdd,
        href: '/client/create'
    },
    // {
    //     name: 'Mes jobs',
    //     icon: CiViewList,
    //     href: '/client/myJobs'
    // },
    // {
    //     name: 'Teens',
    //     icon: IoPersonSharp,
    //     href: '/client/metTeens'
    // },
]

export const TEEN_NAVBAR_LINKS: NavLinks[] = [
    {
        name: 'Dashboard',
        icon: MdHomeFilled,
        href: '/teen/dashboard'
    },
    {
        name: 'Mes propositions',
        icon: CiMail,
        href: '/teen/propositions'
    },
    {
        name: 'Stripe',
        icon: FaStripeS,
        href: 'https://dashboard.stripe.com'
    },
]