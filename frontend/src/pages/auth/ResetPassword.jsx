import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

/* =========================================================
   CAREER PILOT — LOGIN PAGE
   Simple Professional Card Design
========================================================= */

const C = {
  bg: '#F7F3EA',
  panel: '#FFFFFF',
  ink: '#20231F',
  inkSoft: '#697069',
  muted: '#969D97',
  border: '#E7E1D6',

  green: '#3F6B4F',
  greenDark: '#31553E',
  greenSoft: '#E8F1E9',

  purple: '#7564A8',
  purpleSoft: '#F0ECF8',

  teal: '#4D8D95',
  tealSoft: '#E5F1F2',

  danger: '#B84D48',
  dangerBg: '#FBEDEC',
  dangerBorder: '#F1C8C5',
}

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
`

/* =========================================================
   LOGO
========================================================= */

function LogoIcon({ color = '#FFFFFF', size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* =========================================================
   EMAIL ICON
========================================================= */

function EmailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* =========================================================
   PASSWORD ICON
========================================================= */

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 10V7a4 4 0 018 0v3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* =========================================================
   EYE ICON
========================================================= */

function EyeIcon({ visible }) {
  return visible ? (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

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
     EXISTING LOGIN FUNCTIONALITY
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
          TOP BRAND
      =================================================== */}

      <header className="cp-login-header">

        <Link
          to="/"
          className="cp-brand"
        >

          <div className="cp-brand-icon">
            <LogoIcon />
          </div>

          <span>
            Career Pilot
          </span>

        </Link>

        <div className="cp-header-text">
          Your career journey starts here.
        </div>

      </header>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="cp-login-main">

        <div className="cp-login-card">

          {/* Green top line */}
          <div className="cp-card-top-line" />


          {/* =================================================
              CARD HEADER
          ================================================= */}

          <div className="cp-card-header">

            <div className="cp-welcome-icon">
              <LogoIcon
                color={C.green}
                size={21}
              />
            </div>

            <div>

              <div className="cp-small-title">
                WELCOME BACK
              </div>

              <h1>
                Sign in to Career Pilot
              </h1>

              <p>
                Continue your career journey with us.
              </p>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="cp-error">

              <span className="cp-error-symbol">
                !
              </span>

              <span>
                {error}
              </span>

            </div>
          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="cp-login-form"
          >

            {/* EMAIL */}

            <div className="cp-field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="cp-input">

                <span className="cp-input-icon">
                  <EmailIcon />
                </span>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter your email address"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="cp-field">

              <div className="cp-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="cp-forgot"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="cp-input">

                <span className="cp-input-icon">
                  <LockIcon />
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  autoComplete="current-password"
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
                  className="cp-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  <EyeIcon
                    visible={showPassword}
                  />
                </button>

              </div>

            </div>


            {/* =================================================
                REMEMBER
            ================================================= */}

            <div className="cp-options">

              <label className="cp-remember">

                <input
                  type="checkbox"
                />

                <span className="cp-check" />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="cp-submit"
            >

              {loading
                ? 'Signing in...'
                : 'Sign In'}

              {!loading && (
                <span className="cp-submit-arrow">
                  →
                </span>
              )}

            </button>

          </form>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="cp-divider">

            <span />

            <small>
              or
            </small>

            <span />

          </div>


          {/* =================================================
              QUICK FEATURES
          ================================================= */}

          <div className="cp-features">

            <div className="cp-feature purple">
              <span>✦</span>
              AI Career
            </div>

            <div className="cp-feature teal">
              <span>↗</span>
              Job Matching
            </div>

            <div className="cp-feature green">
              <span>✓</span>
              Career Roadmap
            </div>

          </div>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="cp-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create account
            </Link>

          </div>

        </div>

      </main>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="cp-footer">

        <span>
          © {new Date().getFullYear()} Career Pilot
        </span>

        <span>
          AI-Powered IT Career Guidance
        </span>

      </footer>


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

        /* ================================================
           PAGE
        ================================================ */

        .cp-login-page {
          min-height: 100vh;
          background: ${C.bg};
          color: ${C.ink};
          font-family: Inter, sans-serif;
          display: flex;
          flex-direction: column;
        }


        /* ================================================
           HEADER
        ================================================ */

        .cp-login-header {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 24px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cp-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          color: ${C.ink};
          text-decoration: none;
        }

        .cp-brand-icon {
          width: 35px;
          height: 35px;
          border-radius: 9px;
          background: ${C.green};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cp-brand span {
          font-family: Manrope, sans-serif;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .cp-header-text {
          color: ${C.inkSoft};
          font-size: 11px;
        }


        /* ================================================
           MAIN
        ================================================ */

        .cp-login-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 20px 45px;
        }


        /* ================================================
           CARD
        ================================================ */

        .cp-login-card {
          width: 100%;
          max-width: 430px;
          position: relative;
          background: ${C.panel};
          border: 1px solid ${C.border};
          border-radius: 18px;
          padding: 34px 36px 30px;
          box-shadow:
            0 18px 45px rgba(39, 44, 39, 0.08);
          overflow: hidden;
        }

        .cp-card-top-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${C.green};
        }


        /* ================================================
           CARD HEADER
        ================================================ */

        .cp-card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 27px;
        }

        .cp-welcome-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border-radius: 11px;
          background: ${C.greenSoft};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cp-small-title {
          color: ${C.green};
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.13em;
          margin-bottom: 5px;
        }

        .cp-card-header h1 {
          margin: 0 0 5px;
          font-family: Manrope, sans-serif;
          font-size: 24px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .cp-card-header p {
          margin: 0;
          color: ${C.inkSoft};
          font-size: 11.5px;
          line-height: 1.5;
        }


        /* ================================================
           ERROR
        ================================================ */

        .cp-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${C.dangerBg};
          border: 1px solid ${C.dangerBorder};
          color: ${C.danger};
          border-radius: 9px;
          padding: 10px 12px;
          margin-bottom: 17px;
          font-size: 11px;
          line-height: 1.4;
        }

        .cp-error-symbol {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          border-radius: 50%;
          background: ${C.danger};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
        }


        /* ================================================
           FORM
        ================================================ */

        .cp-login-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .cp-field {
          width: 100%;
        }

        .cp-field label {
          display: block;
          margin-bottom: 7px;
          font-size: 11.5px;
          font-weight: 700;
          color: ${C.ink};
        }

        .cp-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;
        }

        .cp-label-row label {
          margin: 0;
        }

        .cp-forgot {
          color: ${C.green};
          font-size: 10px;
          font-weight: 700;
          text-decoration: none;
        }

        .cp-forgot:hover {
          text-decoration: underline;
        }


        /* ================================================
           INPUT
        ================================================ */

        .cp-input {
          width: 100%;
          height: 46px;
          position: relative;
        }

        .cp-input input {
          width: 100%;
          height: 100%;
          padding:
            0
            42px
            0
            40px;
          border:
            1px solid ${C.border};
          border-radius: 9px;
          outline: none;
          background: #FFFFFF;
          color: ${C.ink};
          font-family: Inter, sans-serif;
          font-size: 11.5px;
          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .cp-input input::placeholder {
          color: #A4AAA5;
        }

        .cp-input input:focus {
          border-color: ${C.green};
          box-shadow:
            0 0 0 3px
            rgba(63,107,79,0.08);
        }

        .cp-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #919991;
          display: flex;
          pointer-events: none;
          z-index: 2;
        }

        .cp-eye {
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

        .cp-eye:hover {
          background: ${C.bg};
          color: ${C.green};
          transform: translateY(-50%);
        }


        /* ================================================
           REMEMBER
        ================================================ */

        .cp-options {
          margin-top: -2px;
        }

        .cp-remember {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: ${C.inkSoft};
          font-size: 10.5px;
          cursor: pointer;
        }

        .cp-remember input {
          display: none;
        }

        .cp-check {
          width: 16px;
          height: 16px;
          border:
            1px solid ${C.border};
          border-radius: 4px;
          background: white;
          position: relative;
        }

        .cp-remember input:checked + .cp-check {
          background: ${C.green};
          border-color: ${C.green};
        }

        .cp-remember input:checked + .cp-check::after {
          content: '';
          position: absolute;
          width: 5px;
          height: 9px;
          left: 5px;
          top: 2px;
          border:
            solid white;
          border-width:
            0
            2px
            2px
            0;
          transform: rotate(45deg);
        }


        /* ================================================
           SUBMIT
        ================================================ */

        .cp-submit {
          width: 100%;
          height: 46px;
          border: none;
          border-radius: 9px;
          background: ${C.green};
          color: white;
          font-family: Inter, sans-serif;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition:
            background 0.18s ease,
            transform 0.18s ease;
        }

        .cp-submit:hover:not(:disabled) {
          background: ${C.greenDark};
          transform: translateY(-1px);
        }

        .cp-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cp-submit-arrow {
          width: 23px;
          height: 23px;
          border-radius: 6px;
          background:
            rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }


        /* ================================================
           DIVIDER
        ================================================ */

        .cp-divider {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 23px 0 16px;
        }

        .cp-divider span {
          flex: 1;
          height: 1px;
          background: ${C.border};
        }

        .cp-divider small {
          color: ${C.muted};
          font-size: 9px;
        }


        /* ================================================
           FEATURES
        ================================================ */

        .cp-features {
          display: flex;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .cp-feature {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 9px;
          border-radius: 6px;
          font-size: 8.5px;
          font-weight: 700;
        }

        .cp-feature span {
          font-size: 10px;
        }

        .cp-feature.purple {
          color: ${C.purple};
          background: ${C.purpleSoft};
        }

        .cp-feature.teal {
          color: ${C.teal};
          background: ${C.tealSoft};
        }

        .cp-feature.green {
          color: ${C.green};
          background: ${C.greenSoft};
        }


        /* ================================================
           REGISTER
        ================================================ */

        .cp-register {
          margin: 22px 0 0;
          padding-top: 19px;
          border-top: 1px solid ${C.border};
          text-align: center;
          color: ${C.inkSoft};
          font-size: 11px;
        }

        .cp-register a {
          color: ${C.green};
          text-decoration: none;
          font-weight: 700;
          margin-left: 3px;
        }

        .cp-register a:hover {
          text-decoration: underline;
        }


        /* ================================================
           FOOTER
        ================================================ */

        .cp-footer {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 30px 20px;
          display: flex;
          justify-content: space-between;
          color: ${C.muted};
          font-size: 9px;
        }


        /* ================================================
           TABLET
        ================================================ */

        @media (max-width: 650px) {

          .cp-login-header {
            padding:
              20px
              20px
              10px;
          }

          .cp-header-text {
            display: none;
          }

          .cp-login-main {
            padding:
              20px
              15px
              35px;
          }

          .cp-login-card {
            padding:
              30px
              24px
              27px;
            border-radius: 15px;
          }

          .cp-footer {
            padding:
              0
              20px
              17px;
            justify-content: center;
          }

          .cp-footer span:last-child {
            display: none;
          }

        }


        /* ================================================
           SMALL MOBILE
        ================================================ */

        @media (max-width: 400px) {

          .cp-login-card {
            padding:
              27px
              19px
              24px;
          }

          .cp-card-header h1 {
            font-size: 21px;
          }

          .cp-card-header p {
            font-size: 10.5px;
          }

          .cp-features {
            gap: 4px;
          }

          .cp-feature {
            font-size: 8px;
            padding:
              5px
              7px;
          }

        }

      `}</style>

    </div>
  )
}