import Image from "next/image"

import logo from "@/public/images/logo.png"
import Link from "next/link"
import { Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="p-8 grid gap-12 grid-cols-1 md:grid-cols-2 md:justify-between bg-gradient-to-t from-purple-100 to-white-800 text-gray-600 items-center">
      <div>
      <div className="text-3xl text-gray-800 font-bold mb-2">
        <span className="text-primary">Job</span>Teen.
      </div>

        <div className="flex flex-row gap-2">
          <Link href="https://www.instagram.com/jobteen_lux/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==">
            <Instagram className="w-6 h-6" />
          </Link>
        </div>
      </div>

      <p className="text-sm md:text-end">
        Trouvez des jeunes pour vos petits travaux / Faites de l'argent facilement en ayant entre 15 et 25 ans
      </p>
    </footer>
  )
}

export default Footer