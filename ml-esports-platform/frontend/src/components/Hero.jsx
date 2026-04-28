import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32 rounded-3xl mb-12">
      {/* Background visual element */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.gray.900))]" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl neon-text uppercase">
            The Ultimate Arena For MLBB Champions
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Build your guild, dominate tournaments, and orchestrate scrims with the most powerful esports platform dedicated to Mobile Legends.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link to="/register" className="btn">
              Get Started
            </Link>
            <Link to="/tournaments" className="text-sm font-semibold leading-6 text-white hover:text-accent transition">
              Explore Events <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
    </div>
  )
}

export default Hero
