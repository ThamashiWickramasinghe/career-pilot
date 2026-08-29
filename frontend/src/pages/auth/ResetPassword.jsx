import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../../utils/api'

/* =========================================================
   CAREER PILOT — RESET PASSWORD PAGE
   (matches Login / ForgotPassword design system)
========================================================= */

const C = {
  // Main Career Pilot theme
  bg: '#F4F7FC',
  panel: '#FFFFFF',
  ink: '#26354D',
  inkSoft: '#68768C',
  border: '#DEE5F0',

  // Primary Career Pilot blue
  green: '#5B8DEF',
  greenDark: '#4777D4',
  greenSoft: '#EAF1FF',

  // Error
  danger: '#B84D48',
  dangerBg: '#FBEDEC',
  dangerBorder: '#F1C8C5',
}

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
`

/* =========================================================
   LOCK ICON
========================================================= */

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

/* =========================================================
   EYE ICON
========================================================= */

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M10.6 6.2C11.05 6.07 11.52 6 12 6c6 0 9.5 6 9.5 6a17.4 17.4 0 01-3.1 3.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6.4 9.1C4.1 10.5 2.5 12 2.5 12s3.5 6 9.5 6c1.1 0 2.2-.2 3.1-.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* =========================================================
   SUCCESS ICON
========================================================= */

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12.5l5 5L20 6"
        stroke={C.green}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* =========================================================
   RESET PASSWORD
========================================================= */

export default function ResetPassword() {

  const { token } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await API.post('/auth/reset-password', {
        token,
        password: form.password,
        confirm_password: form.confirmPassword,
      })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'This link is invalid or has expired')
    }

    setLoading(false)
  }

  return (
    <div className="cp-rp-page">

      <style>{fontImport}</style>

      <div className="cp-rp-card">

        {!done ? (
          <>
            {/* Heading */}
            <div className="cp-rp-heading">

              <h1>
                Set a new password
              </h1>

              <p>
                Choose a strong password you haven't used before.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="cp-rp-error">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>

              <div className="cp-rp-field">

                <label htmlFor="password">
                  New password
                </label>

                <div className="cp-rp-input">

                  <span className="cp-rp-input-icon">
                    <LockIcon />
                  </span>

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    className="cp-rp-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>

                </div>

              </div>

              <div className="cp-rp-field">

                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div className="cp-rp-input">

                  <span className="cp-rp-input-icon">
                    <LockIcon />
                  </span>

                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    placeholder="Re-enter new password"
                  />

                  <button
                    type="button"
                    className="cp-rp-eye"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon visible={showConfirm} />
                  </button>

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="cp-rp-button"
              >
                {loading ? 'Updating...' : 'Update password'}
              </button>

            </form>

            {/* Divider */}
            <div className="cp-rp-divider">
              <span />
              <small>Career Pilot</small>
              <span />
            </div>

            {/* Login */}
            <p className="cp-rp-login">
              Remember your password?{' '}
              <Link to="/login">
                Sign in
              </Link>
            </p>

          </>
        ) : (
          /* =================================================
              SUCCESS STATE
          ================================================= */
          <div className="cp-rp-success">

            <div className="cp-rp-success-icon">
              <CheckIcon />
            </div>

            <h2>
              Password updated
            </h2>

            <p className="cp-rp-success-message">
              Your password has been changed successfully.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="cp-rp-button"
            >
              Sign in
            </button>

          </div>
        )}

      </div>

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

        .cp-rp-page {
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
           CARD
        ================================================= */

        .cp-rp-card {
          width: 100%;
          max-width: 410px;
          background: ${C.panel};
          border: 1px solid ${C.border};
          border-radius: 18px;
          padding: 34px 36px 30px;
          box-shadow: 0 15px 40px rgba(40, 45, 40, 0.07);
        }

        /* =================================================
           HEADING
        ================================================= */

        .cp-rp-heading {
          margin-bottom: 25px;
        }

        .cp-rp-heading h1 {
          margin: 0 0 7px;
          font-family: Manrope, sans-serif;
          font-size: 28px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .cp-rp-heading p {
          margin: 0;
          color: ${C.inkSoft};
          font-size: 13px;
          line-height: 1.55;
        }

        /* =================================================
           ERROR
        ================================================= */

        .cp-rp-error {
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
           FIELD
        ================================================= */

        .cp-rp-field {
          margin-bottom: 18px;
        }

        .cp-rp-field label {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 700;
          color: ${C.ink};
        }

        .cp-rp-input {
          width: 100%;
          height: 45px;
          position: relative;
        }

        .cp-rp-input input {
          width: 100%;
          height: 100%;
          padding: 0 42px 0 40px;
          border: 1px solid ${C.border};
          border-radius: 9px;
          outline: none;
          background: #FFFFFF;
          color: ${C.ink};
          font-family: Inter, sans-serif;
          font-size: 12.5px;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .cp-rp-input input::placeholder {
          color: #A3AAA4;
        }

        .cp-rp-input input:focus {
          border-color: ${C.green};
          box-shadow: 0 0 0 3px rgba(91,141,239,0.08);
        }

        .cp-rp-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #919991;
          display: flex;
          pointer-events: none;
          z-index: 2;
        }

        .cp-rp-eye {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: #8F978F;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .cp-rp-eye:hover {
          background: ${C.bg};
          color: ${C.green};
        }

        /* =================================================
           BUTTON
        ================================================= */

        .cp-rp-button {
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
          transition: background 0.18s ease, transform 0.18s ease;
        }

        .cp-rp-button:hover:not(:disabled) {
          background: ${C.greenDark};
          transform: translateY(-1px);
        }

        .cp-rp-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* =================================================
           DIVIDER
        ================================================= */

        .cp-rp-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 25px 0 20px;
        }

        .cp-rp-divider span {
          flex: 1;
          height: 1px;
          background: ${C.border};
        }

        .cp-rp-divider small {
          color: #9BA29C;
          font-size: 9.5px;
        }

        /* =================================================
           LOGIN LINK
        ================================================= */

        .cp-rp-login {
          margin: 0;
          text-align: center;
          color: ${C.inkSoft};
          font-size: 12px;
        }

        .cp-rp-login a {
          color: ${C.green};
          font-weight: 700;
          text-decoration: none;
        }

        .cp-rp-login a:hover {
          color: ${C.greenDark};
        }

        /* =================================================
           SUCCESS STATE
        ================================================= */

        .cp-rp-success {
          text-align: center;
        }

        .cp-rp-success-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: ${C.greenSoft};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }

        .cp-rp-success h2 {
          margin: 0 0 9px;
          font-family: Manrope, sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .cp-rp-success-message {
          margin: 0 0 22px;
          color: ${C.inkSoft};
          font-size: 13px;
          line-height: 1.55;
        }

        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 480px) {

          .cp-rp-page {
            padding: 25px 15px;
          }

          .cp-rp-card {
            padding: 28px 22px 25px;
            border-radius: 15px;
          }

          .cp-rp-heading h1 {
            font-size: 25px;
          }

          .cp-rp-heading p {
            font-size: 12px;
          }

        }

      `}</style>

    </div>
  )
}
