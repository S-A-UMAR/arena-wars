import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import { listMatches, listPlayerStatsByMatch } from '../services/api'
import { motion } from 'framer-motion'

function MatchDetail() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await listMatches()
        const m = res.data.find(x => x.id === Number(id))
        setMatch(m)
        const sRes = await listPlayerStatsByMatch(id)
        setStats(sRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="text-center py-20 text-muted-foreground italic uppercase tracking-widest text-xs">Accessing Tactical Intelligence...</div>
  if (!match) return <div className="text-center py-20 text-red-500 font-bold uppercase italic">Match Records Lost or Corrupted</div>

  // In a real scenario, you'd separate by team. Let's assume stats have a team field or we can derive it.
  // For now, we'll split them based on the match's guild_a and guild_b.
  const teamA = stats.filter(s => s.guild === match.guild_a)
  const teamB = stats.filter(s => s.guild === match.guild_b)

  const isMemberA = profile?.guild === match.guild_a
  const isMemberB = profile?.guild === match.guild_b
  const canCheckIn = (isMemberA && !match.guild_a_checked_in) || (isMemberB && !match.guild_b_checked_in)
  const bothCheckedIn = match.guild_a_checked_in && match.guild_b_checked_in

  return (
    <div className="space-y-12 pb-20">
      <header className="text-center space-y-4">
        <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">Intelligence Report #{id}</div>
        <h1 className="text-5xl font-black italic uppercase italic-font-orbitron text-white">Engagement <span className="text-primary">Analysis</span></h1>
        
        {canCheckIn && (
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="mt-8 flex flex-col items-center gap-4"
           >
              <div className="text-[10px] font-black text-accent uppercase tracking-widest animate-pulse">Deployment Window Open</div>
              <button className="btn py-4 px-12 text-lg shadow-xl shadow-primary/20 animate-glow">Confirm Combat Ready</button>
           </motion.div>
        )}

        <div className="flex items-center justify-center gap-8 pt-10">
           <div className="text-right flex-1">
              <div className="text-3xl font-black text-white italic uppercase">{match.guild_a_name || 'Guild A'}</div>
              <div className="flex justify-end gap-2 mt-2">
                 <span className={`w-3 h-3 rounded-full ${match.guild_a_checked_in ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-white/10'}`} />
                 <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{match.guild_a_checked_in ? 'Checked In' : 'Awaiting Pilot'}</span>
              </div>
              <div className="text-6xl font-black text-primary mt-4">{match.score_a || 0}</div>
           </div>
           <div className="text-4xl font-black text-white/20 italic italic-font-orbitron">VS</div>
           <div className="text-left flex-1">
              <div className="text-3xl font-black text-white italic uppercase">{match.guild_b_name || 'Guild B'}</div>
              <div className="flex justify-start gap-2 mt-2">
                 <span className={`w-3 h-3 rounded-full ${match.guild_b_checked_in ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-white/10'}`} />
                 <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{match.guild_b_checked_in ? 'Checked In' : 'Awaiting Pilot'}</span>
              </div>
              <div className="text-6xl font-black text-primary mt-4">{match.score_b || 0}</div>
           </div>
        </div>
      </header>

      {/* Tactical Briefing / Lobby Info */}
      <AnimatePresence>
         {match.status === 'live' && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="max-w-md mx-auto mb-10"
            >
               <Link to={`/war-room/${id}`} className="btn w-full py-5 text-sm font-black uppercase tracking-[0.4em] bg-red-500/10 border-red-500/50 text-red-500 shadow-2xl shadow-red-500/10 flex items-center justify-center gap-3 group">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="group-hover:tracking-[0.5em] transition-all">Satellite View: Watch Live</span>
               </Link>
            </motion.div>
         )}
         
         {bothCheckedIn && (
           <motion.section
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="max-w-2xl mx-auto space-y-6"
           >
              <Card className="p-8 border-accent/30 bg-accent/5 relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-xl">📡</div>
                       <h3 className="text-xl font-black text-white italic uppercase italic-font-orbitron">Tactical Briefing</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                          <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Room ID</div>
                          <div className="text-xl font-black text-white italic tracking-tighter">{match.room_id || '9827 4152'}</div>
                       </div>
                       <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                          <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Password</div>
                          <div className="text-xl font-black text-accent italic tracking-tighter">{match.room_password || 'AW-909'}</div>
                       </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center opacity-60">Join the custom lobby immediately. Good luck, Pilot.</p>
                 </div>
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -z-0" />
              </Card>

              {/* Evidence Uplink (Dispute Submission) */}
              <Card className="p-8 border-white/5 bg-white/[0.01] rounded-[2rem] border-dashed">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                       <h4 className="text-sm font-black text-white uppercase italic">Evidence Uplink</h4>
                       <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Submit combat logs or dispute results</p>
                    </div>
                    <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Initiate Dispute Protocol</button>
                 </div>
              </Card>
           </motion.section>
         )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Team A Stats */}
        <section className="space-y-6">
           <h3 className="text-xs font-black text-white uppercase tracking-widest italic flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Team Alpha Performance
           </h3>
           <div className="space-y-3">
              {teamA.map(p => (
                <Card key={p.id} className={`p-4 border-white/5 ${p.is_mvp ? 'border-accent/30 bg-accent/5 shadow-lg shadow-accent/5' : ''}`}>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">🛡️</div>
                         <div>
                            <div className="text-xs font-black text-white uppercase italic flex items-center gap-2">
                               {p.user_name || `Player ${p.user}`}
                               {p.is_mvp && <span className="text-[8px] px-1.5 py-0.5 rounded bg-accent text-background font-black uppercase tracking-widest">MVP</span>}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{p.hero_played}</div>
                         </div>
                      </div>
                      <div className="flex gap-6 items-center">
                         <div className="text-center">
                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">K/D/A</div>
                            <div className="text-xs font-black text-white">{p.kills}/{p.deaths}/{p.assists}</div>
                         </div>
                         <div className="text-center w-16">
                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Gold</div>
                            <div className="text-xs font-black text-primary">{p.gold.toLocaleString()}</div>
                         </div>
                      </div>
                   </div>
                </Card>
              ))}
           </div>
        </section>

        {/* Team B Stats */}
        <section className="space-y-6">
           <h3 className="text-xs font-black text-white uppercase tracking-widest italic flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Team Bravo Performance
           </h3>
           <div className="space-y-3">
              {teamB.map(p => (
                <Card key={p.id} className="p-4 border-white/5">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">🛡️</div>
                         <div>
                            <div className="text-xs font-black text-white uppercase italic">{p.user_name || `Player ${p.user}`}</div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{p.hero_played}</div>
                         </div>
                      </div>
                      <div className="flex gap-6 items-center">
                         <div className="text-center">
                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">K/D/A</div>
                            <div className="text-xs font-black text-white">{p.kills}/{p.deaths}/{p.assists}</div>
                         </div>
                         <div className="text-center w-16">
                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Gold</div>
                            <div className="text-xs font-black text-primary">{p.gold.toLocaleString()}</div>
                         </div>
                      </div>
                   </div>
                </Card>
              ))}
           </div>
        </section>
      </div>

      {/* Advanced Metrix / Charts Placeholder */}
      <section>
         <h3 className="text-xs font-black text-white uppercase tracking-widest italic mb-6">Tactical Heatmaps & Economy Flux</h3>
         <div className="grid md:grid-cols-3 gap-6">
            <Card className="h-48 border-dashed border-white/10 flex items-center justify-center opacity-30">
               <span className="text-[10px] font-black uppercase tracking-widest">Gold Advantage Chart</span>
            </Card>
            <Card className="h-48 border-dashed border-white/10 flex items-center justify-center opacity-30">
               <span className="text-[10px] font-black uppercase tracking-widest">Objective Control (Lord/Turtle)</span>
            </Card>
            <Card className="h-48 border-dashed border-white/10 flex items-center justify-center opacity-30">
               <span className="text-[10px] font-black uppercase tracking-widest">Combat Heatmap (Teamfights)</span>
            </Card>
         </div>
      </section>
    </div>
  )
}

export default MatchDetail
