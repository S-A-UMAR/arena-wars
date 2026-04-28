import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { getProfile, listScrims, listTournaments, updateProfileImage } from '../services/api'

function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [scrims, setScrims] = useState([])
  const [tournaments, setTournaments] = useState([])
  useEffect(()=>{
    async function load(){
      try {
        const p = await getProfile()
        setProfile(p.data)
      } catch {}
      const s = await listScrims()
      setScrims(s.data.slice(0,5))
      const t = await listTournaments()
      setTournaments(t.data.slice(0,5))
    }
    load()
  },[])
  async function onUpload(e){
    const file = e.target.files?.[0]
    if (!file) return
    const res = await updateProfileImage(file)
    setProfile(res.data)
  }
  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase italic-font-orbitron text-white leading-none">Command <span className="text-accent">Center</span></h1>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.4em] mt-2">Operational Overview • {profile?.user?.username || 'Guest'}</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition cursor-default">
            System Online
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Snapshot */}
        <Card className="relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pilot Profile</div>
              <div className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[8px] font-black uppercase tracking-tighter">Verified</div>
            </div>
            {profile ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border-2 border-white/10 overflow-hidden relative group-hover:border-accent/50 transition-all duration-500">
                    {profile.profile_image ? (
                        <img src={profile.profile_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-20 capitalize">{profile.user.username[0]}</div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white">Upload</span>
                    </label>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white italic truncate">{profile.user.username}</div>
                    <div className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{profile.rank || 'Unranked'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Combat Power</div>
                    <div className="text-lg font-black text-white tracking-tighter">4,820</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Win Rate</div>
                    <div className="text-lg font-black text-primary tracking-tighter">64.2%</div>
                  </div>
                </div>
              </div>
            ) : (
                <div className="py-10 text-center text-muted-foreground italic text-sm">Synchronizing pulse... logout and back in to see your desk.</div>
            )}
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
        </Card>

        {/* Live Feed / Scrims */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            <Card className="glass border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-white uppercase tracking-widest italic italic-font-orbitron">Upcoming Scrims</h3>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="space-y-3">
                {scrims.length > 0 ? scrims.map(s=>(
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition group cursor-default">
                    <div>
                      <div className="text-[10px] font-black text-white uppercase italic tracking-tight group-hover:text-primary">Guild {s.guild_a} <span className="text-muted-foreground italic normal-case px-1">vs</span> Guild {s.guild_b}</div>
                      <div className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter mt-0.5">{new Date(s.date).toLocaleDateString()} • {s.match_format}</div>
                    </div>
                    <div className="text-[8px] font-black px-1.5 py-0.5 rounded border border-white/10 text-muted-foreground uppercase tracking-tighter">Brief</div>
                  </div>
                )) : (
                    <div className="py-8 text-center text-muted-foreground text-[10px] uppercase font-bold tracking-widest">No active deployments found</div>
                )}
              </div>
            </Card>

            <Card className="border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
              <h3 className="text-xs font-black text-white uppercase tracking-widest italic mb-6 italic-font-orbitron">Active Campaigns</h3>
              <div className="grid grid-cols-1 gap-2">
                {tournaments.length > 0 ? tournaments.map(t=>(
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-accent/30 transition group cursor-default">
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-white uppercase italic truncate pr-4">{t.name}</div>
                      <div className="text-[8px] text-accent font-bold uppercase tracking-[0.2em] mt-0.5">{t.type} Tournament</div>
                    </div>
                    <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center text-[10px] group-hover:bg-accent/20 transition">🏆</div>
                  </div>
                )) : (
                    <div className="py-8 text-center text-muted-foreground text-[10px] uppercase font-bold tracking-widest italic">Hall of Champions stands empty</div>
                )}
              </div>
            </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
