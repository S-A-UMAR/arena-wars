import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import { listTournaments, generateBracket, listMatchesByTournament } from '../services/api'
import { motion } from 'framer-motion'

function TournamentManage() {
  const { id } = useParams()
  const [tournament, setTournament] = useState(null)
  const [matches, setMatches] = useState([])

  async function load() {
    try {
      const res = await listTournaments()
      const t = res.data.find(x => x.id === Number(id))
      setTournament(t)
      if (t) {
        const mRes = await listMatchesByTournament(id)
        setMatches(mRes.data)
      }
    } catch (err) { console.error(err) }
  }

  useEffect(() => { load() }, [id])

  async function onGenerate() {
    if (!window.confirm("Warning: This will reset all current matches in this tournament. Proceed?")) return
    try {
      await generateBracket(id)
      load()
    } catch (err) { console.error(err) }
  }

  const matchesByRound = matches.reduce((acc, m) => {
    if (!acc[m.round]) acc[m.round] = []
    acc[m.round].push(m)
    return acc
  }, {})

  if (!tournament) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 opacity-40">
       <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Synchronizing Console...</p>
    </div>
  )

  return (
    <div className="space-y-16 pb-32">
      <header className="relative py-20 px-12 rounded-[4rem] overflow-hidden glass border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Administrative Console</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black italic uppercase italic-font-orbitron text-white leading-none">Command <span className="text-primary">Center</span></h1>
             <p className="text-gray-400 text-lg max-w-xl leading-relaxed italic opacity-80">Overseeing: <span className="text-white font-bold">{tournament.name}</span></p>
          </div>
          <div className="flex gap-4">
             <button onClick={onGenerate} className="btn px-10 py-5 bg-primary/20 text-primary border border-primary/40 shadow-2xl shadow-primary/5 hover:bg-primary hover:text-background transition-all">
                Re-Generate Bracket Intelligence
             </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-0 opacity-40" />
      </header>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Teams Management */}
        <div className="lg:col-span-1 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Registered Units</h2>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black text-primary">{tournament.teams?.length || 0} / {tournament.max_slots}</span>
           </div>
           <Card className="glass border-white/5 p-6 rounded-[2.5rem] space-y-4 bg-white/[0.01]">
              {tournament.teams?.map(t => (
                <div key={t.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center group hover:border-red-500/30 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs">🛡️</div>
                     <div className="text-xs font-black text-white uppercase italic tracking-tight">{t.guild_name || `UNIT_${t.guild}`}</div>
                  </div>
                  <button className="text-[9px] font-black text-muted-foreground uppercase tracking-widest hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">Disqualify</button>
                </div>
              ))}
              {(!tournament.teams || tournament.teams.length === 0) && (
                <div className="text-center py-20 text-muted-foreground uppercase font-black text-[10px] tracking-[0.3em] italic opacity-40">No units detected in sector.</div>
              )}
           </Card>
        </div>

        {/* Tactical Bracket Control */}
        <div className="lg:col-span-3 space-y-8">
           <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Synchronized Engagement Map (Bracket)</h2>
           <div className="flex gap-10 overflow-x-auto pb-10 custom-scrollbar snap-x">
              {Object.keys(matchesByRound).length > 0 ? Object.keys(matchesByRound).sort((a,b)=>a-b).map(round => (
                <div key={round} className="flex-shrink-0 w-80 space-y-8 snap-start">
                  <div className="text-center py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-white italic">Engagement Round {round}</div>
                  <div className="space-y-6">
                    {matchesByRound[round].map(m => (
                      <Card key={m.id} className="p-6 border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-primary/40 transition-all duration-500 rounded-[2rem] group relative overflow-hidden">
                         <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center">
                               <span className={`text-[11px] font-black uppercase italic ${m.score_a > m.score_b ? 'text-primary' : 'text-white opacity-40'}`}>{m.guild_a_name || 'TBD'}</span>
                               <span className="text-lg font-black text-primary italic">{m.score_a || 0}</span>
                            </div>
                            <div className="h-px bg-white/5 w-full" />
                            <div className="flex justify-between items-center">
                               <span className={`text-[11px] font-black uppercase italic ${m.score_b > m.score_a ? 'text-primary' : 'text-white opacity-40'}`}>{m.guild_b_name || 'TBD'}</span>
                               <span className="text-lg font-black text-primary italic">{m.score_b || 0}</span>
                            </div>
                         </div>
                         <div className="absolute top-0 right-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-all duration-500" />
                      </Card>
                    ))}
                  </div>
                </div>
              )) : (
                 <div className="w-full py-40 text-center glass rounded-[4rem] border border-white/5 opacity-40 border-dashed">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Initialize Bracket to begin deployment.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentManage
