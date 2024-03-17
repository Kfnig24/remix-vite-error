import { Button } from "~/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "@remix-run/react"

interface SectionProps {
  title: string
  text: string
  imageSide: "left" | "right"
  image: string
  auth: "teen" | "pro"
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
          <Link to={`/auth/sign-in/?next=/dashboard`}>
            <ArrowRight className="mr-2 h-4 w-4" /> Commencer maintenant
          </Link>
        </Button>
      </div>

      <img 
        src={props.image}
        alt="Section image"
        className="rounded-2xl"
      />

    </section>
  )
}

export default Section