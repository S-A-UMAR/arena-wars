import { createContext, useContext, useState, useEffect } from 'react'
import { getProfile } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const token = localStorage.getItem('access')
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const res = await getProfile()
      setUser(res.data)
    } catch (err) {
      setUser(null)
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    } finally {
      setLoading(false)
    }
  }

  function loginData(userData, access, refresh) {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
    window.location.href = '/' // Force redirect on logout
  }

  return (
    <AuthContext.Provider value={{ user, loading, login: loginData, logout, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
