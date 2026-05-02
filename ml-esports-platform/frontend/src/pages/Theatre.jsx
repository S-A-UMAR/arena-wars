import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { listTheatreMatches } from '../services/api'
import Card from '../components/Card'
import NeuralBackground from '../components/NeuralBackground'
import { Skeleton } from '../components/Skeleton'

function Theatre() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMedia, setActiveMedia] = useState(null)

  useEffect(() => {
    listTheatreMatches().then(res => {
      setMatches(res.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-[90vh] relative p-6 max-w-7xl mx-auto space-y-12 pb-32">
      <NeuralBackground />
      
      <header className="text-center relative z-10 pt-10">
        <div className="text-primary text-4xl mb-4">🎬</div>
        <h1 className="text-5xl font-black italic uppercase italic-font-orbitron text-white">The <span className="text-primary">Theatre</span></h1>
        <p className="text-muted-foreground text-xs uppercase font-bold tracking-[0.3em] mt-4">VODs, Highlights & Archival Replays</p>
      </header>

      {loading ? (
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
           <div className="lg:col-span-2 space-y-6">
              <Skeleton variant="rectangular" className="aspect-video w-full rounded-[2rem]" />
              <Skeleton variant="rectangular" className="h-24 w-full" />
           </div>
           <div className="space-y-4">
              {[1,2,3,4,5].map(i => (
                 <Skeleton key={i} variant="rectangular" className="h-32 w-full" />
              ))}
           </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Main Stage (Video Player or Placeholder) */}
          <div className="lg:col-span-2 space-y-6">
             <Card className="aspect-video w-full glass border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-xl">
                {activeMedia?.stream_url ? (
                  <iframe 
                    className="w-full h-full"
                    src={activeMedia.stream_url.replace('watch?v=', 'embed/')} 
                    title="Match Replay"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : activeMedia?.replay_file ? (
                  <div className="text-center p-8">
                     <div className="text-6xl mb-6">📦</div>
                     <h2 className="text-2xl font-black uppercase italic text-white mb-2">Replay File Payload</h2>
                     <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">This match was recorded natively. Download the ROFL file to view it inside the Mobile Legends client.</p>
                     <a href={activeMedia.replay_file} download className="btn px-8 py-4 text-xs font-black uppercase tracking-widest bg-primary text-black hover:bg-primary/90 transition shadow-[0_0_20px_rgba(255,219,0,0.4)]">
                        Download Replay
                     </a>
                  </div>
                ) : (
                  <div className="text-center p-8 opacity-50">
                     <div className="text-4xl mb-4">📺</div>
                     <h2 className="text-xl font-black uppercase italic text-white">Select a Broadcast</h2>
                     <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Awaiting transmission...</p>
                  </div>
                )}
             </Card>

             {activeMedia && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                   <h3 className="text-xl font-black italic uppercase text-white mb-1">
                      {activeMedia.guild_a_name} <span className="text-primary mx-2">VS</span> {activeMedia.guild_b_name}
                   </h3>
                   <div className="flex gap-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      <span>{activeMedia.tournament_name || 'Scrimmage'}</span>
                      <span>•</span>
                      <span>Round {activeMedia.round}</span>
                      <span>•</span>
                      <span>{new Date(activeMedia.match_date).toLocaleDateString()}</span>
                   </div>
                </div>
             )}
          </div>

          {/* VOD List */}
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
             <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-4 sticky top-0 bg-background/80 backdrop-blur-md py-2 z-10">Archival Records</h3>
             
             {matches.length > 0 ? matches.map((m) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id}
                  onClick={() => setActiveMedia(m)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${activeMedia?.id === m.id ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(255,219,0,0.2)]' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
                >
                   <div className="flex justify-between items-start mb-3">
                      <div className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
                         {m.stream_url ? '▶ STREAM' : '⬇ REPLAY'}
                      </div>
                      <div className="text-[9px] text-muted-foreground font-bold uppercase">{new Date(m.match_date).toLocaleDateString()}</div>
                   </div>
                   
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                         {m.guild_a_logo ? <img src={m.guild_a_logo} className="w-6 h-6 rounded-md" /> : <div className="w-6 h-6 bg-white/10 rounded-md"></div>}
                         <span className="font-bold text-sm">{m.guild_a_name}</span>
                      </div>
                      <div className="font-black text-white/50 italic">VS</div>
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-sm">{m.guild_b_name}</span>
                         {m.guild_b_logo ? <img src={m.guild_b_logo} className="w-6 h-6 rounded-md" /> : <div className="w-6 h-6 bg-white/10 rounded-md"></div>}
                      </div>
                   </div>
                   
                   <div className="text-xs text-muted-foreground line-clamp-1">{m.tournament_name || 'Official Scrimmage'}</div>
                </motion.div>
             )) : (
                <div className="text-center p-10 border border-white/5 border-dashed rounded-2xl">
                   <div className="text-muted-foreground text-xs uppercase tracking-widest">No transmissions found</div>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Theatre
