import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { register } from '../services/api'

function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'', country:'', ml_player_id:'' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  function setField(k,v){ setForm(prev=>({ ...prev, [k]: v })) }
  async function submit(e){
    e.preventDefault()
    setError('')
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      setError('Registration failed')
    }
  }
  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-lg w-full glass border-primary/20 p-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black italic uppercase italic-font-orbitron text-white tracking-widest leading-none mb-2">Citizen <span className="text-primary">Registry</span></h2>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.3em]">Join the Elite Ranks</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Username</label>
                <input className="w-full px-4 py-2 text-sm rounded-xl bg-black/30 border border-white/10 focus:border-primary outline-none transition text-white" placeholder="ArenaWarrior" value={form.username} onChange={e=>setField('username', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Email</label>
                <input className="w-full px-4 py-2 text-sm rounded-xl bg-black/30 border border-white/10 focus:border-primary outline-none transition text-white" placeholder="warrior@arena.com" value={form.email} onChange={e=>setField('email', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Secure Password</label>
                <input type="password" className="w-full px-4 py-2 text-sm rounded-xl bg-black/30 border border-white/10 focus:border-primary outline-none transition text-white" placeholder="••••••••" value={form.password} onChange={e=>setField('password', e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Region / Country</label>
                <input className="w-full px-4 py-2 text-sm rounded-xl bg-black/30 border border-white/10 focus:border-primary outline-none transition text-white" placeholder="Philippines" value={form.country} onChange={e=>setField('country', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">ML Player ID</label>
                <input className="w-full px-4 py-2 text-sm rounded-xl bg-black/30 border border-white/10 focus:border-primary outline-none transition text-white" placeholder="12345678" value={form.ml_player_id} onChange={e=>setField('ml_player_id', e.target.value)} />
              </div>
            </div>
            {error && <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</div>}
            <button className="btn w-full py-4 shadow-xl shadow-primary/10 border-primary/50 group mt-4 bg-primary hover:bg-primary-hover" type="submit">
              <span className="group-hover:tracking-[0.2em] transition-all">Initialize Account</span>
            </button>
          </form>
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/login')} className="text-[10px] font-bold uppercase text-muted-foreground hover:text-white transition tracking-widest">
              Already a citizen? <span className="text-primary underline">Verify Credentials</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-0" />
      </Card>
    </div>
  )
}

export default Register
