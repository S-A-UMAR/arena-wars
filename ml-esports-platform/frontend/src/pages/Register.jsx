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
    <Card className="max-w-md mx-auto">
      <h2 className="text-2xl neon-text mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full px-3 py-2 rounded bg-gray-700" placeholder="Username" value={form.username} onChange={e=>setField('username', e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-gray-700" placeholder="Email" value={form.email} onChange={e=>setField('email', e.target.value)} />
        <input type="password" className="w-full px-3 py-2 rounded bg-gray-700" placeholder="Password" value={form.password} onChange={e=>setField('password', e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-gray-700" placeholder="Country" value={form.country} onChange={e=>setField('country', e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-gray-700" placeholder="ML Player ID" value={form.ml_player_id} onChange={e=>setField('ml_player_id', e.target.value)} />
        {error && <div className="text-neon-pink">{error}</div>}
        <button className="btn w-full" type="submit">Create Account</button>
      </form>
    </Card>
  )
}

export default Register
