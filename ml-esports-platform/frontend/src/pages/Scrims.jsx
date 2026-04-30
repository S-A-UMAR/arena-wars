import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listScrims, createScrim, listChatMessages, createChatMessage } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'

function Scrims() {
  const [scrims, setScrims] = useState([])
  const [guildA, setGuildA] = useState('')
  const [guildB, setGuildB] = useState('')
  const [format, setFormat] = useState('BO3')
  const [bounty, setBounty] = useState(0)
  const [selectedScrim, setSelectedScrim] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  async function load() {
    try {
      const res = await listScrims()
      setScrims(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(()=>{ load() },[])

  async function loadChat(id){
    try {
      const res = await listChatMessages(id)
      setMessages(res.data)
    } catch (err) { console.error(err) }
  }

  async function create() {
    if (!guildA || !guildB) return
    try {
      const date = new Date().toISOString()
      await createScrim({ 
        guild_a: Number(guildA), 
        guild_b: Number(guildB), 
        date, 
        match_format: format, 
        bounty: Number(bounty) 
      })
      setGuildA('')
      setGuildB('')
      setBounty(0)
      load()
    } catch (err) { console.error(err) }
  }

  async function send(){
    if (!selectedScrim || !text.trim()) return
    try {
      await createChatMessage({ scrim: selectedScrim, text })
      setText('')
      loadChat(selectedScrim)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="space-y-16 pb-32">
      <header className="relative py-20 px-10 rounded-[4rem] overflow-hidden glass border border-white/5">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <span className="w-8 h-1 bg-accent" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Mercenary Network</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase italic-font-orbitron text-white">Battlefield <span className="text-primary">Lobby</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mt-4 leading-relaxed italic opacity-80">Organize elite tactical simulations and contract-based skirmishes.</p>
        </div>
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-0 opacity-40" />
      </header>

      <Card className="glass relative border-primary/20 overflow-hidden p-10 rounded-[3rem]">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary italic font-black">!</div>
             <h3 className="text-xl font-black text-white uppercase tracking-tight italic italic-font-orbitron">Initiate Contract</h3>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-1">Alpha Unit ID</label>
              <input className="w-full px-5 py-3 text-sm rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white shadow-inner" placeholder="101" value={guildA} onChange={e=>setGuildA(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-1">Omega Unit ID</label>
              <input className="w-full px-5 py-3 text-sm rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white shadow-inner" placeholder="202" value={guildB} onChange={e=>setGuildB(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-1">Format</label>
              <select className="w-full px-5 py-3 text-sm rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white appearance-none cursor-pointer" value={format} onChange={e=>setFormat(e.target.value)}>
                <option value="BO1">BO1</option>
                <option value="BO3">BO3</option>
                <option value="BO5">BO5</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-1">Bounty (AC)</label>
              <input type="number" className="w-full px-5 py-3 text-sm rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white shadow-inner" placeholder="500" value={bounty} onChange={e=>setBounty(e.target.value)} />
            </div>
            <div className="flex items-end">
              <button className="btn w-full py-4 bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" onClick={create}>Launch Simulation</button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-10">
        {scrims.map(s=>(
          <Card key={s.id} className={`group border transition-all duration-700 rounded-[2.5rem] p-8 ${selectedScrim === s.id ? 'border-primary/50 bg-primary/[0.02] shadow-2xl shadow-primary/10' : 'border-white/5 hover:border-primary/20 bg-white/[0.01]'}`}>
            <div className="flex flex-col gap-8">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-6">
                     <div className="relative">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-2xl font-black italic text-primary border border-white/10 shadow-xl group-hover:rotate-[360deg] transition-transform duration-1000">Vs</div>
                        {s.bounty > 0 && (
                          <div className="absolute -top-3 -right-3 bg-accent text-background text-[10px] font-black px-2 py-1 rounded-xl shadow-lg shadow-accent/40 animate-bounce">💎 {s.bounty}</div>
                        )}
                     </div>
                     <div>
                        <div className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">Unit {s.guild_a} <span className="text-muted-foreground italic normal-case px-2 text-sm opacity-40">VS</span> Unit {s.guild_b}</div>
                        <div className="flex items-center gap-3 mt-1">
                           <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{s.match_format}</div>
                           <div className="w-1 h-1 rounded-full bg-white/10" />
                           <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{new Date(s.date).toLocaleDateString()}</div>
                        </div>
                     </div>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.status === 'scheduled' ? 'border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(255,215,0,0.2)]' : 'border-white/10 text-muted-foreground bg-white/5'}`}>{s.status}</div>
               </div>

               <div className="flex items-center gap-4">
                  <button className="flex-1 btn-secondary py-3 text-xs" onClick={() => { setSelectedScrim(s.id); loadChat(s.id); }}>Tactical Comms</button>
                  <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-xl">🛡️</button>
               </div>
            </div>

            <AnimatePresence>
               {selectedScrim === s.id && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="mt-8 pt-8 border-t border-white/5 overflow-hidden"
                 >
                   <div className="h-64 overflow-y-auto space-y-4 bg-black/60 p-6 rounded-[2rem] border border-white/5 scrollbar-hide">
                     {messages.length > 0 ? messages.map(m=>(
                       <div key={m.id} className="text-xs text-gray-300 leading-relaxed font-medium bg-white/5 p-3 rounded-2xl border border-white/5">
                         <span className="text-primary font-black uppercase mr-2 tracking-widest text-[8px]">Secure Uplink:</span> {m.text}
                       </div>
                     )) : (
                         <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                            <div className="w-12 h-px bg-white/20" />
                            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.4em] italic">Encrypted channel established</div>
                            <div className="w-12 h-px bg-white/20" />
                         </div>
                     )}
                   </div>
                   <div className="mt-6 flex gap-3">
                     <input className="flex-1 px-6 py-4 text-sm rounded-[1.5rem] bg-white/5 border border-white/10 focus:border-primary outline-none transition text-white shadow-inner" value={text} onChange={e=>setText(e.target.value)} placeholder="Transmit intelligence..." onKeyPress={e => e.key === 'Enter' && send()} />
                     <button className="px-8 py-4 rounded-[1.5rem] bg-primary text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition active:scale-95 shadow-xl shadow-primary/20" onClick={send}>Send</button>
                   </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </Card>
        ))}
        {scrims.length === 0 && (
            <div className="md:col-span-2 py-32 text-center text-muted-foreground text-sm uppercase tracking-[0.5em] italic glass rounded-[4rem] border border-white/5 bg-white/[0.02] animate-pulse">Standby for mercenary opportunities...</div>
        )}
      </div>
    </div>
  )
}

export default Scrims
