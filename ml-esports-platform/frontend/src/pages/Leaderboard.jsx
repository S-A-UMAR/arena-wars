import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listLeaderboard } from '../services/api'

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
    <div className="space-y-6">
      <Card>
        <div className="text-2xl neon-text">Top Rankings</div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {entries.map(e=>(
          <Card key={e.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl">{e.name}</div>
                <div className="text-gray-400">{e.entity_type}</div>
              </div>
              <div className="text-neon-blue">Score {e.score}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard
