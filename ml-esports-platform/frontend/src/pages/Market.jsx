import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listMarketPosts, listFreeAgents } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../context/ToastContext'

function Market() {
  const [activeTab, setActiveTab] = useState('free_agents')
  const [freeAgents, setFreeAgents] = useState([])
  const [recruitments, setRecruitments] = useState([])
  const [loading, setLoading] = useState(true)
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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {activeTab === 'free_agents' && freeAgents.map(p => (
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
        <div className="py-40 text-center space-y-4">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-40">Scanning Marketplace Channels...</p>
        </div>
      )}
    </div>
  )
}

export default Market
