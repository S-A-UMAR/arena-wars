import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'

const HEROES = [
  { id: 1, name: 'Ling', role: 'Jungler' },
  { id: 2, name: 'Lancelot', role: 'Jungler' },
  { id: 3, name: 'Kaja', role: 'Roamer' },
  { id: 4, name: 'Mathilda', role: 'Roamer' },
  { id: 5, name: 'Beatrix', role: 'Gold Lane' },
  { id: 6, name: 'Claude', role: 'Gold Lane' },
  { id: 7, name: 'Pharsa', role: 'Mid Lane' },
  { id: 8, name: 'Yve', role: 'Mid Lane' },
  { id: 9, name: 'Paquito', role: 'EXP Lane' },
  { id: 10, name: 'Benedetta', role: 'EXP Lane' },
]

function DraftSimulator() {
  const [turn, setTurn] = useState('BLUE') // BLUE or RED
  const [phase, setPhase] = useState('BAN') // BAN or PICK
  const [bluePicks, setBluePicks] = useState([])
  const [redPicks, setRedPicks] = useState([])
  const [blueBans, setBlueBans] = useState([])
  const [redBans, setRedBans] = useState([])
  const [selectedHero, setSelectedHero] = useState(null)

  const onHeroClick = (hero) => {
    if (bluePicks.includes(hero) || redPicks.includes(hero) || blueBans.includes(hero) || redBans.includes(hero)) return
    setSelectedHero(hero)
  }

  const confirmAction = () => {
    if (!selectedHero) return

    if (phase === 'BAN') {
      if (turn === 'BLUE') {
        setBlueBans([...blueBans, selectedHero])
        setTurn('RED')
      } else {
        setRedBans([...redBans, selectedHero])
        setTurn('BLUE')
      }
      if (blueBans.length + redBans.length === 5) setPhase('PICK') // Simple logic for demo
    } else {
      if (turn === 'BLUE') {
        setBluePicks([...bluePicks, selectedHero])
        setTurn('RED')
      } else {
        setRedPicks([...redPicks, selectedHero])
        setTurn('BLUE')
      }
    }
    setSelectedHero(null)
  }

  return (
    <div className="space-y-12 pb-32">
       <header className="text-center py-12">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4">Tactical Simulation Module</div>
          <h1 className="text-6xl font-black italic uppercase italic-font-orbitron text-white">Draft <span className="text-primary">Simulator</span></h1>
          <p className="text-muted-foreground mt-4 italic opacity-60">Master the art of the pick-ban strategy before the battle begins.</p>
       </header>

       <div className="grid lg:grid-cols-4 gap-12 max-w-[1600px] mx-auto px-10">
          {/* Blue Side */}
          <div className="space-y-8">
             <div className="text-center">
                <h2 className="text-3xl font-black text-blue-500 italic uppercase italic-font-orbitron">Battalion Blue</h2>
                <div className={`mt-2 h-1 w-full bg-blue-500/20 rounded-full overflow-hidden ${turn === 'BLUE' ? 'animate-pulse' : 'opacity-20'}`}>
                   <div className="h-full w-full bg-blue-500" />
                </div>
             </div>
             <div className="space-y-4">
                {[0,1,2,3,4].map(i => (
                  <Card key={i} className={`h-40 flex flex-col items-center justify-center border-blue-500/20 bg-blue-500/[0.02] rounded-[2rem] relative overflow-hidden ${bluePicks[i] ? 'border-blue-500/50' : 'border-dashed'}`}>
                     {bluePicks[i] ? (
                       <div className="text-center">
                          <div className="text-3xl mb-2">👤</div>
                          <div className="text-sm font-black text-white uppercase italic">{bluePicks[i].name}</div>
                          <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{bluePicks[i].role}</div>
                       </div>
                     ) : (
                       <span className="text-[10px] font-black text-blue-500/20 uppercase tracking-widest italic">Awaiting Pick</span>
                     )}
                  </Card>
                ))}
             </div>
             <div className="flex gap-2 justify-center">
                {[0,1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-xl border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-500/40 italic">
                      {blueBans[i] ? '❌' : `B${i+1}`}
                   </div>
                ))}
             </div>
          </div>

          {/* Central Hero Pool */}
          <div className="lg:col-span-2 space-y-10">
             <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
                <div>
                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Phase</div>
                   <div className="text-2xl font-black text-white uppercase italic italic-font-orbitron tracking-tighter">{phase} PHASE</div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Turn</div>
                   <div className={`text-2xl font-black uppercase italic italic-font-orbitron tracking-tighter ${turn === 'BLUE' ? 'text-blue-500' : 'text-red-500'}`}>{turn} UNIT</div>
                </div>
             </div>

             <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
                {HEROES.map(hero => {
                  const isTaken = bluePicks.includes(hero) || redPicks.includes(hero) || blueBans.includes(hero) || redBans.includes(hero);
                  return (
                    <div 
                      key={hero.id}
                      onClick={() => onHeroClick(hero)}
                      className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 transition-all cursor-pointer relative overflow-hidden group ${isTaken ? 'opacity-20 grayscale cursor-not-allowed' : selectedHero === hero ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                    >
                       <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">👤</div>
                       <div className="text-[9px] font-black text-white uppercase italic text-center leading-none">{hero.name}</div>
                    </div>
                  )
                })}
             </div>

             <button 
               onClick={confirmAction}
               disabled={!selectedHero}
               className={`w-full py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] italic transition-all ${selectedHero ? 'bg-primary text-background shadow-2xl shadow-primary/20 hover:scale-[1.02]' : 'bg-white/5 text-muted-foreground border border-white/10 opacity-50 cursor-not-allowed'}`}
             >
                Confirm {phase}
             </button>
          </div>

          {/* Red Side */}
          <div className="space-y-8 text-right">
             <div className="text-center">
                <h2 className="text-3xl font-black text-red-500 italic uppercase italic-font-orbitron">Battalion Red</h2>
                <div className={`mt-2 h-1 w-full bg-red-500/20 rounded-full overflow-hidden ${turn === 'RED' ? 'animate-pulse' : 'opacity-20'}`}>
                   <div className="h-full w-full bg-red-500" />
                </div>
             </div>
             <div className="space-y-4">
                {[0,1,2,3,4].map(i => (
                  <Card key={i} className={`h-40 flex flex-col items-center justify-center border-red-500/20 bg-red-500/[0.02] rounded-[2rem] relative overflow-hidden ${redPicks[i] ? 'border-red-500/50' : 'border-dashed'}`}>
                     {redPicks[i] ? (
                       <div className="text-center">
                          <div className="text-3xl mb-2">👤</div>
                          <div className="text-sm font-black text-white uppercase italic">{redPicks[i].name}</div>
                          <div className="text-[8px] font-black text-red-400 uppercase tracking-widest">{redPicks[i].role}</div>
                       </div>
                     ) : (
                       <span className="text-[10px] font-black text-red-500/20 uppercase tracking-widest italic">Awaiting Pick</span>
                     )}
                  </Card>
                ))}
             </div>
             <div className="flex gap-2 justify-center">
                {[0,1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-xl border border-red-500/30 flex items-center justify-center text-[10px] font-black text-red-500/40 italic">
                      {redBans[i] ? '❌' : `B${i+1}`}
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  )
}

export default DraftSimulator
