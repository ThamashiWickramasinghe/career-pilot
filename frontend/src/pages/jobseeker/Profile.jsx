import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

/* ============================================================
   COLOUR THEME (matches JobSeekerDashboard.jsx `C` tokens)
   ============================================================ */
const C = {
  bg: '#F8F4F8',
  sidebar: '#6F5872',

  panel: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E5DDE6',

  ink: '#2E2730',
  sub: '#857A87',

  accent: '#9B7FA0',
  accentDark: '#765C7A',
  accentSoft: '#DBBCD4',

  teal: '#9B7FA0',
  tealDark: '#6F5872',
  tealSoft: '#DBBCD4',
  tealLight: '#F8F3F8',

  green: '#6E9B86',
  greenSoft: '#E3F1E9',

  orange: '#B88655',
  orangeSoft: '#F7EBDD',

  purple: '#9B7FA0',
  purpleSoft: '#DBBCD4',

  pink: '#A76C88',
  pinkSoft: '#F3E2EA',

  blue: '#7D89B8',
  blueSoft: '#E9ECF7',

  softPanel: '#F5F0F5'
}

const cardShadow =
  '0 2px 8px rgba(74, 69, 130, 0.06), 0 1px 3px rgba(74, 69, 130, 0.04)'

const SKILL_PALETTE = [
  { bg: C.purpleSoft, color: C.accentDark },
  { bg: C.blueSoft, color: C.blue },
  { bg: C.greenSoft, color: C.green }
]

/* ============================================================
   INLINE SVG ICONS
   ============================================================ */

const Icon = ({ path, size = 16, color = 'currentColor', strokeWidth = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-shrink-0"
  >
    {path}
  </svg>
)

const IconUser = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      </>
    }
  />
)

const IconCheckCircle = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M9 12.75L11.25 15 15 9.75" />
        <circle cx="12" cy="12" r="9" />
      </>
    }
  />
)

const IconAlert = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </>
    }
  />
)

const IconX = (p) => (
  <Icon {...p} path={<path d="M18 6L6 18M6 6l12 12" />} />
)

