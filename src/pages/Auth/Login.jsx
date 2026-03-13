import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth.service.js'
import { getDeviceInfo } from '@/services/device-info.js'
import { ROUTE_PATHS } from '@/routes/paths.js'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phoneNumber: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authService.login({
        ...form,
        deviceInfo: getDeviceInfo(),
      })
      navigate(ROUTE_PATHS.ROOT, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <h1>Đăng nhập</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="phoneNumber">Số điện thoại</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="0912345678"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <p className="form-footer">
          Chưa có tài khoản?{' '}
          <Link to={`/${ROUTE_PATHS.AUTH.ROOT}/${ROUTE_PATHS.AUTH.REGISTER}`}>Đăng ký</Link>
        </p>
      </form>
    </section>
  )
}

export default LoginPage
