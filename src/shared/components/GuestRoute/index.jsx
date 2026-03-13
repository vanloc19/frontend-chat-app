import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth/index.js'
import { ROUTE_PATHS } from '@/routes/paths.js'

// Redirect authenticated users away from login/register back to home
function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.ROOT} replace />
  }

  return <Outlet />
}

export default GuestRoute
