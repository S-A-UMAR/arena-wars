import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { login, googleLogin } from '../services/api'
import { motion } from 'framer-motion'
import NeuralBackground from '../components/NeuralBackground'
import { useToast } from '../context/ToastContext'
import { signInWithGoogle } from '../firebase'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(username, password)
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      showToast("Access Granted", "success")
      window.location.href = '/dashboard'
    } catch (err) {
      showToast("Invalid Credentials", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { token } = await signInWithGoogle()
      const res = await googleLogin(token)
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      showToast("Google Sync Successful", "success")
      window.location.href = '/dashboard'
    } catch (err) {
      showToast("Google Login Failed", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative bg-black">
      <NeuralBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <Card className="glass p-10 border-white/5 rounded-[3rem] shadow-2xl">
          <header className="text-center mb-10">
            <div className="text-primary text-4xl mb-4">🛡️</div>
            <h1 className="text-3xl font-black italic uppercase italic-font-orbitron text-white">Secure <span className="text-primary">Uplink</span></h1>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-2">Enter credentials to synchronize</p>
          </header>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
              <input 
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition" 
                placeholder="Username" 
                value={username} 
                onChange={e=>setUsername(e.target.value)} 
                required
              />
              <input 
                type="password" 
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition" 
                placeholder="Password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                required
              />
            </div>

            <button 
              disabled={loading}
              className="btn w-full py-4 text-xs font-black uppercase tracking-widest"
              type="submit"
            >
              {loading ? 'Processing...' : 'Authorize Login'}
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" />
              Continue with Google
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/register')} className="text-[10px] font-bold text-muted-foreground hover:text-white transition uppercase tracking-widest">
              No account? <span className="text-primary underline">Join the Arena</span>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login
