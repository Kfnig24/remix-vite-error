import { Construction, Home, LucideIcon, Presentation } from "lucide-react";
import { IconType } from 'react-icons';
import { CiMail } from "react-icons/ci";
import { MdHomeFilled } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaStripeS, FaUser } from "react-icons/fa";

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

export const PRO_NAVBAR_LINKS: NavLinks[] = [
    {
        name: 'Dashboard',
        icon: MdHomeFilled,
        href: '/dashboard'
    },
    {
        name: 'Créer un job',
        icon: IoMdAdd,
        href: '/dashboard/pro/create'
    },
    {
        name: 'Mon compte',
        icon: FaUser,
        href: '/dashboard/pro/account'
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
        href: '/dashboard'
    },
    {
        name: 'Mes propositions',
        icon: CiMail,
        href: '/dashboard/teen/propositions'
    },
    {
        name: 'Stripe',
        icon: FaStripeS,
        href: 'https://dashboard.stripe.com'
    },
]