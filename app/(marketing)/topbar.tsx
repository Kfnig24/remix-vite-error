import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const TopBar = () => {
  return (
    <header className="flex flex-row justify-between px-4 py-6 items-center">
      <Logo />

      <Button asChild size={"lg"}>
        <Link href="/auth">
          Se connecter
        </Link>
      </Button>
    </header>
  )
}

export default TopBar