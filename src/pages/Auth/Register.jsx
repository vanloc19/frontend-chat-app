import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth.service.js'
import { setCookie } from '@/services/http.js'
import { ROUTE_PATHS } from '@/routes/paths.js'

const STEP = Object.freeze({
  PHONE: 1,
  OTP: 2,
  DISPLAY_NAME: 3,
  PASSWORD: 4,
  GENDER: 5,
})

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(STEP.PHONE)
  const [form, setForm] = useState({
    phoneNumber: '',
    otp: '',
    displayName: '',
    password: '',
    gender: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()

    if (!/^0[3-9][0-9]{8}$/.test(form.phoneNumber)) {
      setError('Số điện thoại không hợp lệ')
      return
    }

    setLoading(true)
    setError('')

    try {
      await authService.sendOtp({ phoneNumber: form.phoneNumber })
      setStep(STEP.OTP)
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi OTP thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitOtp = (e) => {
    e.preventDefault()

    if (!/^[0-9]{4,6}$/.test(form.otp)) {
      setError('OTP không hợp lệ')
      return
    }

    setStep(STEP.DISPLAY_NAME)
  }

  const handleSubmitDisplayName = (e) => {
    e.preventDefault()

    if (form.displayName.trim().length < 2) {
      setError('Họ tên tối thiểu 2 ký tự')
      return
    }

    setStep(STEP.PASSWORD)
  }

  const handleSubmitPassword = (e) => {
    e.preventDefault()

    if (!PASSWORD_RULE.test(form.password)) {
      setError('Mật khẩu phải có hoa, thường, số và ký tự đặc biệt')
      return
    }

    setStep(STEP.GENDER)
  }

  const handleSubmitRegister = async (e) => {
    e.preventDefault()

    if (!form.gender) {
      setError('Vui lòng chọn giới tính')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data } = await authService.register({
        phoneNumber: form.phoneNumber,
        otp: form.otp,
        displayName: form.displayName.trim(),
        password: form.password,
        gender: form.gender,
      })

      setCookie('access_token', data.accessToken, 15 * 60)
      setCookie('refresh_token', data.refreshToken, 7 * 24 * 3600)
      navigate(ROUTE_PATHS.ROOT, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <h1>Đăng ký</h1>
      <p className="step-note">Bước {step}/5</p>

      {error && <p className="form-error">{error}</p>}

      {step === STEP.PHONE && (
        <form className="auth-form" onSubmit={handleSendOtp}>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="tel"
              placeholder="0912345678"
              value={form.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
          </button>

          <p className="form-footer">
            Đã có tài khoản?{' '}
            <Link to={`/${ROUTE_PATHS.AUTH.ROOT}/${ROUTE_PATHS.AUTH.LOGIN}`}>Đăng nhập</Link>
          </p>
        </form>
      )}

      {step === STEP.OTP && (
        <form className="auth-form" onSubmit={handleSubmitOtp}>
          <div className="form-group">
            <label htmlFor="otp">Nhập mã OTP</label>
            <input
              id="otp"
              name="otp"
              type="text"
              placeholder="6 số OTP"
              value={form.otp}
              onChange={(e) => updateField('otp', e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Xác nhận OTP
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep(STEP.PHONE)}
          >
            ← Quay lại số điện thoại
          </button>
        </form>
      )}

      {step === STEP.DISPLAY_NAME && (
        <form className="auth-form" onSubmit={handleSubmitDisplayName}>
          <div className="form-group">
            <label htmlFor="displayName">Nhập họ tên</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.displayName}
              onChange={(e) => updateField('displayName', e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Tiếp tục
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep(STEP.OTP)}
          >
            ← Quay lại OTP
          </button>
        </form>
      )}

      {step === STEP.PASSWORD && (
        <form className="auth-form" onSubmit={handleSubmitPassword}>
          <div className="form-group">
            <label htmlFor="password">Nhập mật khẩu</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Tiếp tục
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep(STEP.DISPLAY_NAME)}
          >
            ← Quay lại họ tên
          </button>
        </form>
      )}

      {step === STEP.GENDER && (
        <form className="auth-form" onSubmit={handleSubmitRegister}>
          <div className="form-group">
            <label>Chọn giới tính</label>

            <div className="gender-options">
              <button
                type="button"
                className={`gender-btn ${form.gender === 'MALE' ? 'active' : ''}`}
                onClick={() => updateField('gender', 'MALE')}
              >
                Nam
              </button>

              <button
                type="button"
                className={`gender-btn ${form.gender === 'FEMALE' ? 'active' : ''}`}
                onClick={() => updateField('gender', 'FEMALE')}
              >
                Nữ
              </button>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep(STEP.PASSWORD)}
          >
            ← Quay lại mật khẩu
          </button>
        </form>
      )}
    </section>
  )
}

export default RegisterPage
