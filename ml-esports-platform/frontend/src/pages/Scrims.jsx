import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listScrims, createScrim, listChatMessages, createChatMessage } from '../services/api'

function Scrims() {
  const [scrims, setScrims] = useState([])
  const [guildA, setGuildA] = useState('')
  const [guildB, setGuildB] = useState('')
  const [format, setFormat] = useState('BO3')
  const [selectedScrim, setSelectedScrim] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  async function load() {
    const res = await listScrims()
    setScrims(res.data)
  }
  useEffect(()=>{ load() },[])
  async function loadChat(id){
    const res = await listChatMessages(id)
    setMessages(res.data)
  }
  async function create() {
    if (!guildA || !guildB) return
    const date = new Date().toISOString()
    await createScrim({ guild_a: Number(guildA), guild_b: Number(guildB), date, match_format: format })
    setGuildA('')
    setGuildB('')
    load()
  }
  async function send(){
    if (!selectedScrim || !text.trim()) return
    await createChatMessage({ scrim: selectedScrim, text })
    setText('')
    loadChat(selectedScrim)
  }
  return (
    <div className="space-y-12 pb-20">
      <header className="relative py-12 px-8 rounded-3xl overflow-hidden glass border border-white/5">
        <div className="relative z-10">
          <h1 className="text-4xl font-black uppercase italic italic-font-orbitron text-white mb-2">Battlefield <span className="text-primary">Lobby</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Organize elite scrimmages and tactical simulations.</p>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
      </header>

      <Card className="glass relative border-primary/20 overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xs font-black text-white uppercase tracking-widest italic mb-6 italic-font-orbitron">Call to Arms</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-muted-foreground tracking-widest ml-1">Team Alpha ID</label>
              <input className="w-full px-4 py-2 text-sm rounded-xl bg-black/30 border border-white/10 focus:border-primary outline-none transition text-white" placeholder="ID: 101" value={guildA} onChange={e=>setGuildA(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-muted-foreground tracking-widest ml-1">Team Omega ID</label>
              <input className="w-full px-4 py-2 text-sm rounded-xl bg-black/30 border border-white/10 focus:border-primary outline-none transition text-white" placeholder="ID: 202" value={guildB} onChange={e=>setGuildB(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-muted-foreground tracking-widest ml-1">Engagement Format</label>
              <select className="w-full px-4 py-2 text-sm rounded-xl bg-black/30 border border-white/10 focus:border-primary outline-none transition text-white appearance-none cursor-pointer" value={format} onChange={e=>setFormat(e.target.value)}>
                <option value="BO1">Best of 1</option>
                <option value="BO3">Best of 3</option>
                <option value="BO5">Best of 5</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn w-full py-2.5 bg-primary shadow-lg shadow-primary/20" onClick={create}>Initiate Scrim</button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {scrims.map(s=>(
          <Card key={s.id} className={`group border transition-all duration-500 ${selectedScrim === s.id ? 'border-primary/50 shadow-2xl shadow-primary/10' : 'border-white/5 hover:border-primary/20'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl font-black italic text-primary border border-white/10">Vs</div>
                 </div>
                 <div>
                    <div className="text-lg font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">Alpha {s.guild_a} <span className="text-muted-foreground italic normal-case px-1 text-xs">vs</span> Omega {s.guild_b}</div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">{s.match_format} • {new Date(s.date).toLocaleDateString()}</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${s.status === 'scheduled' ? 'border-primary/30 text-primary bg-primary/5' : 'border-white/10 text-muted-foreground'}`}>{s.status}</div>
                <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-sm" onClick={()=>setSelectedScrim(s.id) || loadChat(s.id)}>💬</button>
              </div>
            </div>
            {selectedScrim === s.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 pt-8 border-t border-white/5"
              >
                <div className="h-48 overflow-y-auto space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5 scrollbar-hide">
                  {messages.length > 0 ? messages.map(m=>(
                    <div key={m.id} className="text-[11px] text-gray-300 leading-relaxed font-medium">
                      <span className="text-primary font-bold uppercase mr-2 tracking-widest text-[8px]">Tactical:</span> {m.text}
                    </div>
                  )) : (
                      <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em] italic">Encrypted channel established</div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <input className="flex-1 px-4 py-3 text-xs rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition text-white" value={text} onChange={e=>setText(e.target.value)} placeholder="Enter transmission..." onKeyPress={e => e.key === 'Enter' && send()} />
                  <button className="px-5 py-3 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition active:scale-95 shadow-lg shadow-primary/10" onClick={send}>Send</button>
                </div>
              </motion.div>
            )}
          </Card>
        ))}
        {scrims.length === 0 && (
            <div className="md:col-span-2 py-20 text-center text-muted-foreground text-sm uppercase tracking-[0.4em] italic glass rounded-3xl border border-white/5 bg-white/[0.02]">Standby for scrimmage opportunities</div>
        )}
      </div>
    </div>
  )
}

export default Scrims
