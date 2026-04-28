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
  // Group matches by round
  const matchesByRound = matches.reduce((acc, m) => {
    if (!acc[m.round]) acc[m.round] = []
    acc[m.round].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-10 pb-20">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Active Tournaments</h1>
          <button className="btn" onClick={() => document.getElementById('createTournament')?.scrollIntoView({behavior:'smooth'})}>
            + Create New
          </button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {tournaments.map(t => (
            <Card key={t.id} className={`relative overflow-hidden ${selectedId === t.id ? 'border-accent/50' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">{t.type} Elimination</div>
                  <h2 className="text-2xl font-bold mb-2">{t.name}</h2>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>📅 Starts: {new Date(t.start_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${selectedId === t.id ? 'bg-accent text-background' : 'bg-white/5 hover:bg-white/10'}`} 
                    onClick={() => setSelectedId(t.id) || loadMatches(t.id)}
                  >
                    Manage Bracket
                  </button>
                  <button className="btn-secondary text-sm" onClick={() => registerGuildToTournament(t.id, 1)}>
                    Register
                  </button>
                </div>
              </div>
              
              {selectedId === t.id && (
                <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  {t.stream_url && (
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                      <iframe 
                        src={t.stream_url.replace('watch?v=', 'embed/')} 
                        title="Stream" 
                        className="w-full h-full" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      />
                    </div>
                  )}

                  <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        Live Bracket
                      </h3>
                      <div className="flex gap-2">
                        <button className="text-xs px-3 py-1.5 rounded-lg border border-accent/20 text-accent hover:bg-accent/10 transition" onClick={() => gen(t.id)}>
                          Reset/Generate
                        </button>
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition" onClick={() => loadMatches(t.id)}>
                          Refresh
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-8 overflow-x-auto pb-6 custom-scrollbar">
                      {Object.keys(matchesByRound).sort((a,b)=>a-b).map(round => (
                        <div key={round} className="flex-shrink-0 w-64 space-y-6">
                          <div className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Round {round}</div>
                          {matchesByRound[round].map(m => (
                            <div key={m.id} className="relative group">
                              <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10">
                                <div className="space-y-3 font-medium text-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Guild {m.guild_a || 'TBD'}</span>
                                    <span className="text-accent">{m.score_a || 0}</span>
                                  </div>
                                  <div className="h-px bg-white/5" />
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Guild {m.guild_b || 'TBD'}</span>
                                    <span className="text-accent">{m.score_b || 0}</span>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-between items-center gap-2 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <label className="text-[10px] uppercase font-bold text-accent cursor-pointer hover:underline">
                                    <input type="file" className="hidden" onChange={(e) => onReplayChange(m.id, e)} />
                                    Upload Replay
                                  </label>
                                  {m.replay_file && (
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Replay ✓</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                      {Object.keys(matchesByRound).length === 0 && (
                        <div className="w-full py-12 text-center text-muted-foreground italic">No bracket matches generated yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section id="createTournament" className="max-w-4xl mx-auto pt-10">
        <Card className="glass border-accent/20">
          <h2 className="text-2xl font-bold mb-6">Host New Tournament</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Tournament Name</label>
              <input 
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition" 
                placeholder="Region Finals S1..." 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Format</label>
              <select 
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition" 
                value={type} 
                onChange={e => setType(e.target.value)}
              >
                <option value="single">Single Elim</option>
                <option value="double">Double Elim</option>
              </select>
            </div>
            <div className="lg:col-span-3 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">YouTube/Twitch Stream URL</label>
              <input 
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition" 
                placeholder="https://youtube.com/..." 
                value={streamUrl} 
                onChange={e => setStreamUrl(e.target.value)} 
              />
            </div>
            <div className="flex items-end">
              <button className="btn w-full h-[46px]" onClick={create}>Launch Arena</button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default Tournament
