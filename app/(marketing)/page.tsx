import Footer from "./footer";
import Hero from "./hero";
import InstallGuides from "./install-guides";
import Section from "./section";
import TopBar from "./topbar";

import teen_landing from "@/public/images/teen-landing.jpg"
import marre_landing from "@/public/images/marre-landing.jpg"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export default async function Landing() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (session) return redirect('/connected')

  return (
    <main className="overflow-x-hidden">
      <section className="bg-gradient-to-b from-purple-100 to-white text-black">
        <TopBar />
        <Hero />
      </section>
      <Section auth="teen" image={teen_landing} imageSide="left" title={"Faites de l'argent de poche facilement, que vous ayez de 15 à 25 ans."} text={"Vous voulez vous acheter une console ou un nouveau ordinateur mais vous n'avez pas les moyens ? Générez de l'argent quand vous en avez le temps en travaillant chez des gens qui ont besoin de vous."} />
      <Section auth="client" image={marre_landing} imageSide="right" title={"Pas le temps d'accomplir certaines taches ? Utilisez JobTeen pour trouver quelqu'un pour s'en occuper rapidement."} text={"Marre de laisser le gazon pousser ou vous avez besoin d'aide chez vous ? Un jeune sur JobTeen est là pour vous aider, il suffit de le trouver."} />
      {/* <InstallGuides title={"C'est plus simple avec JobTeen installer sur votre écran d'acceuil"} text={"Suivez ces guides pour installer JobTeen sur votre appareil"} /> */}
      <Footer />
    </main>
  )
}
