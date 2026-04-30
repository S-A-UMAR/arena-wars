import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import { getProfile, listMatches } from '../services/api'
import { useToast } from '../context/ToastContext'

function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [matches, setMatches] = useState([])
  const [activeTab, setActiveTab] = useState('deployments')
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const [p, m] = await Promise.all([getProfile(), listMatches()])
        setProfile(p.data)
        setMatches(m.data)
      } catch (err) {
        showToast("Signal Interrupted: Profile data unreachable", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = [
    { label: 'Combat Power', val: profile?.combat_power || 1250, color: 'text-primary' },
    { label: 'Win Rate', val: `${profile?.win_rate || 68}%`, color: 'text-white' },
    { label: 'Battles', val: profile?.matches_played || 42, color: 'text-white' },
    { label: 'Rank', val: profile?.rank || 'Mythic', color: 'text-accent' }
  ]

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
       <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white opacity-40">Initializing Command Interface...</p>
    </div>
  )

  return (
    <div className="space-y-12 pb-32">
      {/* Live Feed Ticker */}
      <div className="fixed top-20 left-0 w-full bg-primary/5 border-y border-primary/10 backdrop-blur-md z-40 overflow-hidden py-2">
         <motion.div 
           animate={{ x: [1000, -2000] }}
           transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
           className="flex gap-20 whitespace-nowrap"
         >
            {[
              "🔴 SYSTEM: Tournament 'Mythic Championship' is now recruiting pilots.",
              "🔵 INTEL: Pilot 'Xenon' just ascended to Mythic Immortal rank.",
              "🟡 ALERT: Guild 'Shadow Clan' challenged 'Neon Legion' to a BO3 Scrimmage.",
              "🟢 REWARD: Seasonal prize pool distributed to top 10 Guilds.",
              "⚪ UPDATE: Neural Nexus servers synchronized at 99.9% capacity."
            ].map((msg, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">{msg}</span>
            ))}
         </motion.div>
      </div>

      <header className="relative py-16 px-10 rounded-[4rem] overflow-hidden glass border border-white/5 mt-10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-2xl">
                 {profile?.user?.username?.charAt(0) || 'P'}
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black italic uppercase italic-font-orbitron text-white leading-none">{profile?.user?.username}</h1>
                    <span className="px-2 py-0.5 rounded bg-primary text-background text-[8px] font-black uppercase tracking-widest">Active</span>
                 </div>
                 <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-60">ID: ML-PX-{profile?.id}</p>
              </div>
           </div>
           <div className="flex gap-6">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                   <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.label}</div>
                   <div className={`text-xl font-black italic tracking-tighter ${s.color}`}>{s.val}</div>
                </div>
              ))}
           </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </header>

      {/* Neural Pulse (Graph Mockup) */}
      <Card className="p-10 border-white/5 bg-white/[0.01] rounded-[3rem] relative overflow-hidden">
         <div className="flex justify-between items-start mb-10">
            <div>
               <h3 className="text-lg font-black text-white uppercase italic italic-font-orbitron">Neural <span className="text-primary">Pulse</span></h3>
               <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Combat Power Progression • Last 7 Cycles</p>
            </div>
            <div className="text-right">
               <div className="text-2xl font-black text-primary italic">+120.4</div>
               <div className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Growth Velocity</div>
            </div>
         </div>
         <div className="h-48 flex items-end gap-2 md:gap-4 px-4">
            {[40, 65, 45, 85, 55, 95, 75].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="flex-1 bg-gradient-to-t from-primary/5 via-primary/20 to-primary/40 rounded-t-xl relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-[10px] font-black text-primary">{1200 + (h * 5)}</div>
              </motion.div>
            ))}
         </div>
         <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-0" />
      </Card>

      {/* Tabs */}
      <div className="flex justify-center gap-4">
         {[
           { id: 'deployments', label: 'Deployments' },
           { id: 'intel', label: 'Tactical Intel' },
           { id: 'comms', label: 'Communications' }
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid lg:grid-cols-2 gap-10"
        >
          {activeTab === 'deployments' && (
            <>
               <div className="space-y-6">
                  <h2 className="text-xs font-black text-white uppercase tracking-[0.4em] italic mb-6">Upcoming Engagements</h2>
                  {matches.filter(m => m.status === 'scheduled').map(m => (
                    <Link key={m.id} to={`/matches/${m.id}`}>
                      <Card className="p-6 border-white/10 hover:border-primary/40 transition-all duration-500 bg-white/[0.01] group relative overflow-hidden">
                         <div className="flex justify-between items-center relative z-10">
                            <div>
                               <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">Match #{m.id}</div>
                               <div className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">{m.guild_a_name} <span className="text-muted-foreground italic normal-case px-2 text-sm opacity-40">VS</span> {m.guild_b_name || 'TBD'}</div>
                            </div>
                            <div className="text-right">
                               <div className="text-sm font-black text-white italic">{new Date(m.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                               <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{new Date(m.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                         </div>
                      </Card>
                    </Link>
                  ))}
               </div>
               <div className="space-y-6">
                  <h2 className="text-xs font-black text-white uppercase tracking-[0.4em] italic mb-6">Recent Combat History</h2>
                  {matches.filter(m => m.status === 'completed').map(m => (
                    <Card key={m.id} className="p-6 border-white/5 opacity-60 hover:opacity-100 transition-all duration-500">
                       <div className="flex justify-between items-center">
                          <div>
                             <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Completed Engagement</div>
                             <div className="text-lg font-black text-white uppercase italic tracking-tighter">{m.guild_a_name} <span className="text-primary italic px-1">{m.score_a}-{m.score_b}</span> {m.guild_b_name}</div>
                          </div>
                          <Link to={`/matches/${m.id}`} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-background transition-all">Review Intel</Link>
                       </div>
                    </Card>
                  ))}
               </div>
            </>
          )}

          {activeTab === 'intel' && (
             <div className="lg:col-span-2 grid md:grid-cols-2 gap-10">
                <Card className="p-10 border-white/5 bg-white/[0.01] rounded-[3rem]">
                   <h4 className="text-xs font-black text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Archetype Specialization</h4>
                   <div className="space-y-6">
                      {[
                        { role: 'Jungle', exp: 85, hero: 'Ling' },
                        { role: 'Roam', exp: 40, hero: 'Kaja' },
                        { role: 'Gold', exp: 20, hero: 'Beatrix' }
                      ].map(r => (
                        <div key={r.role} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-white">{r.role} <span className="text-muted-foreground opacity-40 ml-2">({r.hero})</span></span>
                              <span className="text-primary">{r.exp}% Proficiency</span>
                           </div>
                           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${r.exp}%` }} 
                                className="h-full bg-primary"
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </Card>
                <Card className="p-10 border-white/5 bg-white/[0.01] rounded-[3rem]">
                   <h4 className="text-xs font-black text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Operational Achievements</h4>
                   <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className={`aspect-square rounded-2xl border flex items-center justify-center text-2xl ${i < 4 ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 opacity-20'}`}>
                           {['🛡️', '⚔️', '🏆', '🔥', '💎', '💀'][i-1]}
                        </div>
                      ))}
                   </div>
                </Card>
             </div>
          )}

          {activeTab === 'comms' && (
             <div className="lg:col-span-2">
                <Card className="p-20 text-center space-y-6 opacity-40 border-dashed border-white/10 rounded-[4rem]">
                   <div className="text-5xl">📩</div>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">Neural Inbox Empty. Awaiting Transmissions.</p>
                </Card>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
