import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import api, { searchAll } from '../services/api'

function PlayerProfile() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  useEffect(()=>{
    async function load(){
      const res = await searchAll(username)
      const found = res.data.players.find(p=>p.username===username)
      setUser(found || null)
    }
    load()
  },[username])
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-8 pb-20">
      {/* Header Profile Section */}
      <div className="relative h-64 rounded-3xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="relative h-full flex items-end p-8 gap-8">
          <div className="w-32 h-32 rounded-3xl bg-white/10 ring-4 ring-white/10 group overflow-hidden shadow-2xl relative">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-white/20 font-bold uppercase">
                {username?.[0]}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
              <span className="text-xs font-bold uppercase tracking-widest text-white">Edit</span>
            </div>
          </div>
          <div className="mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-1 uppercase italic italic-font-orbitron">{username}</h1>
            <p className="text-accent font-semibold tracking-widest text-xs uppercase">Elite Rank Challenger • {user?.country || 'Region'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b border-white/5 pb-1">
        {['overview', 'career', 'heroes', 'guild'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'text-white border-b-2 border-accent' : 'text-muted-foreground hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Win Rate', value: '64.2%', color: 'text-accent' },
                  { label: 'Matches', value: '2,482', color: 'text-white' },
                  { label: 'KDA', value: '4.8', color: 'text-primary' },
                  { label: 'MVP Rate', value: '18%', color: 'text-white' },
                ].map(stat => (
                  <Card key={stat.label} className="text-center py-8">
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-tighter">{stat.label}</div>
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  </Card>
                ))}
              </div>

              <Card className="p-8 relative overflow-hidden">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2 uppercase tracking-tighter italic">
                  <span className="w-1.5 h-6 bg-accent rounded-full" />
                  Recent Performance
                </h3>
                <div className="h-48 flex items-end gap-2 px-2">
                  {[40, 70, 45, 90, 65, 85, 30, 95, 60, 75].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-accent/20 rounded-t-lg transition-all duration-500 hover:bg-accent/40" 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  <span>Newest</span>
                  <span>Oldest (Last 10 Games)</span>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'heroes' && (
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Gusion', matches: 450, wr: '68%', role: 'Assassin' },
                { name: 'Lancelot', matches: 380, wr: '72%', role: 'Assassin' },
                { name: 'Ling', matches: 310, wr: '59%', role: 'Assassin' },
                { name: 'Fanny', matches: 290, wr: '64%', role: 'Assassin' },
              ].map(hero => (
                <Card key={hero.name} className="flex items-center gap-4 p-4 border border-white/5 hover:bg-white/5 transition group">
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:bg-accent/10 transition group-hover:scale-110">👤</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white uppercase italic">{hero.name}</h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/10 text-accent">{hero.wr} WR</span>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">{hero.role} • {hero.matches} Games</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Bio & Guild Info */}
        <div className="space-y-8">
          <Card className="glass relative overflow-hidden">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Tactical Bio</h3>
            <p className="text-sm leading-relaxed text-gray-300 italic font-medium">
              "{user?.bio || 'No strategic overview provided for this player. Focused on high-tier jungle orchestration and early game domination.'}"
            </p>
          </Card>

          <Card className="border border-primary/20 bg-primary/5">
             <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Current Guild</div>
             <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl">🛡️</div>
                <div>
                  <div className="font-bold text-white group-hover:text-accent transition uppercase tracking-tighter">ELITE VANGUARD</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Main Roster • Jungler</div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PlayerProfile
