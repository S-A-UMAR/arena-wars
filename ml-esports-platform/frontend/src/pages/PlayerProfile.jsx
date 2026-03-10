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
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-700" />
          <div>
            <div className="text-2xl">{username}</div>
            <div className="text-gray-400">Mobile Legends Player</div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-gray-400">Rank</div>
            <div className="text-xl">Legend</div>
          </div>
          <div>
            <div className="text-gray-400">Main Role</div>
            <div className="text-xl">Jungler</div>
          </div>
          <div>
            <div className="text-gray-400">Win Rate</div>
            <div className="text-xl">60%</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PlayerProfile
