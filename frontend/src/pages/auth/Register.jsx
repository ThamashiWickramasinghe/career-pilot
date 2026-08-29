import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../../utils/api'

/* =========================================================
   CAREER PILOT — SIMPLE REGISTER PAGE
   (matches Login page design system)
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

  // Success
  success: '#3E8E5A',
  successBg: '#EAF7EF',
  successBorder: '#C7E9D3',
}

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
`

const POST_OPTIONS = [
  { group: 'Student', options: ['Undergraduate', 'Postgraduate'] },
  { group: 'Development', options: ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer'] },
  { group: 'Design', options: ['UI/UX Designer', 'Graphic Designer'] },
  { group: 'Data', options: ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer'] },
  { group: 'Infrastructure', options: ['DevOps Engineer', 'Cloud Engineer', 'Cybersecurity Analyst'] },
  { group: 'Other', options: ['QA Engineer', 'Project Manager', 'Business Analyst', 'IT Support'] },
]

/* =========================================================
   REGISTER
========================================================= */

export default function Register() {

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    current_post: '',
    role: 'job_seeker',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  /* =======================================================
     EXISTING REGISTER LOGIC
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await API.post('/auth/register', form)
      setSuccess(res.data?.message || 'Registration successful!')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed'
      )
    }

    setLoading(false)
  }

  return (
    <div className="cp-reg-page">

      <style>{fontImport}</style>

      {/* ===================================================
          REGISTER CARD
      =================================================== */}

      <div className="cp-reg-card">

        {/* Heading */}
        <div className="cp-reg-heading">

          <h1>
            Create account
          </h1>

          <p>
            Join Career Pilot to start your journey.
          </p>

        </div>

        {/* Success */}
        {success && (
          <div className="cp-reg-success">
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="cp-reg-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Full Name + Username */}
          <div className="cp-reg-row">

            <div className="cp-reg-field">
              <label>
                Full name
              </label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    full_name: e.target.value,
                  })
                }
                placeholder="Enter your name"
              />
            </div>

            <div className="cp-reg-field">
              <label>
                Username
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                placeholder="Enter a username"
              />
            </div>

          </div>

          {/* Email */}
          <div className="cp-reg-field">
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

          {/* Current Post + Role */}
          <div className="cp-reg-row">

            <div className="cp-reg-field">
              <label>
                Current post
              </label>
              <select
                value={form.current_post}
                onChange={(e) =>
                  setForm({
                    ...form,
                    current_post: e.target.value,
                  })
                }
              >
                <option value="">Select post</option>
                {POST_OPTIONS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="cp-reg-field">
              <label>
                I am registering as
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
              >
                <option value="job_seeker">Job Seeker</option>
                <option value="instructor">Instructor</option>
                <option value="company">Company</option>
              </select>
            </div>

          </div>

          {/* Password + Confirm Password */}
          <div className="cp-reg-row">

            <div className="cp-reg-field">
              <label>
                Password
              </label>
              <div className="cp-reg-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  className="cp-reg-show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="cp-reg-field">
              <label>
                Confirm password
              </label>
              <div className="cp-reg-password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={form.confirm_password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirm_password: e.target.value,
                    })
                  }
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  className="cp-reg-show-password"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={loading}
            className="cp-reg-button"
          >
            {loading
              ? 'Creating account...'
              : 'Create account'}
          </button>

        </form>

        {/* Divider */}
        <div className="cp-reg-divider">
          <span />
          <small>Career Pilot</small>
          <span />
        </div>

        {/* Login */}
        <p className="cp-reg-login">

          Already have an account?{' '}

          <Link to="/login">
            Sign in
          </Link>

        </p>

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

        .cp-reg-page {
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
           REGISTER CARD
        ================================================= */

        .cp-reg-card {
          width: 100%;
          max-width: 520px;
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

        .cp-reg-heading {
          margin-bottom: 25px;
        }

        .cp-reg-heading h1 {
          margin: 0 0 7px;
          font-family: Manrope, sans-serif;
          font-size: 28px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .cp-reg-heading p {
          margin: 0;
          color: ${C.inkSoft};
          font-size: 13px;
          line-height: 1.55;
        }

        /* =================================================
           SUCCESS
        ================================================= */

        .cp-reg-success {
          background: ${C.successBg};
          border: 1px solid ${C.successBorder};
          color: ${C.success};
          border-radius: 9px;
          padding: 10px 12px;
          margin-bottom: 18px;
          font-size: 12px;
          line-height: 1.4;
          font-weight: 600;
        }

        /* =================================================
           ERROR
        ================================================= */

        .cp-reg-error {
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
           ROWS / FIELDS
        ================================================= */

        .cp-reg-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .cp-reg-field {
          margin-bottom: 17px;
        }

        .cp-reg-field label {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 700;
          color: ${C.ink};
        }

        .cp-reg-field input,
        .cp-reg-field select {
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
          appearance: auto;
        }

        .cp-reg-field input::placeholder {
          color: #A3AAA4;
        }

        .cp-reg-field input:focus,
        .cp-reg-field select:focus {
          border-color: ${C.green};
          box-shadow:
            0 0 0 3px rgba(63,107,79,0.08);
        }

        /* =================================================
           PASSWORD
        ================================================= */

        .cp-reg-password-wrapper {
          position: relative;
        }

        .cp-reg-password-wrapper input {
          padding-right: 55px;
        }

        .cp-reg-show-password {
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

        .cp-reg-show-password:hover {
          transform: translateY(-50%);
          color: ${C.greenDark};
        }

        /* =================================================
           REGISTER BUTTON
        ================================================= */

        .cp-reg-button {
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

        .cp-reg-button:hover:not(:disabled) {
          background: ${C.greenDark};
          transform: translateY(-1px);
        }

        .cp-reg-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* =================================================
           DIVIDER
        ================================================= */

        .cp-reg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 25px 0 20px;
        }

        .cp-reg-divider span {
          flex: 1;
          height: 1px;
          background: ${C.border};
        }

        .cp-reg-divider small {
          color: #9BA29C;
          font-size: 9.5px;
        }

        /* =================================================
           LOGIN LINK
        ================================================= */

        .cp-reg-login {
          margin: 0;
          text-align: center;
          color: ${C.inkSoft};
          font-size: 12px;
        }

        .cp-reg-login a {
          color: ${C.green};
          font-weight: 700;
          text-decoration: none;
        }

        .cp-reg-login a:hover {
          color: ${C.greenDark};
        }

        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 560px) {

          .cp-reg-page {
            padding: 25px 15px;
          }

          .cp-reg-card {
            padding: 28px 22px 25px;
            border-radius: 15px;
          }

          .cp-reg-heading h1 {
            font-size: 25px;
          }

          .cp-reg-heading p {
            font-size: 12px;
          }

          .cp-reg-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

        }

      `}</style>

    </div>
  )
}