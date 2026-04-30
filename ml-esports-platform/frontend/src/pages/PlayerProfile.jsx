import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import { getProfile, listMatches } from '../services/api'
import { useToast } from '../context/ToastContext'

function PlayerProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [matches, setMatches] = useState([])
  const [activeTab, setActiveTab] = useState('record')
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const res = await getProfile(id)
        setProfile(res.data)
        const mRes = await listMatches() // Filter matches for this player in reality
        setMatches(mRes.data)
      } catch (err) {
        showToast("Signal Lost: Intelligence folder unavailable", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
       <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white opacity-40">Decrypting Service Record...</p>
    </div>
  )

  return (
    <div className="space-y-16 pb-32">
      <header className="relative py-20 px-10 rounded-[4rem] overflow-hidden glass border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
           <div className="relative">
              <div className="w-32 h-32 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-2xl">
                 {profile?.user?.username?.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary text-background flex items-center justify-center text-xl shadow-xl shadow-primary/20">🛡️</div>
           </div>
           <div className="text-center md:text-left space-y-2">
              <h1 className="text-5xl font-black italic uppercase italic-font-orbitron text-white leading-none tracking-tighter">{profile?.user?.username}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                 <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-muted-foreground uppercase tracking-widest">{profile?.rank || 'Mythic'} Rank</span>
                 <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">{profile?.guild_name || 'No Battalion'}</span>
                 <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">{profile?.country || 'Global Sector'}</span>
              </div>
           </div>
        </div>
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-0 opacity-40" />
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-4 border-b border-white/5 pb-8">
         {[
           { id: 'record', label: 'Service Record' },
           { id: 'tactical', label: 'Tactical Stats' },
           { id: 'achievements', label: 'Achievements' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic transition-all duration-300 ${activeTab === tab ? 'bg-primary text-background shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
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
          {activeTab === 'record' && (
             <div className="lg:col-span-2 space-y-12">
                <section className="space-y-8">
                   <h2 className="text-xs font-black text-white uppercase tracking-[0.4em] italic px-4">Recent Engagements</h2>
                   <div className="grid md:grid-cols-2 gap-6">
                      {matches.slice(0, 6).map(m => (
                        <Card key={m.id} className="p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${m.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                                    {m.status === 'completed' ? '⚔️' : '⏱️'}
                                 </div>
                                 <div>
                                    <div className="text-sm font-black text-white uppercase italic">{m.guild_a_name} vs {m.guild_b_name || 'TBD'}</div>
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{m.tournament_name || 'Scrimmage'}</div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-lg font-black text-primary italic">{m.score_a}-{m.score_b}</div>
                              </div>
                           </div>
                        </Card>
                      ))}
                   </div>
                </section>

                <section className="space-y-8">
                   <h2 className="text-xs font-black text-white uppercase tracking-[0.4em] italic px-4">Service Eras (Guild History)</h2>
                   <div className="relative pl-8 space-y-8 before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-white/5">
                      {[
                        { guild: 'Shadow Clan', role: 'Captain', era: '2025-2026', achievements: '2x Regional Finals' },
                        { guild: 'Neon Legion', role: 'Mercenary', era: '2024-2025', achievements: 'Highest Win Rate' }
                      ].map((item, i) => (
                        <div key={i} className="relative">
                           <div className="absolute -left-10 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div>
                                 <div className="text-lg font-black text-white uppercase italic tracking-tighter">{item.guild}</div>
                                 <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.role} • {item.era}</div>
                              </div>
                              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-primary uppercase tracking-widest italic">{item.achievements}</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
             </div>
          )}

          {activeTab === 'tactical' && (
             <>
                <Card className="p-10 border-white/5 bg-white/[0.01] rounded-[3rem]">
                   <h3 className="text-xs font-black text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Combat Efficiency</h3>
                   <div className="space-y-6">
                      {[
                        { label: 'Avg Kill Participation', val: '72%' },
                        { label: 'Gold Per Minute', val: '680' },
                        { label: 'Tower Damage', val: '4,200' },
                        { label: 'MVP Frequency', val: '14%' }
                      ].map(s => (
                        <div key={s.label} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                           <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{s.label}</span>
                           <span className="text-sm font-black text-white italic">{s.val}</span>
                        </div>
                      ))}
                   </div>
                </Card>
                <Card className="p-10 border-white/5 bg-white/[0.01] rounded-[3rem]">
                   <h3 className="text-xs font-black text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Most Deployed Units</h3>
                   <div className="space-y-6">
                      {[
                        { hero: 'Lancelot', games: 124, wr: '72%' },
                        { hero: 'Hayabusa', games: 82, wr: '65%' },
                        { hero: 'Gusion', games: 45, wr: '58%' }
                      ].map(h => (
                        <div key={h.hero} className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">👤</div>
                              <div>
                                 <div className="text-sm font-black text-white uppercase italic">{h.hero}</div>
                                 <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{h.games} Matches</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-sm font-black text-primary italic">{h.wr} WR</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </Card>
             </>
          )}

          {activeTab === 'achievements' && (
             <div className="lg:col-span-2">
                <Card className="p-20 text-center space-y-6 opacity-40 border-dashed border-white/10 rounded-[4rem]">
                   <div className="text-5xl">🏆</div>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">Awaiting high-priority accolades.</p>
                </Card>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default PlayerProfile
