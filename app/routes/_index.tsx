import type { LoaderFunction, MetaFunction } from "@vercel/remix";
import { redirect } from '@vercel/remix'
import { Link, useNavigate } from "@remix-run/react";
import Logo from "~/components/logo";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { CATEGORIES } from "~/lib/constants";

import teen_landing from 'public/images/teen-landing.jpg'
import marre_landing from 'public/images/marre-landing.jpg'
import { FaInstagram } from "react-icons/fa";
import { getAuth } from "@clerk/remix/ssr.server";

export const meta: MetaFunction = () => {
  return [
    { title: "JobTeen" },
    { name: "description", content: "Faites de l'argent facilement" },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args)
  if (userId) return redirect('/onboarding')

  return {}
}

export default function Index() {
  const navigate = useNavigate()

  return (
    <main className="overflow-x-hidden">
      <section className="bg-gradient-to-b from-purple-100 to-white text-black">

        <header className="flex flex-row justify-between px-4 py-6 items-center">
          <Logo />

          <Button asChild size={"lg"}>
            <Link to="/auth/sign-in">
              Se connecter
            </Link>
          </Button>
        </header>

        <section className="px-2 py-16 md:py-20 md:px-8 grid grid-cols-1 md:grid-cols-2 items-center">

          <div className="px-2 md:px-4">
            <h1 className="text-6xl font-bold leading-12 mb-4">
              Trouvez un <span className="text-primary">Teen</span> pour vous faire gagner du temps
            </h1>
            <p className="font-light text-lg text-gray-700">
              Poster un <span className="text-primary">Job</span>, acceptez un <span className="text-primary">Teen</span> et c'est parti !
            </p>
          </div>

          <div className="flex flex-col gap-4 my-12 md:my-0">

            <Input className="text-md p-6" placeholder="Quel est la tache à accomplir ?" name="title" type={"text"} required min={4} />


            <Select required name="categorie">
              <SelectTrigger className="p-6 text-md">
                <SelectValue placeholder="Quel est la categorie ?" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.name} value={cat.name}>
                    <div className="flex flex-row w-full items-center text-md"><cat.icon className="mr-2 w-6 h-6 text-primary" /> {cat.name}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button size={'lg'} onClick={() => navigate('/auth/sign-in')}>
              Poster un <span className="font-bold ml-1">Job</span>
            </Button>
          </div>

        </section>
      </section>
      <Section auth="teen" image={teen_landing} imageSide="left" title={"Faites de l'argent de poche facilement, que vous ayez de 15 à 25 ans."} text={"Vous voulez vous acheter une console ou un nouveau ordinateur mais vous n'avez pas les moyens ? Générez de l'argent quand vous en avez le temps en travaillant chez des gens qui ont besoin de vous."} />
      <Section auth="pro" image={marre_landing} imageSide="right" title={"Pas le temps d'accomplir certaines taches ? Utilisez JobTeen pour trouver quelqu'un pour s'en occuper rapidement."} text={"Marre de laisser le gazon pousser ou vous avez besoin d'aide chez vous ? Un jeune sur JobTeen est là pour vous aider, il suffit de le trouver."} />
      {/* <InstallGuides title={"C'est plus simple avec JobTeen installer sur votre écran d'acceuil"} text={"Suivez ces guides pour installer JobTeen sur votre appareil"} /> */}
      <footer className="p-8 grid gap-12 grid-cols-1 md:grid-cols-2 md:justify-between bg-gradient-to-t from-purple-100 to-white-800 text-gray-600 items-center">
        <div>
          <div className="text-3xl text-gray-800 font-bold mb-2">
            <span className="text-primary">Job</span>Teen.
          </div>

          <div className="flex flex-row gap-2">
            <a href="https://www.instagram.com/jobteen_lux/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==">
              <FaInstagram className="w-6 h-6" />
            </a>
          </div>
        </div>

        <p className="text-sm md:text-end">
          Trouvez des jeunes pour vos petits travaux / Faites de l'argent facilement en ayant entre 15 et 25 ans
        </p>
      </footer>
    </main>
  );
}
