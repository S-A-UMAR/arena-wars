import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user } = useAuth()
  
  if (!user || (!user.user?.is_staff && !user.user?.is_superuser)) {
    return <Navigate to="/" replace />
  }
  
  return children
}
