import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listTournaments, createTournament, registerGuildToTournament, generateBracket, listMatchesByTournament, uploadReplay } from '../services/api'

function Tournament() {
  const [tournaments, setTournaments] = useState([])
  const [name, setName] = useState('')
  const [type, setType] = useState('single')
  const [streamUrl, setStreamUrl] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [matches, setMatches] = useState([])
  async function load() {
    const res = await listTournaments()
    setTournaments(res.data)
  }
  useEffect(()=>{ load() },[])
  async function create() {
    if (!name) return
    const start_date = new Date().toISOString()
    await createTournament({ name, type, start_date, stream_url: streamUrl })
    setName('')
    setStreamUrl('')
    load()
  }
  async function loadMatches(id){
    const res = await listMatchesByTournament(id)
    setMatches(res.data)
  }
  async function gen(id){
    await generateBracket(id)
    loadMatches(id)
  }
  async function onReplayChange(id, e){
    const file = e.target.files?.[0]
    if (!file) return
    await uploadReplay(id, file)
    if (selectedId) loadMatches(selectedId)
  }
  return (
    <div className="space-y-6">
      <Card>
        <div className="grid md:grid-cols-4 gap-2">
          <input className="px-3 py-2 rounded bg-gray-700" placeholder="Tournament name" value={name} onChange={e=>setName(e.target.value)} />
          <select className="px-3 py-2 rounded bg-gray-700" value={type} onChange={e=>setType(e.target.value)}>
            <option value="single">Single Elimination</option>
            <option value="double">Double Elimination</option>
          </select>
          <input className="px-3 py-2 rounded bg-gray-700" placeholder="Stream URL (optional)" value={streamUrl} onChange={e=>setStreamUrl(e.target.value)} />
          <button className="btn" onClick={create}>Create</button>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {tournaments.map(t=>(
          <Card key={t.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl neon-text">{t.name}</div>
                <div className="text-gray-400">{t.type} elimination</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-md bg-gray-700" onClick={()=>setSelectedId(t.id) || loadMatches(t.id)}>View</button>
                <button className="btn" onClick={()=>registerGuildToTournament(t.id, 1)}>Register Guild #1</button>
              </div>
            </div>
            {selectedId === t.id && (
              <div className="mt-4 space-y-3">
                {t.stream_url && (
                  <div className="aspect-video bg-black rounded overflow-hidden">
                    <iframe src={t.stream_url} title="Stream" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="text-neon-blue">Bracket</div>
                  <div className="flex gap-2">
                    <button className="btn" onClick={()=>gen(t.id)}>Generate</button>
                    <button className="px-3 py-2 rounded-md bg-gray-700" onClick={()=>loadMatches(t.id)}>Refresh</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {matches.map(m=>(
                    <div key={m.id} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded">
                      <div>
                        <div className="text-gray-300">Round {m.round} {m.bracket === 'W' ? '• Winners' : (m.bracket === 'L' ? '• Losers' : '')}</div>
                        <div className="text-lg">Guild {m.guild_a} vs Guild {m.guild_b}</div>
                      </div>
                      <label className="px-3 py-1 rounded bg-gray-700 cursor-pointer">
                        <input type="file" className="hidden" onChange={(e)=>onReplayChange(m.id, e)} />
                        Upload Replay
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Tournament
