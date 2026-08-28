import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/api'

/* =========================================================
   CAREER PILOT — SIMPLE FORGOT PASSWORD PAGE
   (matches Login / Register design system)
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

  // Job Seeker / AI purple
  purple: '#8B6FC4',
  purpleSoft: '#F1EBFC',

  // Company / matching teal
  teal: '#55AFC0',
  tealSoft: '#E5F5F7',

  // Error
  danger: '#B84D48',
  dangerBg: '#FBEDEC',
  dangerBorder: '#F1C8C5',
}

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
`

/* =========================================================
   SUCCESS ICON (checkmail)
========================================================= */

function MailSentIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6.5l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
        stroke={C.green}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export default function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  /* =======================================================
     EXISTING LOGIC
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/auth/forgot-password', { email })
      setMessage(res.data.message)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="cp-fp-page">

      <style>{fontImport}</style>

      <div className="cp-fp-card">

        {!sent ? (
          <>
            {/* Heading */}
            <div className="cp-fp-heading">

              <h1>
                Reset password
              </h1>

              <p>
                Enter your email and we'll send you a secure reset link.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="cp-fp-error">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>

              <div className="cp-fp-field">

                <label>
                  Email address
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="cp-fp-button"
              >
                {loading
                  ? 'Sending...'
                  : 'Send reset link'}
              </button>

            </form>

            {/* Divider */}
            <div className="cp-fp-divider">
              <span />
              <small>Career Pilot</small>
              <span />
            </div>

            {/* Login */}
            <p className="cp-fp-login">

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
          <div className="cp-fp-success">

            <div className="cp-fp-success-icon">
              <MailSentIcon />
            </div>

            <h2>
              Check your inbox
            </h2>

            <p className="cp-fp-success-message">
              {message}
            </p>

            <p className="cp-fp-success-note">
              Didn't receive it? Check your spam folder.
            </p>

            <button
              onClick={() => setSent(false)}
              className="cp-fp-retry"
            >
              Try a different email
            </button>

            <p className="cp-fp-login" style={{ marginTop: 22 }}>

              Remember your password?{' '}

              <Link to="/login">
                Sign in
              </Link>

            </p>

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

        .cp-fp-page {
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

        .cp-fp-card {
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
           HEADING
        ================================================= */

        .cp-fp-heading {
          margin-bottom: 25px;
        }

        .cp-fp-heading h1 {
          margin: 0 0 7px;
          font-family: Manrope, sans-serif;
          font-size: 28px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .cp-fp-heading p {
          margin: 0;
          color: ${C.inkSoft};
          font-size: 13px;
          line-height: 1.55;
        }

        /* =================================================
           ERROR
        ================================================= */

        .cp-fp-error {
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

        .cp-fp-field {
          margin-bottom: 20px;
        }

        .cp-fp-field label {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 700;
          color: ${C.ink};
        }

        .cp-fp-field input {
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

        .cp-fp-field input::placeholder {
          color: #A3AAA4;
        }

        .cp-fp-field input:focus {
          border-color: ${C.green};
          box-shadow:
            0 0 0 3px rgba(63,107,79,0.08);
        }

        /* =================================================
           BUTTON
        ================================================= */

        .cp-fp-button {
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
          transition:
            background 0.18s ease,
            transform 0.18s ease;
        }

        .cp-fp-button:hover:not(:disabled) {
          background: ${C.greenDark};
          transform: translateY(-1px);
        }

        .cp-fp-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* =================================================
           DIVIDER
        ================================================= */

        .cp-fp-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 25px 0 20px;
        }

        .cp-fp-divider span {
          flex: 1;
          height: 1px;
          background: ${C.border};
        }

        .cp-fp-divider small {
          color: #9BA29C;
          font-size: 9.5px;
        }

        /* =================================================
           LOGIN LINK
        ================================================= */

        .cp-fp-login {
          margin: 0;
          text-align: center;
          color: ${C.inkSoft};
          font-size: 12px;
        }

        .cp-fp-login a {
          color: ${C.green};
          font-weight: 700;
          text-decoration: none;
        }

        .cp-fp-login a:hover {
          color: ${C.greenDark};
        }

        /* =================================================
           SUCCESS STATE
        ================================================= */

        .cp-fp-success {
          text-align: center;
        }

        .cp-fp-success-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: ${C.greenSoft};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }

        .cp-fp-success h2 {
          margin: 0 0 9px;
          font-family: Manrope, sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .cp-fp-success-message {
          margin: 0 0 6px;
          color: ${C.inkSoft};
          font-size: 13px;
          line-height: 1.55;
        }

        .cp-fp-success-note {
          margin: 0 0 20px;
          color: #9BA29C;
          font-size: 11.5px;
        }

        .cp-fp-retry {
          width: 100%;
          height: 44px;
          border: 1.5px solid ${C.green};
          border-radius: 9px;
          background: transparent;
          color: ${C.green};
          font-family: Inter, sans-serif;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .cp-fp-retry:hover {
          background: ${C.greenSoft};
        }

        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 480px) {

          .cp-fp-page {
            padding: 25px 15px;
          }

          .cp-fp-card {
            padding: 28px 22px 25px;
            border-radius: 15px;
          }

          .cp-fp-heading h1 {
            font-size: 25px;
          }

          .cp-fp-heading p {
            font-size: 12px;
          }

        }

      `}</style>

    </div>
  )
}
