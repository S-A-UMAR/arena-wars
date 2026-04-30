import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/Card'

function Home() {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="relative z-10 text-center max-w-5xl px-6 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
             <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 inline-block backdrop-blur-md">
                Professional Esports Infrastructure
             </span>
             <h1 className="text-6xl md:text-8xl font-black italic uppercase italic-font-orbitron leading-[0.9] text-white">
                Forge Your <span className="text-primary">Legacy</span> <br /> In The Arena
             </h1>
             <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-8 font-medium leading-relaxed">
                The ultimate SaaS ecosystem for MLBB organizations. Orchestrate tournaments, engineer elite guilds, and dominate with advanced tactical intelligence.
             </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <Link to="/register" className="btn px-12 py-5 text-lg shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">Initialize Profile</Link>
            <Link to="/guilds" className="px-12 py-5 text-lg font-black uppercase tracking-widest text-white hover:text-primary transition">Explore Guilds</Link>
          </motion.div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
           {[
             { 
               title: 'Guild Discovery', 
               desc: 'Find your brotherhood or forge a new legacy with our 3-page organizational DNA system.', 
               icon: '🛡️',
               link: '/guilds'
             },
             { 
               title: 'Elite Tournaments', 
               desc: 'Join professional-scale arenas with automated brackets, prize pools, and stream integration.', 
               icon: '🏆',
               link: '/tournaments'
             },
             { 
               title: 'Tactical Intelligence', 
               desc: 'Deep-dive match analysis with KDA tracking, hero usage stats, and performance heatmaps.', 
               icon: '📊',
               link: '/leaderboard'
             }
           ].map((feat, i) => (
             <motion.div
               key={feat.title}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.2 }}
               viewport={{ once: true }}
             >
                <Card className="p-10 h-full flex flex-col border-white/5 hover:border-primary/30 transition-all duration-500 group">
                   <div className="text-5xl mb-8 group-hover:scale-110 transition-transform origin-left">{feat.icon}</div>
                   <h3 className="text-2xl font-black text-white uppercase italic italic-font-orbitron mb-4">{feat.title}</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">{feat.desc}</p>
                   <Link to={feat.link} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">Access System →</Link>
                </Card>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Guild Command Center Promo */}
      <section className="max-w-7xl mx-auto px-6 py-20">
         <div className="glass border border-white/5 rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 relative z-10">
               <span className="text-[10px] font-black uppercase tracking-widest text-accent">Strategic Operations</span>
               <h2 className="text-4xl md:text-6xl font-black italic uppercase italic-font-orbitron text-white leading-tight">
                  The Guild <span className="text-accent">Command Center</span>
               </h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                  Manage your roster with sub-second precision. Kick, promote, or recruit free agents through our streamlined recruitment portal. Everything your organization needs, in one tactical hub.
               </p>
               <div className="flex gap-4">
                  <Link to="/guilds/create" className="btn px-8 py-3">Forge Your Guild</Link>
               </div>
            </div>
            <div className="flex-1 relative z-10">
               <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px]" />
                  <Card className="relative z-20 p-8 border-white/10 rotate-3 translate-x-4 translate-y-4">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/50 flex items-center justify-center">🛡️</div>
                           <div className="text-lg font-black text-white italic">SHADOW SYNDICATE</div>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                           <div className="w-[70%] h-full bg-accent" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-[10px] font-black text-white text-center italic">WIN RATE: 74%</div>
                           <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-[10px] font-black text-accent text-center italic">LEVEL 14</div>
                        </div>
                     </div>
                  </Card>
                  <Card className="absolute top-0 left-0 z-10 p-6 border-white/5 -rotate-6 -translate-x-4 -translate-y-4 opacity-50 blur-[1px]">
                     <div className="w-32 h-32 flex items-center justify-center text-4xl">⚔️</div>
                  </Card>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-6">
         <h2 className="text-4xl md:text-5xl font-black italic uppercase italic-font-orbitron text-white mb-8">Ready to <span className="text-primary">Dominate?</span></h2>
         <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">Join thousands of players and hundreds of guilds already competing at the highest level.</p>
         <Link to="/register" className="btn px-16 py-5 text-xl">Sign Up For Free</Link>
      </section>
    </div>
  )
}

export default Home
