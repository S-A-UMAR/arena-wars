import Card from '../components/Card'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

function Home() {
  return (
    <div className="space-y-20 pb-20">
      <Hero />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-8 px-2"
      >
        <motion.div variants={item}>
          <Card className="flex flex-col h-full ring-1 ring-white/5">
            <div className="flex-1">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <span className="text-2xl text-accent">⚔️</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Scrim Marketplace</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">Find and organize scrims with top-tier guilds instantly. Level up your team play.</p>
            </div>
            <Link to="/scrims" className="btn w-full text-center">Browse Scrims</Link>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="flex flex-col h-full ring-1 ring-white/5">
            <div className="flex-1">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <span className="text-2xl text-primary">🏆</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Tournaments</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">Join official Arena Wars seasons and compete for massive prize pools and glory.</p>
            </div>
            <Link to="/tournaments" className="btn w-full text-center">Explore Events</Link>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="flex flex-col h-full ring-1 ring-white/5">
            <div className="flex-1">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Leaderboards</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">Track the rise of the region's most elite MLBB talent. See where you stand.</p>
            </div>
            <Link to="/leaderboard" className="btn w-full text-center">View Rankings</Link>
          </Card>
        </motion.div>
      </motion.div>

      <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Legacy?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of players and guilds already competing in the arena. Create your profile and start your journey today.</p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn">Join Now</Link>
            <Link to="/guilds" className="btn-secondary">Explore Guilds</Link>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}

export default Home
