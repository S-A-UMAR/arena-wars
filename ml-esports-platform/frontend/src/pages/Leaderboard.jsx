import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

function Leaderboard() {
  const [entries, setEntries] = useState([])
  useEffect(()=>{
    async function load(){
      const res = await listLeaderboard()
      setEntries(res.data)
    }
    load()
  },[])

  return (
    <div className="space-y-12 pb-20">
      <header className="text-center py-12">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white mb-4">The Hall of <span className="text-accent">Fame</span></h1>
        <p className="text-muted-foreground text-sm uppercase tracking-[0.3em] font-bold">Real-time competitive rankings across the arena</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {entries.map((e, index) => (
            <motion.div variants={item} key={e.id}>
              <Card className="flex items-center justify-between p-4 group transition-all duration-300 hover:bg-white/[0.03] hover:translate-x-2 border-white/5">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black italic text-xl ${index === 0 ? 'bg-accent text-background shadow-lg shadow-accent/20' : (index === 1 ? 'bg-primary/20 text-primary' : (index === 2 ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-muted-foreground'))}`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white uppercase italic tracking-tight flex items-center gap-3">
                      {e.name}
                      {index === 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-black tracking-widest uppercase">Champion</span>}
                    </div>
                    <div className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">{e.entity_type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Combat Power</div>
                  <div className="text-2xl font-black text-accent tracking-tighter">{e.score.toLocaleString()}</div>
                </div>
              </Card>
            </motion.div>
          ))}
          {entries.length === 0 && (
            <div className="text-center py-20 text-muted-foreground italic">No rankings established yet. The arena awaits its first legends.</div>
          )}
        </motion.div>
      </div>

      {/* Decorative Blur */}
      <div className="fixed top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </div>
  )
}

export default Leaderboard
