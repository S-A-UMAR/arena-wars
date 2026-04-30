import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { createGuild } from '../services/api'

function GuildCreate() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [country, setCountry] = useState('')
  const [joinPolicy, setJoinPolicy] = useState('Open')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (!name || !tag) return
    setLoading(true)
    try {
      const res = await createGuild({
        name,
        tag,
        country,
        join_policy: joinPolicy,
        description
      })
      // Success: Redirect to Command Center (Page 3)
      navigate(`/guilds/${res.data.id}`)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || "Formation failed. Name or Tag might be taken.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black italic uppercase italic-font-orbitron text-white">Creation <span className="text-primary">Studio</span></h1>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.4em] mt-2">Engineer your brotherhood's DNA</p>
      </header>

      <Card className="glass border-white/5 p-8 relative overflow-hidden">
        <form onSubmit={onSubmit} className="space-y-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Guild Name</label>
              <input 
                className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm" 
                placeholder="e.g. Shadow Syndicate" 
                value={name} 
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Guild Tag (3-4 Chars)</label>
              <input 
                className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm" 
                placeholder="e.g. SHDW" 
                value={tag} 
                onChange={e => setTag(e.target.value)}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Region / Country</label>
              <input 
                className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm" 
                placeholder="e.g. Philippines" 
                value={country} 
                onChange={e => setCountry(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Join Policy</label>
              <select 
                className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm appearance-none" 
                value={joinPolicy} 
                onChange={e => setJoinPolicy(e.target.value)}
              >
                <option value="Open">Open (Anyone can join)</option>
                <option value="Request">Request Only (Leader must approve)</option>
                <option value="Password">Password Protected</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Guild Manifesto (Description)</label>
            <textarea 
              className="w-full px-5 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-primary outline-none transition text-white text-sm h-32 resize-none" 
              placeholder="State your purpose..." 
              value={description} 
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className={`btn w-full py-4 text-center mt-4 shadow-xl shadow-primary/20 ${loading ? 'opacity-50 cursor-wait' : ''}`}
            disabled={loading}
          >
            {loading ? 'Initializing Core...' : 'Forge Guild'}
          </button>
        </form>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </Card>
    </div>
  )
}

export default GuildCreate
