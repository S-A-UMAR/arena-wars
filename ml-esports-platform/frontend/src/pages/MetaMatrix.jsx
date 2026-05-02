import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getMetaMatrix } from '../services/api'
import Card from '../components/Card'
import NeuralBackground from '../components/NeuralBackground'
import { GridSkeleton, Skeleton } from '../components/Skeleton'

function MetaMatrix() {
  const [data, setData] = useState({ most_picked: [], most_banned: [], top_players: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMetaMatrix().then(res => {
      setData(res.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-[90vh] relative p-6 max-w-7xl mx-auto space-y-12">
      <NeuralBackground />
      
      <header className="text-center relative z-10 pt-10">
        <div className="text-primary text-4xl mb-4">📊</div>
        <h1 className="text-5xl font-black italic uppercase italic-font-orbitron text-white">Meta <span className="text-primary">Matrix</span></h1>
        <p className="text-muted-foreground text-xs uppercase font-bold tracking-[0.3em] mt-4">Global Tactics & Analytics Hub</p>
      </header>

      {loading ? (
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
           <Skeleton variant="rectangular" className="h-[600px] rounded-[2rem]" />
           <Skeleton variant="rectangular" className="h-[600px] rounded-[2rem]" />
           <Skeleton variant="rectangular" className="h-[600px] rounded-[2rem]" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Most Picked */}
          <Card className="p-8 glass border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
             <h2 className="text-2xl font-black uppercase italic italic-font-orbitron mb-6 text-blue-400">Top Deployed</h2>
             <div className="space-y-4">
                {data.most_picked.length > 0 ? data.most_picked.map((item, idx) => (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="text-2xl font-black text-white/20 italic">0{idx+1}</div>
                        <div className="font-bold uppercase tracking-wider text-sm">{item.hero_played}</div>
                     </div>
                     <div className="text-blue-400 font-black text-xl">{item.count} <span className="text-[10px] text-muted-foreground">PICKS</span></div>
                  </motion.div>
                )) : (
                  <div className="text-center text-muted-foreground text-xs uppercase tracking-widest py-10">No data available</div>
                )}
             </div>
          </Card>

          {/* Most Banned */}
          <Card className="p-8 glass border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
             <h2 className="text-2xl font-black uppercase italic italic-font-orbitron mb-6 text-red-400">Highest Threat</h2>
             <div className="space-y-4">
                {data.most_banned.length > 0 ? data.most_banned.map((item, idx) => (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="text-2xl font-black text-white/20 italic">0{idx+1}</div>
                        <div className="font-bold uppercase tracking-wider text-sm">{item.hero_name}</div>
                     </div>
                     <div className="text-red-400 font-black text-xl">{item.count} <span className="text-[10px] text-muted-foreground">BANS</span></div>
                  </motion.div>
                )) : (
                  <div className="text-center text-muted-foreground text-xs uppercase tracking-widest py-10">No data available</div>
                )}
             </div>
          </Card>

          {/* Top Players by Role */}
          <Card className="p-8 glass border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
             <h2 className="text-2xl font-black uppercase italic italic-font-orbitron mb-6 text-primary">Elite Operatives</h2>
             <div className="space-y-4">
                {data.top_players.length > 0 ? data.top_players.map((p, idx) => (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
                     {p.profile_image ? (
                        <img src={p.profile_image} className="w-12 h-12 rounded-xl object-cover border border-primary/50 group-hover:scale-110 transition-transform" />
                     ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center font-black text-primary text-xl">
                          {p.username.charAt(0).toUpperCase()}
                        </div>
                     )}
                     <div className="flex-1">
                        <div className="text-xs text-primary font-black uppercase tracking-widest">{p.role}</div>
                        <div className="font-bold">{p.username}</div>
                     </div>
                     <div className="text-right">
                        <div className="text-lg font-black">{p.mythic_points}</div>
                        <div className="text-[9px] text-muted-foreground uppercase tracking-widest">Points</div>
                     </div>
                  </motion.div>
                )) : (
                  <div className="text-center text-muted-foreground text-xs uppercase tracking-widest py-10">No operatives found</div>
                )}
             </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default MetaMatrix
