import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { login } from '../services/api'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await login(username, password)
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full glass border-accent/20 p-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black italic uppercase italic-font-orbitron text-white tracking-widest leading-none mb-2">Nexus <span className="text-accent">Auth</span></h2>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.3em]">Reconnect to the Arena</p>
          </div>
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Username</label>
                <input className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-accent outline-none transition text-white" placeholder="ArenaWarrior" value={username} onChange={e=>setUsername(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1">Password</label>
                <input type="password" className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-accent outline-none transition text-white" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
            </div>
            {error && <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</div>}
            <button className="btn w-full py-4 shadow-xl shadow-accent/10 border-accent/50 group" type="submit">
              <span className="group-hover:tracking-[0.2em] transition-all">Sychronize Profile</span>
            </button>
          </form>
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/register')} className="text-[10px] font-bold uppercase text-muted-foreground hover:text-white transition tracking-widest">
              Need new credentials? <span className="text-accent underline">Found Account</span>
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-0" />
      </Card>
    </div>
  )
}

export default Login