export default function Profile() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    current_post: '',
    skills: '',
    bio: '',
    experience_years: 0,
    github: '',
    linkedin: '',
    portfolio: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setFetchLoading(true)

    try {
      const res = await API.get('/auth/profile')
      const u = res.data.user

      setForm({
        full_name: u.full_name || '',
        username: u.username || '',
        email: u.email || '',
        current_post: u.current_post || '',
        skills: u.skills || '',
        bio: u.bio || '',
        experience_years: u.experience_years || 0,
        github: u.github || '',
        linkedin: u.linkedin || '',
        portfolio: u.portfolio || '',
      })
    } catch (err) {
      // Fallback to auth context user
      if (user) {
        setForm({
          full_name: user.full_name || '',
          username: user.username || '',
          email: user.email || '',
          current_post: user.current_post || '',
          skills: user.skills || '',
          bio: user.bio || '',
          experience_years: user.experience_years || 0,
          github: user.github || '',
          linkedin: user.linkedin || '',
          portfolio: user.portfolio || '',
        })
      }
    }

    setFetchLoading(false)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await API.put('/auth/profile', form)

      setSuccess('Profile updated successfully!')
      setEditing(false)

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to update profile'
      )
    }

    setLoading(false)
  }

  const handleCancel = () => {
    setEditing(false)
    setError('')
  }

  const skills = form.skills
    ? form.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean)
    : []

  const fieldStyle = {
    background: C.softPanel,
    border: `1px solid ${C.border}`,
    color: C.ink,
    '--tw-ring-color': C.accent,
  }

  const infoCardStyle = {
    background: C.softPanel,
    borderColor: C.border,
  }

  if (fetchLoading) {
    return (
      <div
        className="h-screen flex items-center justify-center overflow-hidden"
        style={{ background: C.bg }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center animate-pulse"
            style={{ background: C.purpleSoft }}
          >
            <IconUser size={22} color={C.accentDark} />
          </div>

          <p
            className="text-sm"
            style={{ color: C.sub }}
          >
            Loading profile...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="w-full max-w-4xl h-full mx-auto px-4 sm:px-5 py-3">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="flex items-center gap-3 mb-3">
          <h1
            className="text-2xl font-bold"
            style={{ color: C.ink }}
          >
            My Profile
          </h1>
        </div>

        {/* =====================================================
            SUCCESS MESSAGE
        ====================================================== */}
        {success && (
          <div
            className="mb-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2"
            style={{
              background: C.greenSoft,
              color: C.green,
            }}
          >
            <IconCheckCircle size={15} color={C.green} />
            <span>{success}</span>
          </div>
        )}

        {/* =====================================================
            ERROR MESSAGE
        ====================================================== */}
        {error && (
          <div
            className="mb-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2"
            style={{
              background: C.orangeSoft,
              color: C.orange,
            }}
          >
            <IconAlert size={15} color={C.orange} />

            <span>{error}</span>

            <button
              onClick={() => setError('')}
              className="ml-auto"
              style={{ color: C.orange }}
            >
              <IconX size={13} color={C.orange} />
            </button>
          </div>
        )}

        {/* =====================================================
            PERSONAL INFORMATION CARD
        ====================================================== */}
        {!editing && (
          <div
            className="h-full rounded-2xl overflow-y-auto"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              boxShadow: cardShadow,
            }}
          >
            <div className="p-5">

              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-base font-bold flex items-center gap-2"
                  style={{ color: C.ink }}
                >
                  Personal Information
                </h3>

                <button
                  onClick={() => setEditing(true)}
                  className="text-xs px-3 py-1.5 rounded-lg text-white font-medium hover:shadow-md transition"
                  style={{
                    background: `linear-gradient(135deg, ${C.tealDark} 0%, ${C.teal} 100%)`,
                  }}
                >
                  Edit
                </button>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Full Name */}
                <div className="p-3 rounded-xl border" style={infoCardStyle}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>
                    Full Name
                  </p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>
                    {form.full_name || 'Not set'}
                  </p>
                </div>

                {/* Username */}
                <div className="p-3 rounded-xl border" style={infoCardStyle}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>
                    Username
                  </p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>
                    {form.username ? `@${form.username}` : 'Not set'}
                  </p>
                </div>

                {/* Email */}
                <div className="p-3 rounded-xl border" style={infoCardStyle}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>
                    Email Address
                  </p>
                  <p className="text-xs font-semibold break-all" style={{ color: C.ink }}>
                    {form.email || 'Not set'}
                  </p>
                </div>

                {/* Current Role */}
                <div className="p-3 rounded-xl border" style={infoCardStyle}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>
                    Current Role / Post
                  </p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>
                    {form.current_post || 'Not set'}
                  </p>
                </div>

                {/* Experience */}
                <div className="p-3 rounded-xl border" style={infoCardStyle}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>
                    Years of Experience
                  </p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>
                    {form.experience_years || 0}{' '}
                    {Number(form.experience_years) === 1 ? 'year' : 'years'}
                  </p>
                </div>

                {/* Account Type */}
                <div className="p-3 rounded-xl border" style={infoCardStyle}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>
                    Account Type
                  </p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>
                    Job Seeker
                  </p>
                </div>

              </div>

              {/* BIO */}
              <div className="mt-3 p-3 rounded-xl border" style={infoCardStyle}>
                <p className="text-[11px] mb-1" style={{ color: C.sub }}>
                  About Me
                </p>
                <p className="text-xs leading-5" style={{ color: C.ink }}>
                  {form.bio || 'No biography has been added yet.'}
                </p>
              </div>

              {/* SKILLS */}
              <div className="mt-3 p-3 rounded-xl border" style={infoCardStyle}>
                <p className="text-[11px] mb-2" style={{ color: C.sub }}>
                  Skills
                </p>

                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, index) => {
                      const palette = SKILL_PALETTE[index % SKILL_PALETTE.length]

                      return (
                        <span
                          key={index}
                          className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: palette.bg,
                            color: palette.color,
                          }}
                        >
                          {skill}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: C.sub }}>
                    No skills added yet.
                  </p>
                )}
              </div>

              {/* SOCIAL / PORTFOLIO */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl border" style={infoCardStyle}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>
                    GitHub
                  </p>
                  <p className="text-xs font-medium break-all" style={{ color: C.ink }}>
                    {form.github || 'Not added'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border" style={infoCardStyle}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>
                    LinkedIn
                  </p>
                  <p className="text-xs font-medium break-all" style={{ color: C.ink }}>
                    {form.linkedin || 'Not added'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border" style={infoCardStyle}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>
                    Portfolio
                  </p>
                  <p className="text-xs font-medium break-all" style={{ color: C.ink }}>
                    {form.portfolio || 'Not added'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =====================================================
            EDIT PROFILE SECTION
        ====================================================== */}
        {editing && (
          <div
            className="h-full rounded-2xl p-5 overflow-y-auto"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              boxShadow: cardShadow,
            }}
          >
            {/* Edit Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2
                className="text-lg font-bold"
                style={{ color: C.ink }}
              >
                Edit Profile
              </h2>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => handleChange('full_name', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={fieldStyle}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  Username
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => handleChange('username', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={fieldStyle}
                  placeholder="Enter username"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={fieldStyle}
                  placeholder="Enter email address"
                />
              </div>

              {/* Current Role */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  Current Role / Post
                </label>
                <input
                  type="text"
                  value={form.current_post}
                  onChange={e => handleChange('current_post', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={fieldStyle}
                  placeholder="e.g. Frontend Developer"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  Years of Experience
                </label>
                <select
                  value={form.experience_years}
                  onChange={e => handleChange('experience_years', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={fieldStyle}
                >
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>
                      {n === 0 ? 'Fresher / No Experience' : `${n} ${n === 1 ? 'year' : 'years'}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  Skills
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={e => handleChange('skills', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={fieldStyle}
                  placeholder="Python, React, SQL, JavaScript"
                />
                <p className="text-[10px] mt-1" style={{ color: C.sub }}>
                  Separate skills using commas
                </p>
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={form.github}
                  onChange={e => handleChange('github', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={fieldStyle}
                  placeholder="github.com/yourusername"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={form.linkedin}
                  onChange={e => handleChange('linkedin', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={fieldStyle}
                  placeholder="linkedin.com/in/yourusername"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  Portfolio URL
                </label>
                <input
                  type="text"
                  value={form.portfolio}
                  onChange={e => handleChange('portfolio', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={fieldStyle}
                  placeholder="yourportfolio.com"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>
                  About Me / Bio
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 resize-none"
                  style={fieldStyle}
                  placeholder="Tell us a little about yourself..."
                />
              </div>

            </div>

            {/* Bottom Buttons */}
            <div
              className="flex justify-end gap-2 mt-4 pt-4"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-xs font-medium transition"
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.sub,
                  background: C.card,
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50 transition hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${C.tealDark} 0%, ${C.teal} 100%)`,
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
