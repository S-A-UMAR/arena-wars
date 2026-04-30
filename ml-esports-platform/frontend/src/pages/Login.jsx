import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { login, googleLogin } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import NeuralBackground from '../components/NeuralBackground'
import { useToast } from '../context/ToastContext'
import { signInWithGoogle } from '../firebase'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(username, password)
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      showToast("Neural Connection Established", "success")
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Neural mismatch: Credentials rejected by HQ')
      showToast("Access Denied", "error")
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
      showToast("Satellite Sync Successful", "success")
      window.location.href = '/dashboard'
    } catch (err) {
      showToast("Satellite Sync Failed", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 relative overflow-hidden bg-black">
      <NeuralBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <Card className="glass border-primary/20 p-12 rounded-[4rem] shadow-[0_0_50px_rgba(255,219,0,0.05)] relative overflow-hidden group">
          <div className="relative z-10">
            <header className="text-center mb-12">
               <motion.div 
                 animate={{ rotate: [0, 360] }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="inline-block w-20 h-20 rounded-[2.5rem] bg-primary/5 border border-primary/20 flex items-center justify-center text-4xl mb-6 shadow-2xl shadow-primary/10"
               >
                 📡
               </motion.div>
               <h2 className="text-5xl font-black italic uppercase italic-font-orbitron text-white tracking-tighter leading-none">Nexus <span className="text-primary">Auth</span></h2>
               <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.5em] mt-4 opacity-60 italic">Synchronize with Global Operations</p>
            </header>

            <form onSubmit={submit} className="space-y-8">
              <div className="space-y-6">
                <div className="group space-y-2">
                  <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-2 group-focus-within:text-primary transition-colors">Pilot Identity</label>
                  <input 
                    className="w-full px-8 py-5 rounded-[2rem] bg-white/[0.02] border border-white/5 focus:border-primary/50 outline-none transition-all text-white shadow-inner placeholder:opacity-10" 
                    placeholder="ArenaWarrior_01" 
                    value={username} 
                    onChange={e=>setUsername(e.target.value)} 
                    required
                  />
                </div>
                <div className="group space-y-2">
                  <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-2 group-focus-within:text-primary transition-colors">Neural Key</label>
                  <input 
                    type="password" 
                    className="w-full px-8 py-5 rounded-[2rem] bg-white/[0.02] border border-white/5 focus:border-primary/50 outline-none transition-all text-white shadow-inner placeholder:opacity-10" 
                    placeholder="••••••••••••" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    required
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4 pt-4">
                 <button 
                   disabled={loading}
                   className="btn w-full py-5 text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/10 relative overflow-hidden group"
                   type="submit"
                 >
                   <span className="relative z-10 group-hover:tracking-[0.6em] transition-all">
                     {loading ? 'Sychronizing...' : 'Initialize Sync'}
                   </span>
                   <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                 </button>

                 <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic opacity-40">Or Satellite Auth</span>
                    <div className="h-px flex-1 bg-white/5" />
                 </div>

                 <button 
                   type="button"
                   onClick={handleGoogleLogin}
                   className="w-full py-4 rounded-[2rem] border border-white/10 bg-white/[0.01] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all group"
                 >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
                    Sign in with Google
                 </button>
              </div>
            </form>

            <div className="mt-12 text-center">
              <button onClick={() => navigate('/register')} className="text-[9px] font-black uppercase text-muted-foreground hover:text-white transition tracking-[0.2em] group">
                New Pilot detected? <span className="text-primary underline group-hover:no-underline">Found Account</span>
              </button>
            </div>
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-0 opacity-40" />
        </Card>
      </motion.div>
    </div>
  )
}

export default Login
