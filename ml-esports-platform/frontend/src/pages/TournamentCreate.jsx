import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { createTournament } from '../services/api'

function TournamentCreate() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('single')
  const [prizePool, setPrizePool] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [status, setStatus] = useState('open')
  const [startDate, setStartDate] = useState('')
  const [streamUrl, setStreamUrl] = useState('')
  const [maxSlots, setMaxSlots] = useState(16)
  const [guildOnly, setGuildOnly] = useState(true)

  async function onSubmit() {
    if (!name || !startDate) return
    try {
      await createTournament({ 
        name, 
        description,
        type, 
        start_date: new Date(startDate).toISOString(), 
        prize_pool: prizePool,
        is_free_to_join: isFree,
        status,
        stream_url: streamUrl,
        max_slots: maxSlots,
        guild_only: guildOnly
      })
      navigate('/tournaments')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black italic uppercase italic-font-orbitron text-white">Create <span className="text-primary">Tournament</span></h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold mt-2">Initialize a new competitive arena</p>
      </header>

      <Card className="glass border-white/5 p-8">
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tournament Name</label>
              <input className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm" placeholder="e.g. Mythic Glory Invitational S1" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Format</label>
              <select className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm appearance-none" value={type} onChange={e => setType(e.target.value)}>
                <option value="single">Single Elimination</option>
                <option value="double">Double Elimination</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
            <textarea className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm h-32 resize-none" placeholder="Detail the rules..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Prize Pool</label>
              <input className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm" placeholder="e.g. 5000 AC" value={prizePool} onChange={e => setPrizePool(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Start Date</label>
              <input type="datetime-local" className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Max Slots</label>
              <select className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm appearance-none" value={maxSlots} onChange={e => setMaxSlots(e.target.value)}>
                <option value={8}>8 Teams</option>
                <option value={16}>16 Teams</option>
                <option value={32}>32 Teams</option>
                <option value={64}>64 Teams</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Broadcast Link</label>
              <input className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm" placeholder="https://youtube.com/..." value={streamUrl} onChange={e => setStreamUrl(e.target.value)} />
            </div>
            <div className="flex items-center gap-4 h-[50px]">
               <button onClick={() => setIsFree(!isFree)} className={`flex-1 py-3 rounded-2xl border transition-all font-black uppercase text-[10px] tracking-widest ${isFree ? 'bg-secondary/10 border-secondary/50 text-secondary' : 'bg-white/5 border-white/10 text-muted-foreground'}`}>
                 {isFree ? 'Free to Join' : 'Paid Entry'}
               </button>
               <button onClick={() => setGuildOnly(!guildOnly)} className={`flex-1 py-3 rounded-2xl border transition-all font-black uppercase text-[10px] tracking-widest ${guildOnly ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-muted-foreground'}`}>
                 {guildOnly ? 'Guilds Only' : 'Open to All'}
               </button>
            </div>
          </div>

          <button className="btn w-full py-4 text-center mt-4 shadow-xl shadow-primary/20" onClick={onSubmit}>Initialize Tournament</button>
        </div>
      </Card>
    </div>
  )
}

export default TournamentCreate
