import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../components/Card'
import { listTournaments, listMatchesByTournament } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'

function TournamentDetail() {
  const { id } = useParams()
  const [tournament, setTournament] = useState(null)
  const [matches, setMatches] = useState([])
  const [activeTab, setActiveTab] = useState('bracket')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const tRes = await listTournaments()
        const t = tRes.data.find(x => x.id === Number(id))
        setTournament(t)
        
        const mRes = await listMatchesByTournament(id)
        setMatches(mRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="text-center py-32 text-muted-foreground italic uppercase tracking-[0.5em] animate-pulse">Synchronizing Tournament Core...</div>
  if (!tournament) return <div className="text-center py-32 text-red-500 font-black uppercase italic tracking-widest">Tournament Not Found</div>

  return (
    <div className="space-y-12 pb-20">
      <header className="relative py-16 px-10 rounded-[3.5rem] overflow-hidden glass border border-white/5 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${tournament.status === 'live' ? 'border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(255,215,0,0.2)]' : 'border-accent text-accent bg-accent/10'}`}>
                   {tournament.status}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{tournament.type} Elimination</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black italic uppercase italic-font-orbitron text-white leading-none">{tournament.name}</h1>
             <p className="text-gray-400 text-lg max-w-2xl leading-relaxed italic opacity-80">"{tournament.description || "The ultimate test of skill and brotherhood."}"</p>
          </div>
          <div className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
             <div className="text-center">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Prize Pool</div>
                <div className="text-4xl font-black text-primary italic italic-font-orbitron tracking-tighter">{tournament.prize_pool || '$0.00'}</div>
             </div>
             <Link to={`/tournaments/${id}/manage`} className="btn px-10 py-3 text-xs">Admin Access</Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2" />
      </header>

      {/* Tabs */}
      <div className="flex justify-center gap-4 border-b border-white/5 pb-6">
         {['bracket', 'roster', 'meta', 'prizes', 'handbook'].map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] italic transition-all duration-300 ${activeTab === tab ? 'bg-primary text-background shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
           >
              {tab}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
         <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
         >
            {activeTab === 'bracket' && (
              <div className="space-y-12">
                 {/* Simplified Bracket View */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {matches.length > 0 ? matches.map(match => (
                      <Link to={`/matches/${match.id}`} key={match.id}>
                        <Card className="p-6 border-white/5 bg-white/[0.01] hover:border-primary/20 transition-all group">
                           <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-4">Round {match.round}</div>
                           <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-black text-white uppercase italic">{match.guild_a_name}</span>
                                 <span className="text-sm font-black text-primary">{match.score_a}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-black text-white uppercase italic">{match.guild_b_name || 'TBD'}</span>
                                 <span className="text-sm font-black text-primary">{match.score_b}</span>
                              </div>
                           </div>
                           <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                              <span className={`text-[8px] font-black uppercase tracking-widest ${match.status === 'live' ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}>{match.status}</span>
                              <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">Analyze →</span>
                           </div>
                        </Card>
                      </Link>
                    )) : (
                      <div className="col-span-full text-center py-20 border border-dashed border-white/5 rounded-[3rem] opacity-30">
                        <span className="text-xs font-black uppercase tracking-[0.4em]">Bracket Generation Pending</span>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'roster' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {tournament.teams?.map(team => (
                   <Card key={team.id} className="p-6 border-white/5 bg-white/[0.01] hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                            {team.guild_logo ? <img src={team.guild_logo} className="w-full h-full object-cover" /> : '🛡️'}
                         </div>
                         <div>
                            <div className="text-sm font-black text-white uppercase italic tracking-tight">{team.guild_name}</div>
                            <div className="text-[8px] font-black text-accent uppercase tracking-widest">Seed #{team.seed}</div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div>
                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2">Main Platoon (5)</div>
                            <div className="grid grid-cols-5 gap-2">
                               {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/20">P</div>)}
                            </div>
                         </div>
                         <div>
                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2">Reserve Units (Subs)</div>
                            <div className="flex gap-2">
                               {[1,2].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary/40">S</div>)}
                            </div>
                         </div>
                      </div>
                   </Card>
                 ))}
              </div>
            )}

            {activeTab === 'meta' && (
               <div className="max-w-4xl mx-auto space-y-10">
                  <header className="text-center">
                     <h3 className="text-2xl font-black text-white italic uppercase italic-font-orbitron">Tournament <span className="text-primary">Meta Report</span></h3>
                     <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">Aggregated Hero Ban Intelligence</p>
                  </header>
                  <div className="grid md:grid-cols-2 gap-8">
                     <Card className="p-8 border-white/5">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Most Banned Heroes</h4>
                        <div className="space-y-4">
                           {[
                             { name: 'Ling', bans: 14, rate: '82%' },
                             { name: 'Fanny', bans: 12, rate: '70%' },
                             { name: 'Valentina', bans: 10, rate: '58%' },
                             { name: 'Paquito', bans: 8, rate: '47%' }
                           ].map(hero => (
                             <div key={hero.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs">🛡️</div>
                                   <span className="text-xs font-black text-white uppercase italic">{hero.name}</span>
                                </div>
                                <div className="text-right">
                                   <div className="text-xs font-black text-primary">{hero.bans} BANS</div>
                                   <div className="text-[8px] font-bold text-muted-foreground">{hero.rate} Rate</div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </Card>
                     <Card className="p-8 border-white/5 bg-primary/5">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Draft Volatility</h4>
                        <div className="h-48 flex items-center justify-center border border-dashed border-white/10 rounded-2xl opacity-40">
                           <span className="text-[10px] font-black uppercase tracking-widest">Analytics Pulse Coming Soon</span>
                        </div>
                     </Card>
                  </div>
               </div>
            )}

            {activeTab === 'prizes' && (
               <div className="max-w-3xl mx-auto">
                  <Card className="p-10 border-white/5 relative overflow-hidden">
                     <h3 className="text-2xl font-black text-white italic uppercase italic-font-orbitron mb-10 text-center">Prize <span className="text-primary">Ledger</span></h3>
                     <div className="space-y-4 relative z-10">
                        {[
                          { rank: '1ST PLACE', share: '60%', amount: '$300.00', color: 'text-primary' },
                          { rank: '2ND PLACE', share: '30%', amount: '$150.00', color: 'text-white' },
                          { rank: '3RD PLACE', share: '10%', amount: '$50.00', color: 'text-muted-foreground' }
                        ].map(tier => (
                          <div key={tier.rank} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all">
                             <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black italic ${tier.color}`}>#</div>
                                <span className="text-sm font-black text-white uppercase italic">{tier.rank}</span>
                             </div>
                             <div className="text-right">
                                <div className={`text-xl font-black ${tier.color} italic tracking-tighter`}>{tier.amount}</div>
                                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{tier.share} OF POOL</div>
                             </div>
                          </div>
                        ))}
                     </div>
                     <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-0" />
                  </Card>
               </div>
            )}

            {activeTab === 'handbook' && (
              <div className="max-w-3xl mx-auto">
                 <Card className="p-10 border-white/5 bg-white/[0.01]">
                    <h3 className="text-2xl font-black text-white italic uppercase italic-font-orbitron mb-8 flex items-center gap-3">
                       <span className="w-2 h-8 bg-primary" />
                       Rules of Engagement
                    </h3>
                    <div className="prose prose-invert max-w-none space-y-6">
                       <div className="space-y-2">
                          <h4 className="text-xs font-black text-primary uppercase tracking-widest">Format</h4>
                          <p className="text-sm text-gray-400 leading-relaxed">{tournament.type} Elimination bracket. All matches are BO1 except Grand Finals (BO3).</p>
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-xs font-black text-primary uppercase tracking-widest">Fair Play</h4>
                          <p className="text-sm text-gray-400 leading-relaxed">Any form of cheating, exploitation, or toxic behavior will result in immediate DQ and potential platform ban.</p>
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-xs font-black text-primary uppercase tracking-widest">Official Rules</h4>
                          <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                             {tournament.rules || "No specific rules defined. Standard arena protocols apply."}
                          </div>
                       </div>
                    </div>
                 </Card>
              </div>
            )}
         </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default TournamentDetail
