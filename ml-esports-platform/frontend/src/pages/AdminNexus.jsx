import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listDisputes, resolveDispute } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'

function AdminNexus() {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDisputes()
  }, [])

  async function loadDisputes() {
    try {
      const res = await listDisputes()
      setDisputes(res.data)
    } catch (err) { console.error(err) } 
    finally { setLoading(false) }
  }

  async function onResolve(id) {
    try {
      await resolveDispute(id)
      loadDisputes()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-16 pb-32">
      <header className="relative py-20 px-10 rounded-[4rem] overflow-hidden glass border border-white/5 text-center">
        <div className="relative z-10 space-y-4">
           <div className="inline-block px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-[0.5em] text-red-500 animate-pulse">Platform Oversight Protocol</div>
           <h1 className="text-6xl md:text-8xl font-black italic uppercase italic-font-orbitron text-white leading-none">The <span className="text-primary">Nexus</span></h1>
           <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed italic opacity-80">"Absolute control over the Arena's integrity. Resolve conflicts, moderate legends, and steer the future."</p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/10 via-transparent to-primary/5 -z-0" />
      </header>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Disputes Section */}
        <div className="space-y-8">
           <div className="flex items-center justify-between px-4">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] italic flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                 Active Alert Log (Disputes)
              </h2>
              <span className="text-[10px] font-black text-muted-foreground uppercase">{disputes.filter(d => d.status === 'pending').length} Unresolved</span>
           </div>
           
           <div className="space-y-6">
              <AnimatePresence>
                {disputes.filter(d => d.status === 'pending').map(d => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={d.id}
                  >
                    <Card className="glass border-red-500/20 p-8 rounded-[3rem] bg-red-500/[0.01] hover:bg-red-500/[0.03] transition-all duration-500 relative overflow-hidden group">
                      <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Engagement ID: {d.match}</div>
                            <h3 className="text-xl font-black text-white uppercase italic italic-font-orbitron tracking-tight">{d.reason || "Conflict Detected"}</h3>
                          </div>
                          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{new Date(d.created_at).toLocaleTimeString()}</div>
                        </div>
                        
                        {d.screenshot && (
                           <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5">
                              <img src={d.screenshot} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" alt="Evidence" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">Expand Intel</button>
                              </div>
                           </div>
                        )}

                        <div className="flex gap-4">
                           <button onClick={() => onResolve(d.id)} className="flex-1 btn-secondary py-4 text-[10px] font-black uppercase tracking-widest bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all">Verify Resolution</button>
                           <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-all">🛡️</button>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 transition-all duration-500" />
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {disputes.filter(d => d.status === 'pending').length === 0 && !loading && (
                <div className="py-32 text-center glass rounded-[4rem] border border-white/5 opacity-40">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">Arena protocols stable. No active conflicts.</p>
                </div>
              )}
           </div>
        </div>

        {/* Global Overrides */}
        <div className="space-y-8">
           <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] italic px-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Platform Overrides
           </h2>
           <Card className="glass border-white/5 p-10 rounded-[4rem] bg-white/[0.01]">
              <div className="grid grid-cols-2 gap-6">
                 {[
                   { icon: '📢', label: 'Broadcast Dispatch', desc: 'Global Announcement', color: 'primary' },
                   { icon: '⚔️', label: 'Feature Arena', desc: 'Promote Tournament', color: 'accent' },
                   { icon: '🚫', label: 'Exile Pilot', desc: 'Sanction/Ban Player', color: 'red-500' },
                   { icon: '💎', label: 'Dispense AC', desc: 'Reward Distribution', color: 'green-500' },
                   { icon: '🛡️', label: 'Guild Review', desc: 'Verify Formations', color: 'blue-500' },
                   { icon: '📊', label: 'System Vitals', desc: 'Analytics Pulse', color: 'white' }
                 ].map(item => (
                   <div key={item.label} className="p-6 rounded-[2rem] bg-black/40 border border-white/5 hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer group">
                      <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
                      <div className="text-[11px] font-black uppercase tracking-tight text-white italic-font-orbitron">{item.label}</div>
                      <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{item.desc}</div>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminNexus
