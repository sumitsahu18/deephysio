import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

// Login nahi hai -> /admin/login
// Permission nahi hai (jaise editor ne /admin/users khola) -> dashboard
export default function ProtectedRoute({ permission, children }) {
  const { isAuthenticated, loading, can } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner label="Checking session…" />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location }} />
  if (permission && !can(permission)) return <Navigate to="/admin" replace />
  return children
}
