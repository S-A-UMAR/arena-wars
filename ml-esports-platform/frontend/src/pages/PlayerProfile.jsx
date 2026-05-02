import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import { getProfile, listMatches } from '../services/api'
import { useToast } from '../context/ToastContext'
import html2canvas from 'html2canvas'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { ProfileSkeleton } from '../components/Skeleton'

function PlayerProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [matches, setMatches] = useState([])
  const [activeTab, setActiveTab] = useState('record')
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const { showToast } = useToast()
  
  const cardRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await getProfile(id)
        setProfile(res.data)
        const mRes = await listMatches() 
        setMatches(mRes.data)
      } catch (err) {
        showToast("Signal Lost: Intelligence folder unavailable", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const exportCard = async () => {
    if (!cardRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `ArenaWars_${profile?.user?.username || 'Player'}_Card.png`
      link.href = dataUrl
      link.click()
      showToast("Player Card exported successfully!", "success")
    } catch (error) {
      showToast("Failed to export Player Card", "error")
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) return <ProfileSkeleton />

  return (
    <div className="space-y-16 pb-32">
      {/* Exportable Player Card Section */}
      <div className="flex flex-col items-center gap-8 relative py-10">
        
        {/* The Card to be screenshotted */}
        <div 
           ref={cardRef} 
           className="relative w-[340px] h-[480px] bg-gradient-to-br from-black via-[#111] to-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col p-6"
           style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
           }}
        >
           {/* Card Overlay & Styling */}
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></div>
           
           {/* Card Content */}
           <div className="relative z-10 flex-1 flex flex-col items-center justify-between">
              <div className="w-full flex justify-between items-start">
                 <div className="text-center">
                    <div className="text-3xl font-black italic text-white leading-none">{profile?.mythic_points || '99'}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-primary">OVR</div>
                 </div>
                 <div className="text-center">
                    <div className="text-sm font-black italic uppercase text-muted-foreground">{profile?.preferred_lane || 'JUNGLER'}</div>
                 </div>
              </div>

              <div className="flex-1 flex items-center justify-center py-4">
                 {profile?.profile_image ? (
                    <img src={profile.profile_image} className="w-32 h-32 rounded-full border-4 border-primary/50 object-cover shadow-[0_0_30px_rgba(255,219,0,0.3)]" />
                 ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-primary/50 bg-primary/10 flex items-center justify-center text-5xl font-black text-primary shadow-[0_0_30px_rgba(255,219,0,0.3)]">
                       {profile?.user?.username?.charAt(0).toUpperCase()}
                    </div>
                 )}
              </div>

              <div className="w-full text-center space-y-4">
                 <div>
                    <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">{profile?.user?.username}</h2>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">{profile?.guild_name || 'Free Agent'}</div>
                 </div>
                 
                 <div className="w-full h-px bg-white/20"></div>
                 
                 <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground">KDA</span>
                          <span className="text-sm font-black text-white italic">7.2</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground">WR</span>
                          <span className="text-sm font-black text-white italic">{profile?.win_rate || '65.4'}%</span>
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground">GPM</span>
                          <span className="text-sm font-black text-white italic">780</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground">MVP</span>
                          <span className="text-sm font-black text-white italic">14</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 pt-2">
                    ArenaWars.cc
                 </div>
              </div>
           </div>
        </div>

        {/* Export Button */}
        <button 
           onClick={exportCard}
           disabled={isExporting}
           className="btn-primary px-8 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,219,0,0.4)] disabled:opacity-50"
        >
           {isExporting ? (
              <>
                 <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                 Processing Intel...
              </>
           ) : (
              <>
                 📸 Download Player Card
              </>
           )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 border-b border-white/5 pb-8">
         {[
           { id: 'record', label: 'Service Record' },
           { id: 'tactical', label: 'Tactical Stats' },
           { id: 'achievements', label: 'Achievements' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic transition-all duration-300 ${activeTab === tab.id ? 'bg-primary text-background shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
           >
              {tab.label}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid lg:grid-cols-2 gap-10"
        >
          {activeTab === 'record' && (
             <div className="lg:col-span-2 space-y-12">
                <section className="space-y-8">
                   <h2 className="text-xs font-black text-white uppercase tracking-[0.4em] italic px-4">Recent Engagements</h2>
                   <div className="grid md:grid-cols-2 gap-6">
                      {matches.slice(0, 6).map(m => (
                        <Card key={m.id} className="p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${m.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                                    {m.status === 'completed' ? '⚔️' : '⏱️'}
                                 </div>
                                 <div>
                                    <div className="text-sm font-black text-white uppercase italic">{m.guild_a_name} vs {m.guild_b_name || 'TBD'}</div>
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{m.tournament_name || 'Scrimmage'}</div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-lg font-black text-primary italic">{m.score_a}-{m.score_b}</div>
                              </div>
                           </div>
                        </Card>
                      ))}
                   </div>
                </section>
             </div>
          )}

          {activeTab === 'tactical' && (
             <>
                <Card className="p-10 border-white/5 bg-white/[0.01] rounded-[3rem] lg:col-span-2">
                   <h3 className="text-xs font-black text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Tactical Radar Analysis</h3>
                   <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div className="h-[400px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                              { subject: 'Aggression', A: 85, fullMark: 100 },
                              { subject: 'Tactics', A: 90, fullMark: 100 },
                              { subject: 'Economy', A: 75, fullMark: 100 },
                              { subject: 'Survivability', A: 60, fullMark: 100 },
                              { subject: 'Objective', A: 80, fullMark: 100 },
                            ]}>
                               <PolarGrid stroke="rgba(255,255,255,0.1)" />
                               <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffdb00', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }} />
                               <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                               <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,219,0,0.3)', borderRadius: '12px' }} itemStyle={{ color: '#ffdb00', fontWeight: 'bold' }} />
                               <Radar name="Pilot Score" dataKey="A" stroke="#ffdb00" fill="#ffdb00" fillOpacity={0.4} />
                            </RadarChart>
                         </ResponsiveContainer>
                      </div>
                      
                      <div className="space-y-6">
                         {[
                           { label: 'Avg Kill Participation', val: '72%' },
                           { label: 'Gold Per Minute', val: '680' },
                           { label: 'Tower Damage', val: '4,200' },
                           { label: 'MVP Frequency', val: '14%' }
                         ].map(s => (
                           <div key={s.label} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{s.label}</span>
                              <span className="text-sm font-black text-white italic">{s.val}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </Card>
             </>
          )}

          {activeTab === 'achievements' && (
             <div className="lg:col-span-2">
                <Card className="p-20 text-center space-y-6 opacity-40 border-dashed border-white/10 rounded-[4rem]">
                   <div className="text-5xl">🏆</div>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">Awaiting high-priority accolades.</p>
                </Card>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default PlayerProfile
