import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

/* ============================================================
   COLOUR THEME (matches CompanyDashboard.jsx)
   ============================================================ */
const C = {
  bg: '#EAF7FC',

  card: '#FFFFFF',
  border: '#D8EAF2',

  ink: '#12344D',
  sub: '#64748B',

  primary: '#075985',
  primaryDark: '#064E73',
  primarySoft: '#E0F2FE',

  light: '#0EA5D9',
  lightSoft: '#E0F6FD',

  green: '#16A34A',
  greenSoft: '#DCFCE7',

  orange: '#F97316',
  orangeSoft: '#FFEDD5',

  red: '#DC2626',
  redSoft: '#FEE2E2',

  softPanel: '#F4FAFD'
}

const cardShadow =
  '0 2px 8px rgba(6, 78, 115, 0.06), 0 1px 3px rgba(6, 78, 115, 0.04)'

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

const IconBuilding = (p) => (
  <Icon {...p} path={<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /><path d="M10 21v-3h4v3" /></>} />
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
   COMPANY PROFILE
   ============================================================ */

export default function CompanyProfile() {
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
    company_name: '',
    company_website: '',
    company_location: '',
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
        company_name: u.company_name || '',
        company_website: u.company_website || '',
        company_location: u.company_location || '',
        bio: u.bio || '',
      })
    } catch (err) {
      if (user) {
        setForm({
          full_name: user.full_name || '',
          username: user.username || '',
          email: user.email || '',
          company_name: user.company_name || '',
          company_website: user.company_website || '',
          company_location: user.company_location || '',
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
      setSuccess('Company profile updated successfully!')
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
            style={{ background: C.primarySoft }}
          >
            <IconBuilding size={22} color={C.primary} />
          </div>
          <p className="text-sm" style={{ color: C.sub }}>Loading company profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="w-full max-w-4xl h-full mx-auto px-4 sm:px-5 py-3">

        {/* PAGE HEADER */}
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-bold" style={{ color: C.ink }}>Company Profile</h1>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div
            className="mb-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2"
            style={{ background: C.greenSoft, color: C.green }}
          >
            <IconCheckCircle size={15} color={C.green} />
            <span>{success}</span>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div
            className="mb-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2"
            style={{ background: C.orangeSoft, color: '#B45309' }}
          >
            <IconAlertCircle size={15} color="#B45309" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto" style={{ color: '#B45309' }}>
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
                    <h3 className="text-base font-bold" style={{ color: C.ink }}>Company Information</h3>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="text-xs px-3 py-1.5 rounded-lg text-white font-medium hover:shadow-md transition"
                  style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                >
                  Edit
                </button>
              </div>

              {/* INFORMATION GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div className="p-3 rounded-xl border" style={{ background: C.softPanel, borderColor: C.border }}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Company Name</p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>{form.company_name || 'Not set'}</p>
                </div>

                <div className="p-3 rounded-xl border" style={{ background: C.softPanel, borderColor: C.border }}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Contact Person</p>
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
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Website</p>
                  <p className="text-xs font-semibold break-all" style={{ color: C.ink }}>{form.company_website || 'Not set'}</p>
                </div>

                <div className="p-3 rounded-xl border" style={{ background: C.softPanel, borderColor: C.border }}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Location</p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>{form.company_location || 'Not set'}</p>
                </div>

                <div className="p-3 rounded-xl border md:col-span-2" style={{ background: C.softPanel, borderColor: C.border }}>
                  <p className="text-[11px] mb-0.5" style={{ color: C.sub }}>Account Type</p>
                  <p className="text-xs font-semibold" style={{ color: C.ink }}>Company</p>
                </div>

              </div>

              {/* COMPANY DESCRIPTION */}
              <div className="mt-3 p-3 rounded-xl border" style={{ background: C.softPanel, borderColor: C.border }}>
                <p className="text-[11px] mb-1" style={{ color: C.sub }}>Company Description</p>
                <p className="text-xs leading-5" style={{ color: C.ink }}>
                  {form.bio || 'No company description has been added yet.'}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* EDIT PROFILE SECTION */}
        {editing && (
          <div className="h-full rounded-2xl p-5 overflow-y-auto" style={{ background: C.card, boxShadow: cardShadow }}>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold" style={{ color: C.ink }}>Edit Company Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>Company Name</label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={inputStyle}
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>Contact Person</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={inputStyle}
                  placeholder="Enter contact person's name"
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
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>Website</label>
                <input
                  type="text"
                  value={form.company_website}
                  onChange={(e) => handleChange('company_website', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={inputStyle}
                  placeholder="yourcompany.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>Location</label>
                <input
                  type="text"
                  value={form.company_location}
                  onChange={(e) => handleChange('company_location', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2"
                  style={inputStyle}
                  placeholder="e.g. Colombo, Sri Lanka"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1" style={{ color: C.ink }}>Company Description</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 resize-none"
                  style={inputStyle}
                  placeholder="Tell candidates a little about your company..."
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
                className="px-6 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50 transition hover:shadow-lg flex items-center gap-2"
                style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
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
