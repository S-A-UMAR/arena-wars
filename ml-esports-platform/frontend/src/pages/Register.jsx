import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { register } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import NeuralBackground from '../components/NeuralBackground'
import { useToast } from '../context/ToastContext'

function Register() {
  const [step, setStep] = useState(1) // 1: Info, 2: Verification
  const [form, setForm] = useState({ username:'', email:'', password:'', country:'', ml_player_id:'' })
  const [vCode, setVCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  function setField(k,v){ setForm(prev=>({ ...prev, [k]: v })) }

  async function submit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // In a real flow, this sends the Resend email on the backend
      await register(form)
      showToast("Access Code Dispatched to Neural Link (Email)", "info")
      setStep(2)
    } catch (err) {
      setError('Neural Conflict: Protocol registration failed')
      showToast("Registration Failed", "error")
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = (e) => {
    e.preventDefault()
    if (vCode.length === 6) {
      showToast("Synchronization Successful. Welcome, Pilot.", "success")
      window.location.href = '/dashboard'
    } else {
      showToast("Neural Code Mismatch", "error")
    }
  }

  return (
    <div className="min-h-[95vh] flex items-center justify-center p-6 relative overflow-hidden bg-black">
      <NeuralBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full relative z-10"
      >
        <Card className="glass border-primary/20 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <header className="text-center mb-12">
                     <div className="inline-block w-16 h-16 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl mb-6 shadow-xl shadow-primary/5">🆔</div>
                     <h2 className="text-4xl font-black italic uppercase italic-font-orbitron text-white tracking-tighter leading-none">Citizen <span className="text-primary">Registry</span></h2>
                     <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.4em] mt-3">Initializing Elite Identification</p>
                  </header>

                  <form onSubmit={submit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-2">Pilot Identifier</label>
                        <input className="w-full px-8 py-5 rounded-[2rem] bg-white/[0.01] border border-white/5 focus:border-primary outline-none transition text-white shadow-inner" placeholder="ArenaWarrior" value={form.username} onChange={e=>setField('username', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-2">Neural Link (Email)</label>
                        <input className="w-full px-8 py-5 rounded-[2rem] bg-white/[0.01] border border-white/5 focus:border-primary outline-none transition text-white shadow-inner" placeholder="pilot@nexus.com" value={form.email} onChange={e=>setField('email', e.target.value)} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-2">Access Key (Password)</label>
                        <input type="password" className="w-full px-8 py-5 rounded-[2rem] bg-white/[0.01] border border-white/5 focus:border-primary outline-none transition text-white shadow-inner" placeholder="••••••••••••" value={form.password} onChange={e=>setField('password', e.target.value)} required />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-2">Sector (Country)</label>
                        <input className="w-full px-8 py-5 rounded-[2rem] bg-white/[0.01] border border-white/5 focus:border-primary outline-none transition text-white shadow-inner" placeholder="Philippines" value={form.country} onChange={e=>setField('country', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-2">ML Intelligence ID</label>
                        <input className="w-full px-8 py-5 rounded-[2rem] bg-white/[0.01] border border-white/5 focus:border-primary outline-none transition text-white shadow-inner" placeholder="12345678" value={form.ml_player_id} onChange={e=>setField('ml_player_id', e.target.value)} required />
                      </div>
                    </div>

                    <button disabled={loading} className="btn w-full py-5 text-sm font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/10 mt-6" type="submit">
                      {loading ? 'Transmitting...' : 'Initiate Identity Protocol'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-24 h-24 rounded-[3rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-primary/10">📩</div>
                  <h2 className="text-4xl font-black italic uppercase italic-font-orbitron text-white mb-4">Neural <span className="text-primary">Verification</span></h2>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest leading-relaxed mb-12">We have dispatched a 6-digit access code to your neural link. Enter it below to finalize synchronization.</p>
                  
                  <form onSubmit={verifyCode} className="space-y-10">
                     <div className="flex justify-center gap-4">
                        <input 
                           maxLength={6}
                           className="w-full max-w-[300px] bg-white/[0.01] border-b-2 border-primary/40 text-6xl font-black text-primary text-center tracking-[0.5em] outline-none focus:border-primary transition-all py-4"
                           placeholder="000000"
                           value={vCode}
                           onChange={e => setVCode(e.target.value)}
                           autoFocus
                        />
                     </div>
                     <div className="space-y-4">
                        <button className="btn w-full py-5 text-sm font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/10" type="submit">
                           Synchronize Identity
                        </button>
                        <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-white transition">Re-Enter Coordinates</button>
                     </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 text-center">
              <button onClick={() => navigate('/login')} className="text-[9px] font-black uppercase text-muted-foreground hover:text-white transition tracking-[0.2em]">
                Verified Pilot? <span className="text-primary underline">Verify Credentials</span>
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-0 opacity-40" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -z-0 opacity-40" />
        </Card>
      </motion.div>
    </div>
  )
}

export default Register
