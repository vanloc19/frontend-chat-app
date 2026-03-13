import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '@/routes/paths.js'
import { authService } from '@/services/auth.service.js'
import { getCookie, removeCookie } from '@/services/http.js'

function HomePage() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const refreshToken = getCookie('refresh_token')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch {
      // Always clear local auth cookies even if server logout fails.
    } finally {
      removeCookie('access_token')
      removeCookie('refresh_token')
      navigate(`/${ROUTE_PATHS.AUTH.ROOT}/${ROUTE_PATHS.AUTH.LOGIN}`, { replace: true })
      setIsLoggingOut(false)
    }
  }

  return (
    <section className="page">
      <h1>Chat App</h1>
      <p>Home page from pages/home.</p>
      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>
    </section>
  )
}

export default HomePage
