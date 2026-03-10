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
    <Card className="max-w-md mx-auto">
      <h2 className="text-2xl neon-text mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full px-3 py-2 rounded bg-gray-700" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input type="password" className="w-full px-3 py-2 rounded bg-gray-700" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-neon-pink">{error}</div>}
        <button className="btn w-full" type="submit">Login</button>
      </form>
    </Card>
  )
}

export default Login
