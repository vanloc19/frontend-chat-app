import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '@/routes/paths.js'
import { authService } from '@/services/auth.service.js'

function HomePage() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await authService.logout()
    } catch {
      // Continue redirect flow even if server logout fails.
    } finally {
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
