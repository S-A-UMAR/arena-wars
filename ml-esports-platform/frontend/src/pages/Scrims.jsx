import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listScrims, createScrim, listChatMessages, createChatMessage } from '../services/api'

function Scrims() {
  const [scrims, setScrims] = useState([])
  const [guildA, setGuildA] = useState('')
  const [guildB, setGuildB] = useState('')
  const [format, setFormat] = useState('BO3')
  const [selectedScrim, setSelectedScrim] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  async function load() {
    const res = await listScrims()
    setScrims(res.data)
  }
  useEffect(()=>{ load() },[])
  async function loadChat(id){
    const res = await listChatMessages(id)
    setMessages(res.data)
  }
  async function create() {
    if (!guildA || !guildB) return
    const date = new Date().toISOString()
    await createScrim({ guild_a: Number(guildA), guild_b: Number(guildB), date, match_format: format })
    setGuildA('')
    setGuildB('')
    load()
  }
  async function send(){
    if (!selectedScrim || !text.trim()) return
    await createChatMessage({ scrim: selectedScrim, text })
    setText('')
    loadChat(selectedScrim)
  }
  return (
    <div className="space-y-6">
      <Card>
        <div className="grid md:grid-cols-4 gap-2">
          <input className="px-3 py-2 rounded bg-gray-700" placeholder="Guild A ID" value={guildA} onChange={e=>setGuildA(e.target.value)} />
          <input className="px-3 py-2 rounded bg-gray-700" placeholder="Guild B ID" value={guildB} onChange={e=>setGuildB(e.target.value)} />
          <select className="px-3 py-2 rounded bg-gray-700" value={format} onChange={e=>setFormat(e.target.value)}>
            <option value="BO1">BO1</option>
            <option value="BO3">BO3</option>
            <option value="BO5">BO5</option>
          </select>
          <button className="btn" onClick={create}>Request</button>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {scrims.map(s=>(
          <Card key={s.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl">Guild {s.guild_a} vs Guild {s.guild_b}</div>
                <div className="text-gray-400">{s.match_format} • {new Date(s.date).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded bg-gray-700">{s.status}</div>
                <button className="px-3 py-1 rounded bg-gray-700" onClick={()=>setSelectedScrim(s.id) || loadChat(s.id)}>Chat</button>
              </div>
            </div>
            {selectedScrim === s.id && (
              <div className="mt-4">
                <div className="h-40 overflow-y-auto space-y-2 bg-gray-800 p-2 rounded">
                  {messages.map(m=>(
                    <div key={m.id} className="text-gray-200">{m.text}</div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input className="flex-1 px-3 py-2 rounded bg-gray-700" value={text} onChange={e=>setText(e.target.value)} placeholder="Type message..." />
                  <button className="btn" onClick={send}>Send</button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Scrims
