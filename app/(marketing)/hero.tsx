import HeroForm from "./heroform"

const Hero = () => {
  return (
      <section className="px-2 py-16 md:py-20 md:px-8 grid grid-cols-1 md:grid-cols-2 items-center">

        <div className="px-2 md:px-4">
          <h1 className="text-6xl font-bold leading-12 mb-4">
            Trouvez un <span className="text-primary">Teen</span> pour vous faire gagner du temps
          </h1>
          <p className="font-light text-lg text-gray-700">
            Poster un <span className="text-primary">Job</span>, acceptez un <span className="text-primary">Teen</span> et c'est parti !
          </p>
        </div>

        <HeroForm />

      </section>
  )
}

export default Hero