import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { getProfile, listGuilds, listMatches } from '../services/api' 
import { motion, AnimatePresence } from 'framer-motion'

function GuildDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [guild, setGuild] = useState(null)
  const [profile, setProfile] = useState(null)
  const [members, setMembers] = useState([])
  const [applications, setApplications] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const gRes = await listGuilds()
      const g = gRes.data.find(x => x.id === Number(id))
      setGuild(g)
      
      const pRes = await getProfile()
      setProfile(pRes.data)

      // Mocking detailed member data for roster with In-Game IDs
      setMembers([
        { id: 1, username: 'LeaderX', ml_id: '982741(2039)', role: 'Leader', status: 'Online' },
        { id: 2, username: 'SgtDoom', ml_id: '124152(1002)', role: 'Officer', status: 'In-Match' },
        { id: 3, username: 'PilotZ', ml_id: '887211(5021)', role: 'Member', status: 'Offline' }
      ])

      // Mocking match history
      const mRes = await listMatches()
      setHistory(mRes.data.slice(0, 5))

      if (g?.owner?.id === pRes.data.user.id) {
        // Mocking pending applications
        setApplications([
          { id: 101, user: { username: 'Striker99', ml_id: '772152(1102)' }, message: 'I am a Mythical Immortal jungler.', status: 'pending' }
        ])
      }
    } catch (err) { 
      console.error(err) 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  if (loading) return <div className="text-center py-32 text-muted-foreground animate-pulse font-black uppercase tracking-[0.5em] italic">Accessing Command Center...</div>
  if (!guild) return <div className="text-center py-32 text-red-500 font-bold uppercase italic">Guild Data Corrupted or Not Found</div>

  const isOwner = guild.owner?.id === profile?.user?.id
  const isMember = members.some(m => m.username === profile?.user?.username)

  const copyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/guilds/${id}`)
    alert("Tactical Invite Link copied to clipboard!")
  }

  return (
    <div className="space-y-10 pb-20 px-2 md:px-0">
      <header className="relative py-12 md:py-16 px-6 md:px-10 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden glass border border-white/5 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] md:rounded-[2.5rem] bg-white/5 border-2 border-white/10 flex items-center justify-center text-5xl md:text-6xl shadow-2xl relative overflow-hidden group">
             {guild.logo ? <img src={guild.logo} alt="" className="w-full h-full object-cover" /> : '🛡️'}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
          </div>
          <div className="text-center md:text-left flex-1 space-y-4">
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
               <h1 className="text-3xl md:text-5xl font-black uppercase italic italic-font-orbitron text-white leading-tight">{guild.name}</h1>
               <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/30">LVL {guild.level}</span>
               <span className="text-sm font-black text-accent uppercase tracking-widest">[{guild.tag}]</span>
             </div>
             <p className="text-gray-400 text-xs md:text-sm max-w-xl leading-relaxed italic opacity-80">"{guild.description || "In shadows we dominate. In light we conquer."}"</p>
             
             <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Global Rank</span>
                      <span className="text-sm font-black text-white italic">#{guild.rank || '482'}</span>
                   </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Deployment</span>
                      <span className="text-sm font-black text-gray-300 italic">{guild.country || 'Global'}</span>
                   </div>
                </div>
             </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
             {isOwner ? (
               <button onClick={copyInvite} className="btn py-4 px-8 shadow-lg shadow-primary/20">Generate Invite Link</button>
             ) : isMember ? (
               <button className="btn-secondary py-3 px-8 text-red-500 border-red-500/30 hover:bg-red-500/10">Abandon Guild</button>
             ) : (
               <button className="btn py-4 px-10">Request Admission</button>
             )}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Column: Roster & Management */}
        <div className="lg:col-span-8 space-y-10">
           <section>
              <div className="flex justify-between items-end mb-6">
                 <div>
                    <h2 className="text-2xl font-black text-white italic uppercase italic-font-orbitron">Active <span className="text-primary">Roster</span></h2>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] mt-1">Combat Personnel & Station ID</p>
                 </div>
                 <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">{members.length} / {guild.max_slots} CAPACITY</div>
              </div>
              <div className="space-y-3">
                 {members.map(member => (
                   <Card key={member.id} className="p-4 border-white/5 group hover:border-primary/20 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div className="flex items-center gap-4">
                            <div className="relative">
                               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner group-hover:bg-primary/5 transition">
                                  {member.username[0]}
                               </div>
                               <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-background ${member.status === 'Online' ? 'bg-green-500' : member.status === 'In-Match' ? 'bg-primary' : 'bg-gray-500'}`} />
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <span className="text-sm font-black text-white uppercase italic">{member.username}</span>
                                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${member.role === 'Leader' ? 'border-accent text-accent bg-accent/5' : 'border-white/10 text-muted-foreground'}`}>{member.role}</span>
                               </div>
                               <div className="text-[10px] text-muted-foreground font-bold font-mono mt-0.5 uppercase tracking-tighter opacity-60">ID: {member.ml_id}</div>
                            </div>
                         </div>
                         
                         {isOwner && member.id !== profile.user.id && (
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase hover:bg-primary/10 hover:border-primary/30 transition">Promote</button>
                              <button className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-[9px] font-black text-red-500 uppercase hover:bg-red-500/20 transition">Kick</button>
                           </div>
                         )}
                         
                         <div className="md:text-right">
                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Status</div>
                            <div className={`text-[10px] font-black italic uppercase tracking-wider ${member.status === 'Online' ? 'text-green-500' : member.status === 'In-Match' ? 'text-primary' : 'text-gray-500'}`}>{member.status}</div>
                         </div>
                      </div>
                   </Card>
                 ))}
              </div>
           </section>

           <section>
              <h2 className="text-2xl font-black text-white italic uppercase italic-font-orbitron mb-6">Combat <span className="text-accent">History</span></h2>
              <div className="space-y-4">
                 {history.length > 0 ? history.map(match => (
                   <div key={match.id} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/[0.08] transition">
                      <div className="flex items-center gap-6 text-center md:text-left">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Result</span>
                            <span className="text-xl font-black text-green-500 italic uppercase">Victory</span>
                         </div>
                         <div className="w-px h-10 bg-white/10 hidden md:block" />
                         <div>
                            <div className="text-xs font-black text-white uppercase italic tracking-tight">{match.tournament_name || 'Daily Scrim'}</div>
                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">vs {match.opponent || 'Ghost Clan'} • {new Date(match.match_date).toLocaleDateString()}</div>
                         </div>
                      </div>
                      <Link to={`/matches/${match.id}`} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase hover:bg-white/10 transition">Intelligence Report</Link>
                   </div>
                 )) : (
                   <div className="py-20 text-center glass rounded-[2.5rem] border border-white/5">
                      <p className="text-muted-foreground uppercase tracking-[0.3em] font-bold text-xs">Awaiting First Engagement...</p>
                   </div>
                 )}
              </div>
           </section>
        </div>

        {/* Right Column: Applications & Intel */}
        <div className="lg:col-span-4 space-y-10">
           {isOwner && applications.length > 0 && (
             <section className="animate-in fade-in slide-in-from-right-10 duration-1000">
                <div className="flex items-center gap-2 mb-6">
                   <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Pending Admissions</h3>
                   <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                </div>
                <div className="space-y-4">
                   {applications.map(app => (
                     <Card key={app.id} className="p-6 border-accent/30 bg-accent/5 relative overflow-hidden">
                        <div className="relative z-10">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/50 flex items-center justify-center text-xs font-black text-accent">{app.user.username[0]}</div>
                              <div>
                                 <div className="text-xs font-bold text-white uppercase italic">{app.user.username}</div>
                                 <div className="text-[8px] text-muted-foreground font-mono mt-0.5">ID: {app.user.ml_id}</div>
                              </div>
                           </div>
                           <p className="text-[10px] text-gray-300 mb-6 italic leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">"{app.message}"</p>
                           <div className="flex gap-2">
                              <button className="flex-1 py-2.5 rounded-xl bg-accent text-[10px] font-black uppercase text-background hover:scale-105 active:scale-95 transition">Approve</button>
                              <button className="flex-1 py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase text-white hover:bg-white/10 transition">Decline</button>
                           </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-0" />
                     </Card>
                   ))}
                </div>
             </section>
           )}

           <section>
              <h3 className="text-xs font-black text-white uppercase tracking-widest italic mb-6">Tactical Overview</h3>
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">Win Rate</span>
                       <span className="text-sm font-black text-primary">74.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">Total Scrims</span>
                       <span className="text-sm font-black text-white">128</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">MVP Awards</span>
                       <span className="text-sm font-black text-accent">24</span>
                    </div>
                 </div>
                 <div className="p-4 rounded-2xl border-2 border-dashed border-white/5 text-center py-10 opacity-40">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">More Stats Coming Soon</span>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  )
}

export default GuildDetail
