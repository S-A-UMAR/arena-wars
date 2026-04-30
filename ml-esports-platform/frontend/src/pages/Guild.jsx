import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import { listGuilds } from '../services/api'
import { motion } from 'framer-motion'

function Guild() {
  const [guilds, setGuilds] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const res = await listGuilds()
      setGuilds(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = guilds.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    (g.tag && g.tag.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase italic-font-orbitron text-white">Guild <span className="text-primary">Discovery</span></h1>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.4em] mt-2">Find your brotherhood in the arena</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            className="flex-1 md:w-64 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-primary transition" 
            placeholder="Search Name or Tag..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Link to="/guilds/create" className="btn whitespace-nowrap">+ Create Guild</Link>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground italic uppercase tracking-widest text-xs">Scanning Frequencies...</div>
      ) : filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(g => (
            <Link key={g.id} to={`/guilds/${g.id}`}>
              <Card className="hover:border-primary/30 transition-all duration-500 group">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-primary/10 transition">
                         {g.logo ? <img src={g.logo} className="w-full h-full object-cover" /> : '🛡️'}
                      </div>
                      <div>
                         <h3 className="text-lg font-black text-white uppercase italic truncate w-32 group-hover:text-primary transition">{g.name}</h3>
                         <span className="text-[10px] font-black text-accent uppercase tracking-widest">[{g.tag || '??? '}]</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Members</div>
                      <div className="text-sm font-black text-white">{g.members?.length || 0} / {g.max_slots}</div>
                   </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                   <div className="flex items-center gap-2">
                      <span className="text-xs">📍</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{g.country || 'Global'}</span>
                   </div>
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${g.join_policy === 'Open' ? 'border-green-500 text-green-500 bg-green-500/5' : 'border-accent text-accent bg-accent/5'}`}>
                      {g.join_policy}
                   </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 space-y-6">
           <div className="text-6xl opacity-20">📡</div>
           <h2 className="text-xl font-black text-white uppercase italic tracking-widest">No active Guilds available.</h2>
           <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] font-bold">Be the first to lead! Start your legacy today.</p>
           <Link to="/guilds/create" className="btn px-10">Initialize First Guild</Link>
        </div>
      )}
    </div>
  )
}

export default Guild
