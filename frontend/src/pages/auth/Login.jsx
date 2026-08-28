import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

/* =========================================================
   CAREER PILOT — SIMPLE LOGIN PAGE
========================================================= */

const C = {
  // Main Career Pilot theme
  bg: '#F4F7FC',
  panel: '#FFFFFF',
  ink: '#26354D',
  inkSoft: '#68768C',
  border: '#DEE5F0',

  // Primary blue
  green: '#5B8DEF',
  greenDark: '#4777D4',
  greenSoft: '#EAF1FF',

  // Secondary purple
  purple: '#8B6FC4',
  purpleSoft: '#F1EBFC',

  // Error colors
  danger: '#B84D48',
  dangerBg: '#FBEDEC',
  dangerBorder: '#F1C8C5',
}
const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
`

/* =========================================================
   LOGO ICON
========================================================= */

function LogoIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* =========================================================
   LOGIN
========================================================= */

export default function Login() {

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  /* =======================================================
     EXISTING LOGIN LOGIC
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const res = await API.post('/auth/login', form)

      login(res.data.user, res.data.token)

      const role = res.data.user.role

      if (role === 'admin') {
        navigate('/admin/dashboard')
      } else if (role === 'instructor') {
        navigate('/instructor/dashboard')
      } else if (role === 'company') {
        navigate('/company/dashboard')
      } else {
        navigate('/dashboard')
      }

    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed'
      )
    }

    setLoading(false)
  }

  return (
    <div className="cp-login-page">

      <style>{fontImport}</style>

      {/* ===================================================
          BRAND
      =================================================== */}

      <div className="cp-login-brand">

        

      </div>

      {/* ===================================================
          LOGIN CARD
      =================================================== */}

      <div className="cp-login-card">

        {/* Small top icon */}
        

        {/* Heading */}
        <div className="cp-login-heading">

          <h1>
            Welcome back
          </h1>

          <p>
            Sign in to continue your career journey.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="cp-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="cp-field">

            <label>
              Email address
            </label>

            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="Enter your email"
            />

          </div>

          {/* Password */}
          <div className="cp-field">

            <div className="cp-password-label">

              <label>
                Password
              </label>

              
            </div>

            

            <div className="cp-password-wrapper">

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                required
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="Enter your password"
              />

              <button
                type="button"
                className="cp-show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

            </div>

            <Link
                to="/forgot-password"
                className="cp-forgot"
              >
                Forgot password?
              </Link>

          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="cp-login-button"
          >
            {loading
              ? 'Signing in...'
              : 'Sign in'}
          </button>

        </form>

        {/* Divider */}
        <div className="cp-divider">
          <span />
          <small>Career Pilot</small>
          <span />
        </div>

        {/* Register */}
        <p className="cp-register">

          Don't have an account?{' '}

          <Link to="/register">
            Sign up
          </Link>

        </p>

      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      


      {/* ===================================================
          STYLES
      =================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .cp-login-page {
          min-height: 100vh;
          background: ${C.bg};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 35px 20px;
          font-family: Inter, sans-serif;
          color: ${C.ink};
        }

        /* =================================================
           BRAND
        ================================================= */

        .cp-login-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 24px;
        }

        .cp-logo {
          width: 35px;
          height: 35px;
          border-radius: 9px;
          background: ${C.green};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cp-login-brand span {
          font-family: Manrope, sans-serif;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        /* =================================================
           LOGIN CARD
        ================================================= */

        .cp-login-card {
          width: 100%;
          max-width: 410px;
          background: ${C.panel};
          border: 1px solid ${C.border};
          border-radius: 18px;
          padding: 34px 36px 30px;
          box-shadow:
            0 15px 40px rgba(40, 45, 40, 0.07);
        }

        /* =================================================
           CARD ICON
        ================================================= */

        .cp-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          background: ${C.green};
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        /* =================================================
           HEADING
        ================================================= */

        .cp-login-heading {
          margin-bottom: 25px;
        }

        .cp-login-heading h1 {
          margin: 0 0 7px;
          font-family: Manrope, sans-serif;
          font-size: 28px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .cp-login-heading p {
          margin: 0;
          color: ${C.inkSoft};
          font-size: 13px;
          line-height: 1.55;
        }

        /* =================================================
           ERROR
        ================================================= */

        .cp-error {
          background: ${C.dangerBg};
          border: 1px solid ${C.dangerBorder};
          color: ${C.danger};
          border-radius: 9px;
          padding: 10px 12px;
          margin-bottom: 18px;
          font-size: 12px;
          line-height: 1.4;
        }

        /* =================================================
           FIELDS
        ================================================= */

        .cp-field {
          margin-bottom: 17px;
        }

        .cp-field label {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 700;
          color: ${C.ink};
        }

        .cp-field input {
          width: 100%;
          height: 45px;
          padding: 0 13px;
          border: 1px solid ${C.border};
          border-radius: 9px;
          outline: none;
          background: #FFFFFF;
          color: ${C.ink};
          font-family: Inter, sans-serif;
          font-size: 12.5px;
          transition: 0.18s ease;
        }

        .cp-field input::placeholder {
          color: #A3AAA4;
        }

        .cp-field input:focus {
          border-color: ${C.green};
          box-shadow:
            0 0 0 3px rgba(63,107,79,0.08);
        }

        /* =================================================
           PASSWORD
        ================================================= */

        .cp-password-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 7px;
        }

        .cp-password-label label {
          margin-bottom: 0;
        }

        .cp-forgot {
          color: ${C.green};
          text-decoration: none;
          font-size: 10.5px;
          font-weight: 700;
        }

        .cp-forgot:hover {
          color: ${C.greenDark};
        }

        .cp-password-wrapper {
          position: relative;
        }

        .cp-password-wrapper input {
          padding-right: 55px;
        }

        .cp-show-password {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: ${C.green};
          font-size: 10.5px;
          font-weight: 700;
          cursor: pointer;
          padding: 5px;
        }

        .cp-show-password:hover {
          transform: translateY(-50%);
          color: ${C.greenDark};
        }

        /* =================================================
           LOGIN BUTTON
        ================================================= */

        .cp-login-button {
          width: 100%;
          height: 46px;
          border: none;
          border-radius: 9px;
          background: ${C.green};
          color: #FFFFFF;
          font-family: Inter, sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 3px;
          transition:
            background 0.18s ease,
            transform 0.18s ease;
        }

        .cp-login-button:hover:not(:disabled) {
          background: ${C.greenDark};
          transform: translateY(-1px);
        }

        .cp-login-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* =================================================
           DIVIDER
        ================================================= */

        .cp-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 25px 0 20px;
        }

        .cp-divider span {
          flex: 1;
          height: 1px;
          background: ${C.border};
        }

        .cp-divider small {
          color: #9BA29C;
          font-size: 9.5px;
        }

        /* =================================================
           REGISTER
        ================================================= */

        .cp-register {
          margin: 0;
          text-align: center;
          color: ${C.inkSoft};
          font-size: 12px;
        }

        .cp-register a {
          color: ${C.green};
          font-weight: 700;
          text-decoration: none;
        }

        .cp-register a:hover {
          color: ${C.greenDark};
        }

        /* =================================================
           FOOTER
        ================================================= */

        .cp-footer {
          margin-top: 20px;
          color: #999F99;
          font-size: 10px;
        }

        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 480px) {

          .cp-login-page {
            padding: 25px 15px;
          }

          .cp-login-brand {
            margin-bottom: 20px;
          }

          .cp-login-card {
            padding: 28px 22px 25px;
            border-radius: 15px;
          }

          .cp-card-icon {
            width: 43px;
            height: 43px;
            border-radius: 11px;
            margin-bottom: 17px;
          }

          .cp-login-heading h1 {
            font-size: 25px;
          }

          .cp-login-heading p {
            font-size: 12px;
          }

          .cp-footer {
            font-size: 9px;
          }

        }

      `}</style>

    </div>
  )
}