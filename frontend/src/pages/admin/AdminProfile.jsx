import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

/* ============================================================
   COLOUR THEME (matches AdminDashboard.jsx)
   ============================================================ */
const C = {
  bg: '#F4F7FB',

  card: '#FFFFFF',
  border: '#E4EAF2',

  ink: '#34445A',
  sub: '#7F8A9B',

  primary: '#6C93C7',
  primaryDark: '#587EAE',

  green: '#78B892',
  orange: '#E8B17C',
  red: '#D98C98',

  softPanel: '#F7F9FC',
  lightGreen: '#E8F3EC'
}

const primarySoft = 'rgba(108,147,199,0.12)'
const greenSoft = 'rgba(120,184,146,0.14)'
const orangeSoft = 'rgba(232,177,124,0.16)'
const redSoft = 'rgba(217,140,152,0.14)'

const cardShadow = 'none'

/* ============================================================
   INLINE SVG ICONS
   ============================================================ */

const Icon = ({ path, size = 18, color = 'currentColor', strokeWidth = 2 }) => (
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

const IconShield = (p) => (
  <Icon {...p} path={<><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></>} />
)

const IconCheckCircle = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.7 2.7L16 9.5" /></>} />
)

const IconAlertCircle = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16h.01" /></>} />
)

const IconX = (p) => (
  <Icon {...p} path={<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>} />
)

const IconLoader = (p) => (
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" className="animate-spin flex-shrink-0">
    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
    <path d="M21 12a9 9 0 00-9-9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

/* ============================================================
   ADMIN PROFILE
   ============================================================ */

export default function AdminProfile() {
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
    bio: '',
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
        bio: u.bio || '',
      })
    } catch (err) {
      if (user) {
        setForm({
          full_name: user.full_name || '',
          username: user.username || '',
          email: user.email || '',
          current_post: user.current_post || '',
          bio: user.bio || '',
        })
      }
    }

    setFetchLoading(false)
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await API.put('/auth/profile', form)
      setSuccess('Profile updated successfully!')
      setEditing(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }

    setLoading(false)
  }

  const handleCancel = () => {
    setEditing(false)
    setError('')
  }

  const inputStyle = {
    background: C.softPanel,
    border: `1px solid ${C.border}`,
    color: C.ink,
    '--tw-ring-color': C.primary,
  }

  if (fetchLoading) {
    return (
      <div className="h-screen flex items-center justify-center overflow-hidden" style={{ background: C.bg }}>
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-pulse"
            style={{ background: primarySoft }}
          >
            <IconShield size={22} color={C.primary} />
          </div>
          <p className="text-sm" style={{ color: C.sub }}>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="w-full max-w-4xl h-full mx-auto px-4 sm:px-5 py-3">

        {/* PAGE HEADER */}
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-bold" style={{ color: C.ink }}>My Profile</h1>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div
            className="mb-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2"
            style={{ background: greenSoft, color: '#4E7D61' }}
          >
            <IconCheckCircle size={15} color="#3F7A22" />
            <span>{success}</span>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div
            className="mb-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2"
            style={{ background: orangeSoft, color: '#A56F3E' }}
          >
            <IconAlertCircle size={15} color="#B45309" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto" style={{ color: '#A56F3E' }}>
              <IconX size={13} color="#B45309" />
            </button>
          </div>
        )}

        {/* PROFILE CARD (READ-ONLY VIEW) */}
        {!editing && (
          <div className="h-full rounded-2xl overflow-y-auto" style={{ background: C.card, boxShadow: cardShadow }}>
            <div className="p-5">

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  
                  <div>
                    <h3 className="text-base font-bold" style={{ color: C.ink }}>Personal Information</h3>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="text-xs px-3 py-1.5 rounded-lg text-white font-medium transition"
                  style={{ background: C.primary }}
                >
                  Edit
                </button>
              </div>

              {/* INFORMATION GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div className="p-3 rounded-xl border" style={{ background: C.softPanel, borderColor: C.border }}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Full Name</p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>{form.full_name || 'Not set'}</p>
                </div>

                <div className="p-3 rounded-xl border" style={{ background: C.softPanel, borderColor: C.border }}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Username</p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>{form.username ? `@${form.username}` : 'Not set'}</p>
                </div>

                <div className="p-3 rounded-xl border" style={{ background: C.softPanel, borderColor: C.border }}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Email Address</p>
                  <p className="text-xs font-semibold break-all" style={{ color: C.ink }}>{form.email || 'Not set'}</p>
                </div>

                <div className="p-3 rounded-xl border" style={{ background: C.softPanel, borderColor: C.border }}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Current Post</p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>{form.current_post || 'Not set'}</p>
                </div>

                <div className="p-3 rounded-xl border md:col-span-2" style={{ background: C.softPanel, borderColor: C.border }}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Account Type</p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>Administrator</p>
                </div>

              </div>

              {/* ABOUT ME */}
              <div className="mt-3 p-3 rounded-xl border" style={{ background: C.softPanel, borderColor: C.border }}>
                <p className="text-[11px] mb-1" style={{ color: C.sub }}>About Me</p>
                <p className="text-xs leading-5" style={{ color: C.ink }}>
                  {form.bio || 'No biography has been added yet.'}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* EDIT PROFILE SECTION */}
        {editing && (
          <div className="h-full rounded-2xl p-5 overflow-y-auto" style={{ background: C.card, boxShadow: cardShadow }}>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold" style={{ color: C.ink }}>Edit Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={inputStyle}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={inputStyle}
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={inputStyle}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>Current Post</label>
                <input
                  type="text"
                  value={form.current_post}
                  onChange={(e) => handleChange('current_post', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={inputStyle}
                  placeholder="e.g. Platform Administrator"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>About Me</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 resize-none"
                  style={inputStyle}
                  placeholder="Tell your team a little about yourself..."
                />
              </div>

            </div>

            {/* BOTTOM BUTTONS */}
            <div className="flex justify-end gap-2 mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-xs font-medium transition"
                style={{ border: `1px solid ${C.border}`, color: C.sub, background: C.card }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50 transition flex items-center gap-2"
                style={{ background: C.primary }}
              >
                {loading ? <IconLoader size={13} /> : null}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}