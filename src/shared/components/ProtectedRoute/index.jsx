import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth/index.js'
import { ROUTE_PATHS } from '@/routes/paths.js'

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/${ROUTE_PATHS.AUTH.ROOT}/${ROUTE_PATHS.AUTH.LOGIN}`}
        state={{ from: location }}
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
