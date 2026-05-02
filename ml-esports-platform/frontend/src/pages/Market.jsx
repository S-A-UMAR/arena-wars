import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listMarketPosts, listFreeAgents } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { GridSkeleton } from '../components/Skeleton'

function Market() {
  const [activeTab, setActiveTab] = useState('free_agents')
  const [freeAgents, setFreeAgents] = useState([])
  const [recruitments, setRecruitments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRank, setFilterRank] = useState('All')
  const [filterRole, setFilterRole] = useState('All')
  const [filterWinRate, setFilterWinRate] = useState(50)
  const { showToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const [fa, rec] = await Promise.all([listFreeAgents(), listMarketPosts()])
        setFreeAgents(Array.isArray(fa.data) ? fa.data : [fa.data]) 
        setRecruitments(rec.data)
      } catch (err) { 
        showToast("Market Intelligence Offline: Could not sync sector data", "error")
      }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="space-y-16 pb-32">
      <header className="relative py-20 px-10 rounded-[4rem] overflow-hidden glass border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Neural Marketplace</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black italic uppercase italic-font-orbitron text-white">The <span className="text-primary">Exchange</span></h1>
             <p className="text-gray-400 text-lg max-w-2xl leading-relaxed italic opacity-80">"Acquire elite talent or find your place within a legendary battalion."</p>
          </div>
          <div className="hidden md:block w-48 h-48 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center text-6xl animate-float">🛒</div>
        </div>
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-0 opacity-40" />
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-4 border-b border-white/5 pb-8">
         {[
           { id: 'free_agents', label: 'Tactical Pilots' },
           { id: 'recruitment', label: 'Battalions (LFM)' },
           { id: 'history', label: 'Contract History' }
         ].map(t => (
           <button 
             key={t.id}
             onClick={() => setActiveTab(t.id)}
             className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic transition-all duration-300 ${activeTab === t.id ? 'bg-primary text-background shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
           >
              {t.label}
           </button>
         ))}
      </div>

      {activeTab === 'free_agents' && (
        <div className="max-w-4xl mx-auto bg-black/40 border border-white/5 rounded-[2rem] p-6 mb-10 flex flex-col md:flex-row gap-6 items-end backdrop-blur-xl">
           <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tactical Role</label>
              <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-primary/50">
                 <option value="All">All Roles</option>
                 <option value="Jungler">Jungler</option>
                 <option value="Mid">Mid Lane</option>
                 <option value="Gold">Gold Lane</option>
                 <option value="EXP">EXP Lane</option>
                 <option value="Roam">Roam</option>
              </select>
           </div>
           <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rank Clearance</label>
              <select value={filterRank} onChange={e => setFilterRank(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-primary/50">
                 <option value="All">All Ranks</option>
                 <option value="Mythic Immortal">Mythic Immortal</option>
                 <option value="Mythical Glory">Mythical Glory</option>
                 <option value="Mythical Honor">Mythical Honor</option>
                 <option value="Mythic">Mythic</option>
              </select>
           </div>
           <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min Win Rate</label>
                 <span className="text-[10px] font-black text-primary">{filterWinRate}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={filterWinRate} onChange={e => setFilterWinRate(e.target.value)}
                className="w-full accent-primary"
              />
           </div>
           <button onClick={() => {setFilterRole('All'); setFilterRank('All'); setFilterWinRate(50)}} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest transition">Reset</button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {activeTab === 'free_agents' && freeAgents.filter(p => {
             const wr = parseFloat(p.win_rate || 0);
             const roleMatch = filterRole === 'All' || (p.main_role === filterRole);
             const rankMatch = filterRank === 'All' || (p.rank === filterRank);
             const wrMatch = wr >= filterWinRate;
             return roleMatch && rankMatch && wrMatch;
          }).map(p => (
            <Card key={p.id} className="relative overflow-hidden group border-white/5 hover:border-primary/40 transition-all duration-700 bg-white/[0.01] p-8 rounded-[3rem]">
               <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-primary">
                           {p.user?.username?.charAt(0)}
                        </div>
                        <div>
                           <div className="text-xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">{p.user?.username}</div>
                           <div className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-1">{p.rank || 'Mythic Immortal'}</div>
                        </div>
                     </div>
                     <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-muted-foreground">{p.main_role || 'Roam'}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Win Rate</div>
                        <div className="text-sm font-black text-white italic tracking-tighter">{p.win_rate || '68'}%</div>
                     </div>
                     <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Mythic Pts</div>
                        <div className="text-sm font-black text-white italic tracking-tighter">{p.mythic_points || 1240}</div>
                     </div>
                  </div>

                  <button className="mt-auto btn w-full py-4 text-[10px] font-black tracking-widest uppercase hover:scale-[1.02] transition-transform shadow-xl shadow-primary/5">Initiate Recruitment</button>
               </div>
            </Card>
          ))}

          {activeTab === 'recruitment' && recruitments.map(r => (
            <Card key={r.id} className="relative overflow-hidden group border-white/5 hover:border-accent/40 transition-all duration-700 bg-white/[0.01] p-8 rounded-[3rem] flex flex-col h-full">
               <div className="relative z-10 space-y-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                     <div>
                        <div className="text-2xl font-black text-accent uppercase italic italic-font-orbitron tracking-tighter group-hover:text-white transition-colors">{r.guild || 'SHADOW CLAN'}</div>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Seeking:</span>
                           <span className="text-[10px] text-white font-black uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded border border-accent/20">{r.role || 'Jungler'}</span>
                        </div>
                     </div>
                  </div>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed italic opacity-60 line-clamp-3">"{r.desc || "We are a high-discipline battalion seeking a clinical executioner."}"</p>
                  <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                     <div className="space-y-1">
                        <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Deployment Bonus</div>
                        <div className="text-lg font-black text-accent italic tracking-tighter">{r.bounty || 2500} AC</div>
                     </div>
                     <button className="btn-secondary px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-background transition-all">Apply</button>
                  </div>
               </div>
            </Card>
          ))}

          {activeTab === 'history' && (
             <div className="lg:col-span-3">
                <Card className="p-20 text-center space-y-6 opacity-40 border-dashed border-white/10 rounded-[4rem]">
                   <div className="text-5xl">📜</div>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">No finalized contracts recorded in this sector.</p>
                </Card>
             </div>
          )}
        </motion.div>
      </AnimatePresence>

      {loading && (
        <div className="pt-10">
           <GridSkeleton count={6} height="h-64" />
        </div>
      )}
    </div>
  )
}

export default Market
