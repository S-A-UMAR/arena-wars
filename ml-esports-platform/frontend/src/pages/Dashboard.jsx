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
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <div className="text-2xl neon-text mb-2">Profile</div>
        {profile ? (
          <div className="space-y-1">
            <div>{profile.user.username}</div>
            <div className="text-gray-400">{profile.rank}</div>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
                {profile.profile_image && <img src={profile.profile_image} alt="" className="w-full h-full object-cover" />}
              </div>
              <label className="px-3 py-2 rounded-md bg-gray-700 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                Upload Avatar
              </label>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">Login to view profile</div>
        )}
      </Card>
      <Card>
        <div className="text-2xl neon-text mb-2">Upcoming Scrims</div>
        <div className="space-y-2">
          {scrims.map(s=>(
            <div key={s.id} className="flex items-center justify-between">
              <div>Guild {s.guild_a} vs {s.guild_b}</div>
              <div className="text-gray-400">{new Date(s.date).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="md:col-span-2">
        <div className="text-2xl neon-text mb-2">Tournament Registrations</div>
        <div className="grid md:grid-cols-2 gap-2">
          {tournaments.map(t=>(
            <div key={t.id} className="flex items-center justify-between">
              <div>{t.name}</div>
              <div className="text-gray-400">{t.type}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
