import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"

interface SectionProps {
  title: string
  text: string
  imageSide: "left" | "right"
  image: StaticImageData
  auth: "teen" | "client"
}

const Section = (props: SectionProps) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 p-8 my-8 gap-8 items-center">

      <div className={`${props.imageSide === "left" ? 'order-last' : ''}`}>
        <h3 className="text-4xl font-semibold mb-4">
          {props.title}
        </h3>

        <p className="text-muted-foreground text-base mb-2">
          {props.text}
        </p>

        <Button size={"lg"} asChild variant={"link"}>
          <Link href={{
            pathname: "/auth",
            query: { next: props.auth === "teen" ? "/teen/dashboard" : "/client/dashboard", accountType: props.auth }
          }}>
            <ArrowRight className="mr-2 h-4 w-4" /> Commencer maintenant
          </Link>
        </Button>
      </div>

      <Image 
        src={props.image}
        alt="Section image"
        className="rounded-2xl"
      />

    </section>
  )
}

export default Section