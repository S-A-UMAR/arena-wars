import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listGuilds, createGuild, joinGuild, leaveGuild } from '../services/api'

function Guild() {
  const [guilds, setGuilds] = useState([])
  const [name, setName] = useState('')
  const [hook, setHook] = useState('')
  async function load() {
    const res = await listGuilds()
    setGuilds(res.data)
  }
  useEffect(()=>{ load() },[])
  async function create() {
    if (!name) return
    await createGuild({ name, discord_webhook_url: hook })
    setName('')
    setHook('')
    load()
  }
  return (
    <div className="space-y-6">
      <Card>
        <div className="grid md:grid-cols-3 gap-2">
          <input className="flex-1 px-3 py-2 rounded bg-gray-700" placeholder="Guild name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="flex-1 px-3 py-2 rounded bg-gray-700" placeholder="Discord webhook URL (optional)" value={hook} onChange={e=>setHook(e.target.value)} />
          <button className="btn" onClick={create}>Create</button>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {guilds.map(g=>(
          <Card key={g.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl neon-text">{g.name}</div>
                <div className="text-gray-400">Rank {g.rank}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=>joinGuild(g.id)}>Join</button>
                <button className="px-4 py-2 rounded-md bg-gray-700" onClick={()=>leaveGuild(g.id)}>Leave</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Guild
