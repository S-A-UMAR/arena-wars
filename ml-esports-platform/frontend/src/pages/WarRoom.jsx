import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import { getMatch, updateMatchStats } from '../services/api'
import { useToast } from '../context/ToastContext'

function WarRoom() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hype, setHype] = useState(0)
  const { showToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const res = await getMatch(id)
        setMatch(res.data)
        setHype(res.data.hype_score || 0)
      } catch (err) {
        showToast("Signal Lost: Match telemetry unreachable", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 10000) // Poll every 10s for "Live" feel
    return () => clearInterval(interval)
  }, [id])

  const onHype = () => {
    setHype(prev => prev + 1)
    // In real app, send to backend
  }

  if (loading) return <div className="h-screen flex items-center justify-center text-white italic animate-pulse">Establishing Satellite Link...</div>

  return (
    <div className="space-y-8 pb-32">
      {/* Cinematic Header */}
      <div className="relative h-[400px] rounded-[4rem] overflow-hidden border border-white/5 bg-black">
         <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
         
         <div className="relative h-full flex flex-col items-center justify-center p-10 text-center">
            <div className="flex items-center gap-4 mb-6">
               <span className="w-12 h-1 bg-primary" />
               <span className="text-[12px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Live Engagement In Progress</span>
               <span className="w-12 h-1 bg-primary" />
            </div>
            
            <div className="flex items-center gap-10 md:gap-20">
               <div className="space-y-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl md:text-6xl shadow-2xl">🛡️</div>
                  <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic italic-font-orbitron tracking-tighter">{match.guild_a_name}</h2>
               </div>
               <div className="text-center space-y-2">
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Score</div>
                  <div className="text-7xl md:text-9xl font-black text-white italic tracking-tighter leading-none">{match.score_a} <span className="text-primary text-4xl md:text-6xl px-4">-</span> {match.score_b}</div>
               </div>
               <div className="space-y-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl md:text-6xl shadow-2xl">⚔️</div>
                  <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic italic-font-orbitron tracking-tighter">{match.guild_b_name || 'TBD'}</h2>
               </div>
            </div>
         </div>
      </div>

      {/* Live Scoreboard (The missing logic) */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto -mt-20 relative z-10">
         <Card className="p-10 border-white/5 bg-white/[0.01] backdrop-blur-2xl rounded-[3rem] text-center space-y-4">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Unit Kills</div>
            <div className="flex justify-between items-center px-10">
               <div className="text-5xl font-black text-white italic">{match.team_a_kills || 24}</div>
               <div className="w-px h-12 bg-white/10" />
               <div className="text-5xl font-black text-white italic">{match.team_b_kills || 18}</div>
            </div>
         </Card>
         <Card className="p-10 border-white/5 bg-white/[0.01] backdrop-blur-2xl rounded-[3rem] text-center space-y-4">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Resource Accumulation (Gold)</div>
            <div className="flex justify-between items-center px-6">
               <div className="text-3xl font-black text-primary italic">{(match.team_a_gold || 42000).toLocaleString()}</div>
               <div className="w-px h-12 bg-white/10" />
               <div className="text-3xl font-black text-primary italic">{(match.team_b_gold || 38500).toLocaleString()}</div>
            </div>
         </Card>
         <Card className="p-10 border-white/5 bg-white/[0.01] backdrop-blur-2xl rounded-[3rem] text-center space-y-4 relative overflow-hidden group">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Arena Hype</div>
            <div className="text-5xl font-black text-accent italic">{hype}</div>
            <button 
               onClick={onHype}
               className="btn-secondary w-full py-2 text-[8px] font-black uppercase tracking-widest hover:bg-accent hover:text-background transition-all"
            >
               Cheer For Battalion
            </button>
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[60px] -z-0" />
         </Card>
      </div>

      {/* Pick & Ban Simulation (Visual only for now) */}
      <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
         <Card className="p-10 border-white/5 bg-white/[0.01] rounded-[4rem]">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic mb-10 border-b border-white/5 pb-4">Battalion Alpha <span className="text-primary">Draft Selection</span></h3>
            <div className="space-y-8">
               <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="flex-1 aspect-[3/4] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden">
                        👤
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  ))}
               </div>
               <div className="flex gap-3">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mr-4">Bans:</span>
                  {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xs opacity-40 grayscale hover:grayscale-0 transition">❌</div>
                  ))}
               </div>
            </div>
         </Card>
         
         <Card className="p-10 border-white/5 bg-white/[0.01] rounded-[4rem]">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic mb-10 border-b border-white/5 pb-4">Battalion Omega <span className="text-primary">Draft Selection</span></h3>
            <div className="space-y-8">
               <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="flex-1 aspect-[3/4] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden">
                        👤
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  ))}
               </div>
               <div className="flex gap-3">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mr-4">Bans:</span>
                  {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xs opacity-40 grayscale hover:grayscale-0 transition">❌</div>
                  ))}
               </div>
            </div>
         </Card>
      </div>

      {/* Persistence Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,transparent_70%)]" />
      </div>
    </div>
  )
}

export default WarRoom
