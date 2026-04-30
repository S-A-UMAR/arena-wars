import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { register, googleLogin } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import NeuralBackground from '../components/NeuralBackground'
import { useToast } from '../context/ToastContext'
import { signInWithGoogle } from '../firebase'

function Register() {
  const [step, setStep] = useState(1) // 1: Info, 2: Verification
  const [form, setForm] = useState({ username:'', email:'', password:'', country:'', ml_player_id:'' })
  const [vCode, setVCode] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  function setField(k,v){ setForm(prev=>({ ...prev, [k]: v })) }

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      showToast("Access Code Sent to Email", "info")
      setStep(2)
    } catch (err) {
      showToast("Registration Failed", "error")
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

  const verifyCode = (e) => {
    e.preventDefault()
    if (vCode.length === 6) {
      showToast("Identity Verified", "success")
      window.location.href = '/dashboard'
    } else {
      showToast("Invalid Access Code", "error")
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative bg-black">
      <NeuralBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        <Card className="glass p-10 border-white/5 rounded-[3rem] shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <header className="text-center mb-10">
                  <div className="text-primary text-4xl mb-4">🆔</div>
                  <h1 className="text-3xl font-black italic uppercase italic-font-orbitron text-white">Citizen <span className="text-primary">Registry</span></h1>
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-2">Initialize your pilot identity</p>
                </header>

                <form onSubmit={submit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition" placeholder="Username" value={form.username} onChange={e=>setField('username', e.target.value)} required />
                    <input className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition" placeholder="Email Address" value={form.email} onChange={e=>setField('email', e.target.value)} required />
                  </div>
                  <input type="password" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition" placeholder="Password" value={form.password} onChange={e=>setField('password', e.target.value)} required />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition" placeholder="Country" value={form.country} onChange={e=>setField('country', e.target.value)} required />
                    <input className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition" placeholder="ML Player ID" value={form.ml_player_id} onChange={e=>setField('ml_player_id', e.target.value)} required />
                  </div>

                  <button disabled={loading} className="btn w-full py-4 text-xs font-black uppercase tracking-widest mt-4" type="submit">
                    {loading ? 'Transmitting...' : 'Register Pilot'}
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
                    Sign up with Google
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <header className="text-center mb-10">
                  <div className="text-primary text-4xl mb-4">📩</div>
                  <h1 className="text-3xl font-black italic uppercase italic-font-orbitron text-white">Neural <span className="text-primary">Verify</span></h1>
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-2">Enter the 6-digit access code</p>
                </header>
                <form onSubmit={verifyCode} className="space-y-6">
                  <input 
                    maxLength={6}
                    className="w-full bg-transparent border-b-2 border-primary text-5xl font-black text-primary text-center tracking-[0.5em] outline-none py-4"
                    placeholder="000000"
                    value={vCode}
                    onChange={e => setVCode(e.target.value)}
                    autoFocus
                  />
                  <button className="btn w-full py-4 text-xs font-black uppercase tracking-widest" type="submit">Complete Sync</button>
                  <button type="button" onClick={() => setStep(1)} className="w-full text-[10px] text-muted-foreground hover:text-white transition uppercase font-bold">Back to Registry</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/login')} className="text-[10px] font-bold text-muted-foreground hover:text-white transition uppercase tracking-widest">
              Already a pilot? <span className="text-primary underline">Uplink Here</span>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Register
