import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import { listLeaderboard } from '../services/api'
import { useToast } from '../context/ToastContext'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [activeTab, setActiveTab] = useState('players')
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(()=>{
    async function load(){
      setLoading(true)
      try {
        const res = await listLeaderboard()
        setEntries(res.data)
      } catch (err) {
        showToast("Failed to synchronize rankings", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  },[])

  const filteredEntries = entries.filter(e => {
    if (activeTab === 'players') return e.entity_type === 'player'
    return e.entity_type === 'guild'
  })

  const top3 = filteredEntries.slice(0, 3)
  const rest = filteredEntries.slice(3)

  return (
    <div className="space-y-16 pb-32">
      <header className="relative py-20 px-10 rounded-[4rem] overflow-hidden glass border border-white/5 text-center">
        <div className="relative z-10 space-y-4">
           <div className="inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-[0.5em] text-accent animate-pulse">Neural Nexus Ranking</div>
           <h1 className="text-6xl md:text-8xl font-black italic uppercase italic-font-orbitron text-white leading-none">Hall of <span className="text-primary">Fame</span></h1>
           <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed italic opacity-80">"Only the most disciplined pilots ascend to the Pantheon."</p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/10 via-transparent to-primary/5 -z-0" />
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-4">
         {[
           { id: 'players', label: 'Elite Pilots' },
           { id: 'guilds', label: 'Grand Battalions' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic transition-all duration-300 ${activeTab === tab.id ? 'bg-primary text-background shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
           >
              {tab.label}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-16"
        >
          {/* Podium */}
          {!loading && top3.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto pt-10">
               {/* Rank 2 */}
               <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="order-2 md:order-1">
                  <Card className="p-8 border-white/10 bg-white/[0.02] rounded-[3rem] text-center relative overflow-hidden group">
                     <div className="relative z-10 space-y-4">
                        <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">🥈</div>
                        <h3 className="text-2xl font-black text-white uppercase italic truncate">{top3[1]?.name}</h3>
                        <div className="text-primary font-black text-xl italic tracking-tighter">{top3[1]?.score.toLocaleString()}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Rank #2</div>
                     </div>
                  </Card>
               </motion.div>

               {/* Rank 1 */}
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="order-1 md:order-2">
                  <Card className="p-12 border-primary/40 bg-primary/5 rounded-[4rem] text-center relative overflow-hidden group shadow-2xl shadow-primary/5">
                     <div className="relative z-10 space-y-6">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-primary text-background mx-auto flex items-center justify-center text-5xl mb-4 animate-float shadow-xl shadow-primary/20">👑</div>
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter truncate">{top3[0]?.name}</h3>
                        <div className="text-primary font-black text-3xl italic tracking-tighter">{top3[0]?.score.toLocaleString()}</div>
                        <div className="inline-block px-4 py-1 rounded-full bg-primary text-background text-[10px] font-black uppercase tracking-[0.3em]">The Champion</div>
                     </div>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[80px] -z-0" />
                  </Card>
               </motion.div>

               {/* Rank 3 */}
               <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="order-3">
                  <Card className="p-8 border-white/10 bg-white/[0.02] rounded-[3rem] text-center relative overflow-hidden group">
                     <div className="relative z-10 space-y-4">
                        <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">🥉</div>
                        <h3 className="text-2xl font-black text-white uppercase italic truncate">{top3[2]?.name}</h3>
                        <div className="text-primary font-black text-xl italic tracking-tighter">{top3[2]?.score.toLocaleString()}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Rank #3</div>
                     </div>
                  </Card>
               </motion.div>
            </div>
          )}

          {/* List for the rest */}
          <div className="max-w-5xl mx-auto space-y-4">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {rest.map((e, index) => (
                <motion.div variants={item} key={e.id}>
                  <Card className="flex items-center justify-between p-6 group transition-all duration-500 hover:scale-[1.02] border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-8 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center font-black italic text-xl text-muted-foreground">
                        #{index + 4}
                      </div>
                      <div>
                        <div className="text-2xl font-black text-white uppercase italic tracking-tighter">{e.name}</div>
                        <div className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase mt-1">Lvl. 99 Archetype</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                       <div className="text-center w-32">
                          <div className="text-2xl font-black text-white italic tracking-tighter">{e.score.toLocaleString()}</div>
                       </div>
                       <div className="w-32 text-right">
                          <div className="inline-block px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10 text-muted-foreground">RESERVIST</div>
                       </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {loading && (
        <div className="py-40 text-center space-y-4">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-40">Synchronizing Hall of Fame...</p>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
