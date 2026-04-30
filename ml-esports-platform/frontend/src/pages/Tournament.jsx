import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import { listTournaments, registerGuildToTournament, getProfile } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Tournament() {
  const { user } = useAuth()
  const [tournaments, setTournaments] = useState([])
  const [profile, setProfile] = useState(null)

  async function load() {
    try {
      const res = await listTournaments()
      setTournaments(res.data)
      if (user) {
        const p = await getProfile()
        setProfile(p.data)
      }
    } catch (err) { console.error(err) }
  }

  useEffect(() => { load() }, [])

  async function onRegister(id) {
    if (!profile?.guild) {
      alert("You must be in a guild to register.")
      return
    }
    try {
      await registerGuildToTournament(id, profile.guild)
      alert("Registered successfully!")
      load()
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed")
    }
  }

  return (
    <div className="space-y-16 pb-32">
      <header className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
           <div className="flex items-center gap-2">
              <span className="w-8 h-1 bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Live Circuit Alpha</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic uppercase italic-font-orbitron text-white">The <span className="text-primary">Arenas</span></h1>
           <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold opacity-60">Global Synchronization in Progress</p>
        </div>
        <div className="flex gap-4">
           <Link to="/tournaments/create" className="btn px-10 py-4 shadow-xl shadow-primary/10">+ Create Arena</Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-10">
        {tournaments.map(t => (
          <Link key={t.id} to={`/tournaments/${t.id}`}>
            <Card className="group relative overflow-hidden border-white/5 hover:border-primary/40 transition-all duration-700 hover:scale-[1.01] bg-gradient-to-br from-white/[0.02] to-transparent p-0">
               <div className="p-8 space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary">{t.type} ELIM</span>
                           <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${t.status === 'open' ? 'border-green-500 text-green-500 bg-green-500/5' : 'border-white/10 text-muted-foreground bg-white/5'}`}>{t.status}</span>
                        </div>
                        <h2 className="text-3xl font-black uppercase italic italic-font-orbitron text-white leading-tight group-hover:text-primary transition-colors">{t.name}</h2>
                     </div>
                     <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-500">🏆</div>
                  </div>

                  <p className="text-sm text-gray-400 font-medium leading-relaxed italic opacity-60 line-clamp-2">"{t.description || "Enter the fray and secure your place in history."}"</p>

                  <div className="grid grid-cols-3 gap-4">
                     {[
                        { label: 'Prize Pool', val: t.prize_pool || '$0.00', color: 'text-primary' },
                        { label: 'Slots', val: `${t.teams_count || 0} / ${t.max_slots}`, color: 'text-white' },
                        { label: 'Deployment', val: new Date(t.start_date).toLocaleDateString([], { month: 'short', day: 'numeric' }), color: 'text-white' }
                     ].map(stat => (
                        <div key={stat.label} className="bg-black/40 p-4 rounded-2xl border border-white/5">
                           <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</div>
                           <div className={`text-sm font-black italic tracking-tight ${stat.color}`}>{stat.val}</div>
                        </div>
                     ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                     <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-white/10" />)}
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-white/5 flex items-center justify-center text-[8px] font-black text-white">+{t.teams_count || 0}</div>
                     </div>
                     <div className="text-[10px] font-black text-primary uppercase italic tracking-widest group-hover:mr-2 transition-all">Analyze Intelligence →</div>
                  </div>
               </div>

               {/* Background Effects */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="absolute bottom-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-700" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Tournament
