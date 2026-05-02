import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'

const CATEGORIES = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support']

const HEROES = [
  // Tanks
  { id: 1, name: 'Tigreal', type: 'Tank' },
  { id: 2, name: 'Khufra', type: 'Tank' },
  { id: 3, name: 'Atlas', type: 'Tank' },
  { id: 4, name: 'Franco', type: 'Tank' },
  // Fighters
  { id: 5, name: 'Paquito', type: 'Fighter' },
  { id: 6, name: 'Chou', type: 'Fighter' },
  { id: 7, name: 'Yu Zhong', type: 'Fighter' },
  { id: 8, name: 'Benedetta', type: 'Fighter' },
  // Assassins
  { id: 9, name: 'Ling', type: 'Assassin' },
  { id: 10, name: 'Lancelot', type: 'Assassin' },
  { id: 11, name: 'Gusion', type: 'Assassin' },
  { id: 12, name: 'Fanny', type: 'Assassin' },
  // Mages
  { id: 13, name: 'Pharsa', type: 'Mage' },
  { id: 14, name: 'Yve', type: 'Mage' },
  { id: 15, name: 'Kagura', type: 'Mage' },
  { id: 16, name: 'Valentina', type: 'Mage' },
  // Marksmen
  { id: 17, name: 'Beatrix', type: 'Marksman' },
  { id: 18, name: 'Claude', type: 'Marksman' },
  { id: 19, name: 'Wanwan', type: 'Marksman' },
  { id: 20, name: 'Brody', type: 'Marksman' },
  // Supports
  { id: 21, name: 'Mathilda', type: 'Support' },
  { id: 22, name: 'Kaja', type: 'Support' },
  { id: 23, name: 'Estes', type: 'Support' },
  { id: 24, name: 'Angela', type: 'Support' },
]

