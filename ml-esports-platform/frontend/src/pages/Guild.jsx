import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
}

function Guild() {
  const [guilds, setGuilds] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [hook, setHook] = useState('')

  async function load() {
    const res = await listGuilds()
    setGuilds(res.data)
  }
  useEffect(()=>{ load() },[])

  async function create() {
    if (!name) return
    await createGuild({ name, description, discord_webhook_url: hook })
    setName('')
    setDescription('')
    setHook('')
    load()
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="relative py-12 px-8 rounded-3xl overflow-hidden glass border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2">Build Your <span className="text-accent">Dynasty</span></h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Unite the strongest players and dominate the region.</p>
          </div>
          <button 
            className="btn"
            onClick={() => document.getElementById('createGuildForm')?.scrollIntoView({behavior:'smooth'})}
          >
            Form New Guild
          </button>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-0" />
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {guilds.map(g => (
          <motion.div variants={item} key={g.id}>
            <Card className="h-full flex flex-col group border border-white/5 hover:border-accent/30 transition-all duration-500">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:bg-accent/10 transition group-hover:scale-110">🛡️</div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase italic">{g.name}</h2>
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      Global Rank #{g.rank || 'N/A'}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8 line-clamp-3">
                  {g.description || "This guild is focused on competitive Mobile Legends excellence and strategic scrim orchestration."}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <button className="btn-secondary flex-1 py-2" onClick={()=>joinGuild(g.id)}>Join</button>
                <button className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 transition" onClick={()=>leaveGuild(g.id)}>Leave</button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <section id="createGuildForm" className="max-w-3xl mx-auto pt-10">
        <Card className="glass relative border-accent/20 p-10 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-8 uppercase italic flex items-center gap-3">
              <span className="w-2 h-8 bg-accent rounded-full" />
              Found a New Guild
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Guild Name</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-accent outline-none transition" placeholder="Elite Vanguard..." value={name} onChange={e=>setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Discord Webhook (Optional)</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-accent outline-none transition" placeholder="https://discord.com/api/..." value={hook} onChange={e=>setHook(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Guild Manifesto / Description</label>
                <textarea className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-accent outline-none transition h-32 resize-none" placeholder="We play to win..." value={description} onChange={e=>setDescription(e.target.value)} />
              </div>
              <button className="btn w-full py-4 text-center mt-4 shadow-xl shadow-accent/20" onClick={create}>Activate Guild</button>
            </div>
          </div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
        </Card>
      </section>
    </div>
  )
}

export default Guild