function DraftSimulator() {
  const [turn, setTurn] = useState('BLUE') // BLUE or RED
  const [phase, setPhase] = useState('BAN') // BAN or PICK
  const [bluePicks, setBluePicks] = useState([])
  const [redPicks, setRedPicks] = useState([])
  const [blueBans, setBlueBans] = useState([])
  const [redBans, setRedBans] = useState([])
  const [selectedHero, setSelectedHero] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws/draft/global/')
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setTurn(data.turn)
      setPhase(data.phase)
      setBluePicks(data.bluePicks)
      setRedPicks(data.redPicks)
      setBlueBans(data.blueBans)
      setRedBans(data.redBans)
    }
    return () => {
      ws.current?.close()
    }
  }, [])

  const filteredHeroes = useMemo(() => {
    if (activeCategory === 'All') return HEROES
    return HEROES.filter(h => h.type === activeCategory)
  }, [activeCategory])

  const onHeroClick = (hero) => {
    if (bluePicks.some(p => p.id === hero.id) || redPicks.some(p => p.id === hero.id) || blueBans.some(b => b.id === hero.id) || redBans.some(b => b.id === hero.id)) return
    setSelectedHero(hero)
  }

  const confirmAction = () => {
    if (!selectedHero) return

    let nextTurn = turn === 'BLUE' ? 'RED' : 'BLUE'
    let nextPhase = phase
    let newBluePicks = [...bluePicks]
    let newRedPicks = [...redPicks]
    let newBlueBans = [...blueBans]
    let newRedBans = [...redBans]

    if (phase === 'BAN') {
      if (turn === 'BLUE') newBlueBans.push(selectedHero)
      else newRedBans.push(selectedHero)
      if (newBlueBans.length + newRedBans.length === 5) nextPhase = 'PICK'
    } else {
      if (turn === 'BLUE') newBluePicks.push(selectedHero)
      else newRedPicks.push(selectedHero)
    }

    const payload = {
      turn: nextTurn,
      phase: nextPhase,
      bluePicks: newBluePicks,
      redPicks: newRedPicks,
      blueBans: newBlueBans,
      redBans: newRedBans
    }

    // Optimistic UI update
    setTurn(nextTurn)
    setPhase(nextPhase)
    setBluePicks(newBluePicks)
    setRedPicks(newRedPicks)
    setBlueBans(newBlueBans)
    setRedBans(newRedBans)

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload))
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
                <div className={`mt-2 h-1 w-full bg-blue-500/20 rounded-full overflow-hidden ${turn === 'BLUE' ? 'animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'opacity-20'}`}>
                   <div className="h-full w-full bg-blue-500" />
                </div>
             </div>
             <div className="space-y-4">
                {[0,1,2,3,4].map(i => (
                  <Card key={i} className={`h-24 md:h-32 flex items-center p-4 gap-4 border-blue-500/20 bg-gradient-to-r from-blue-500/[0.05] to-transparent rounded-[2rem] relative overflow-hidden backdrop-blur-md transition-all ${bluePicks[i] ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-dashed'}`}>
                     {bluePicks[i] ? (
                       <>
                         <div className="text-4xl bg-blue-500/10 h-16 w-16 rounded-2xl flex items-center justify-center border border-blue-500/30">👤</div>
                         <div className="text-left">
                            <div className="text-lg font-black text-white uppercase italic">{bluePicks[i].name}</div>
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{bluePicks[i].type}</div>
                         </div>
                       </>
                     ) : (
                       <div className="w-full text-center">
                         <span className="text-[10px] font-black text-blue-500/30 uppercase tracking-widest italic">Awaiting Pick</span>
                       </div>
                     )}
                  </Card>
                ))}
             </div>
             <div className="flex justify-between gap-2">
                {[0,1,2,3,4].map(i => (
                   <div key={i} className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-xs font-black italic transition-all ${blueBans[i] ? 'bg-red-500/20 border border-red-500/50 text-red-500' : 'border border-blue-500/30 text-blue-500/40 bg-blue-500/5'}`}>
                      {blueBans[i] ? '❌' : `B${i+1}`}
                   </div>
                ))}
             </div>
          </div>

          {/* Central Hero Pool */}
          <div className="lg:col-span-2 space-y-8">
             <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                <div>
                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Phase</div>
                   <div className="text-2xl font-black text-white uppercase italic italic-font-orbitron tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{phase} PHASE</div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Turn</div>
                   <div className={`text-2xl font-black uppercase italic italic-font-orbitron tracking-tighter drop-shadow-xl ${turn === 'BLUE' ? 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>{turn} UNIT</div>
                </div>
             </div>

             {/* Category Tabs */}
             <div className="flex flex-wrap gap-2 justify-center bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-md">
                {CATEGORIES.map(category => (
                   <button
                     key={category}
                     onClick={() => setActiveCategory(category)}
                     className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === category ? 'bg-primary text-black shadow-[0_0_15px_rgba(255,219,0,0.5)] scale-105' : 'text-muted-foreground hover:text-white hover:bg-white/10'}`}
                   >
                     {category}
                   </button>
                ))}
             </div>

             <div className="bg-black/40 border border-white/5 rounded-[2rem] p-6 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                   <motion.div layout className="grid grid-cols-4 md:grid-cols-6 gap-4">
                      {filteredHeroes.map(hero => {
                        const isTaken = bluePicks.some(p => p.id === hero.id) || redPicks.some(p => p.id === hero.id) || blueBans.some(b => b.id === hero.id) || redBans.some(b => b.id === hero.id);
                        return (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            key={hero.id}
                            onClick={() => onHeroClick(hero)}
                            className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-2 transition-all cursor-pointer relative overflow-hidden group ${isTaken ? 'opacity-20 grayscale cursor-not-allowed border-white/5' : selectedHero === hero ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(255,219,0,0.3)] scale-105 z-10' : 'border-white/10 bg-white/[0.03] hover:border-primary/50 hover:bg-white/10 hover:shadow-lg'}`}
                          >
                             <div className={`text-3xl mb-2 transition-transform duration-300 ${!isTaken && 'group-hover:scale-110 group-hover:-translate-y-1'}`}>👤</div>
                             <div className="text-[9px] font-black text-white uppercase italic text-center leading-tight">{hero.name}</div>
                             <div className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">{hero.type}</div>
                          </motion.div>
                        )
                      })}
                   </motion.div>
                </AnimatePresence>
             </div>

             <button 
               onClick={confirmAction}
               disabled={!selectedHero}
               className={`w-full py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] italic transition-all ${selectedHero ? 'bg-primary text-black shadow-[0_0_30px_rgba(255,219,0,0.4)] hover:scale-[1.02] active:scale-95' : 'bg-white/5 text-muted-foreground border border-white/10 opacity-50 cursor-not-allowed'}`}
             >
                Confirm {phase}
             </button>
          </div>

          {/* Red Side */}
          <div className="space-y-8 text-right flex flex-col">
             <div className="text-center">
                <h2 className="text-3xl font-black text-red-500 italic uppercase italic-font-orbitron">Battalion Red</h2>
                <div className={`mt-2 h-1 w-full bg-red-500/20 rounded-full overflow-hidden ${turn === 'RED' ? 'animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'opacity-20'}`}>
                   <div className="h-full w-full bg-red-500" />
                </div>
             </div>
             <div className="space-y-4">
                {[0,1,2,3,4].map(i => (
                  <Card key={i} className={`h-24 md:h-32 flex flex-row-reverse items-center p-4 gap-4 border-red-500/20 bg-gradient-to-l from-red-500/[0.05] to-transparent rounded-[2rem] relative overflow-hidden backdrop-blur-md transition-all ${redPicks[i] ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-dashed'}`}>
                     {redPicks[i] ? (
                       <>
                         <div className="text-4xl bg-red-500/10 h-16 w-16 rounded-2xl flex items-center justify-center border border-red-500/30">👤</div>
                         <div className="text-right">
                            <div className="text-lg font-black text-white uppercase italic">{redPicks[i].name}</div>
                            <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">{redPicks[i].type}</div>
                         </div>
                       </>
                     ) : (
                       <div className="w-full text-center">
                         <span className="text-[10px] font-black text-red-500/30 uppercase tracking-widest italic">Awaiting Pick</span>
                       </div>
                     )}
                  </Card>
                ))}
             </div>
             <div className="flex justify-between gap-2 mt-auto">
                {[0,1,2,3,4].map(i => (
                   <div key={i} className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-xs font-black italic transition-all ${redBans[i] ? 'bg-red-500/20 border border-red-500/50 text-red-500' : 'border border-red-500/30 text-red-500/40 bg-red-500/5'}`}>
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
