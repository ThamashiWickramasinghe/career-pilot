import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

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

  if (fetchLoading) {
    return (
      <div
        className="h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#fdf4ff' }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">
            👤
          </div>

          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
     
    >
      <div className="w-full max-w-4xl h-full mx-auto px-4 sm:px-5 py-3">

        {/* =====================================================
            SUCCESS MESSAGE
        ====================================================== */}
        {success && (
          <div
            className="mb-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2"
            style={{
              background: '#D0F4E0',
              color: '#065f46',
            }}
          >
            <span>✅</span>
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
              background: '#fee2e2',
              color: '#dc2626',
            }}
          >
            <span>⚠️</span>

            <span>{error}</span>

            <button
              onClick={() => setError('')}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* =====================================================
            PERSONAL INFORMATION CARD
        ====================================================== */}
        {!editing && (
          <div className="h-full bg-white rounded-2xl shadow-sm overflow-y-auto">

            {/* Card Header */}
            <div
              className="relative overflow-hidden"
              style={{
                minHeight: '10px',
              }}
            >

              {/* Decorative circles */}
              <div
               
              />

              <div
                
              />

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Profile Avatar */}

                {/* Edit Button */}
              </div>
            </div>

            {/* =================================================
                PERSONAL INFORMATION
            ================================================== */}
            <div className="p-5">

              <div className="flex items-center justify-between mb-3">

                <div>
                  <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    Personal Information
                  </h3>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="text-xs px-3 py-1.5 rounded-lg text-white font-medium hover:shadow-md transition"
                  style={{
                    background: '#7f3e8b',
                  }}
                >
                  Edit
                </button>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Full Name */}
                <div
                  className="p-3 rounded-xl border border-gray-100"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    Full Name
                  </p>

                  <p className="text-xs font-semibold text-gray-800">
                    {form.full_name || 'Not set'}
                  </p>
                </div>

                {/* Username */}
                <div
                  className="p-3 rounded-xl border border-gray-100"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    Username
                  </p>

                  <p className="text-xs font-semibold text-gray-800">
                    {form.username
                      ? `@${form.username}`
                      : 'Not set'}
                  </p>
                </div>

                {/* Email */}
                <div
                  className="p-3 rounded-xl border border-gray-100"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    Email Address
                  </p>

                  <p className="text-xs font-semibold text-gray-800 break-all">
                    {form.email || 'Not set'}
                  </p>
                </div>

                {/* Current Role */}
                <div
                  className="p-3 rounded-xl border border-gray-100"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    Current Role / Post
                  </p>

                  <p className="text-xs font-semibold text-gray-800">
                    {form.current_post || 'Not set'}
                  </p>
                </div>

                {/* Experience */}
                <div
                  className="p-3 rounded-xl border border-gray-100"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    Years of Experience
                  </p>

                  <p className="text-xs font-semibold text-gray-800">
                    {form.experience_years || 0}{' '}
                    {Number(form.experience_years) === 1
                      ? 'year'
                      : 'years'}
                  </p>
                </div>

                {/* Account Type */}
                <div
                  className="p-3 rounded-xl border border-gray-100"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    Account Type
                  </p>

                  <p className="text-xs font-semibold text-gray-800">
                    Job Seeker
                  </p>
                </div>
              </div>

              {/* =================================================
                  BIO
              ================================================== */}
              <div
                className="mt-3 p-3 rounded-xl border border-gray-100"
                style={{
                  background: '#fdf4ff',
                }}
              >
                <p className="text-[11px] text-gray-400 mb-1">
                  About Me
                </p>

                <p className="text-xs text-gray-700 leading-5">
                  {form.bio ||
                    'No biography has been added yet.'}
                </p>
              </div>

              {/* =================================================
                  SKILLS
              ================================================== */}
              <div
                className="mt-3 p-3 rounded-xl border border-gray-100"
                style={{
                  background: '#fdf4ff',
                }}
              >
                <p className="text-[11px] text-gray-400 mb-2">
                  Skills
                </p>

                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background:
                            index % 3 === 0
                              ? '#E8C0FC'
                              : index % 3 === 1
                              ? '#A8DEFA'
                              : '#D0F4E0',

                          color:
                            index % 3 === 0
                              ? '#6b21a8'
                              : index % 3 === 1
                              ? '#1e40af'
                              : '#065f46',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    No skills added yet.
                  </p>
                )}
              </div>

              {/* =================================================
                  SOCIAL / PORTFOLIO
              ================================================== */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2.5">

                <div
                  className="p-3 rounded-xl border border-gray-100"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    GitHub
                  </p>

                  <p className="text-xs font-medium text-gray-700 break-all">
                    {form.github || 'Not added'}
                  </p>
                </div>

                <div
                  className="p-3 rounded-xl border border-gray-100"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    LinkedIn
                  </p>

                  <p className="text-xs font-medium text-gray-700 break-all">
                    {form.linkedin || 'Not added'}
                  </p>
                </div>

                <div
                  className="p-3 rounded-xl border border-gray-100"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    Portfolio
                  </p>

                  <p className="text-xs font-medium text-gray-700 break-all">
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
          <div className="h-full bg-white rounded-2xl p-5 shadow-sm overflow-y-auto">

            {/* Edit Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Edit Profile
                </h2>
              </div>

              <div className="flex gap-2">
              </div>

            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.full_name}
                  onChange={e =>
                    handleChange(
                      'full_name',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background: '#fdf4ff',
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Username
                </label>

                <input
                  type="text"
                  value={form.username}
                  onChange={e =>
                    handleChange(
                      'username',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background: '#fdf4ff',
                  }}
                  placeholder="Enter username"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={e =>
                    handleChange(
                      'email',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background: '#fdf4ff',
                  }}
                  placeholder="Enter email address"
                />
              </div>

              {/* Current Role */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Current Role / Post
                </label>

                <input
                  type="text"
                  value={form.current_post}
                  onChange={e =>
                    handleChange(
                      'current_post',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background: '#fdf4ff',
                  }}
                  placeholder="e.g. Frontend Developer"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>

                <select
                  value={form.experience_years}
                  onChange={e =>
                    handleChange(
                      'experience_years',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background: '#fdf4ff',
                  }}
                >
                  {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option
                      key={n}
                      value={n}
                    >
                      {n === 0
                        ? 'Fresher / No Experience'
                        : `${n} ${
                            n === 1
                              ? 'year'
                              : 'years'
                          }`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Skills
                </label>

                <input
                  type="text"
                  value={form.skills}
                  onChange={e =>
                    handleChange(
                      'skills',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background: '#fdf4ff',
                  }}
                  placeholder="Python, React, SQL, JavaScript"
                />

                <p className="text-[10px] text-gray-400 mt-1">
                  Separate skills using commas
                </p>
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>

                <input
                  type="text"
                  value={form.github}
                  onChange={e =>
                    handleChange(
                      'github',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background: '#fdf4ff',
                  }}
                  placeholder="github.com/yourusername"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>

                <input
                  type="text"
                  value={form.linkedin}
                  onChange={e =>
                    handleChange(
                      'linkedin',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background: '#fdf4ff',
                  }}
                  placeholder="linkedin.com/in/yourusername"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Portfolio URL
                </label>

                <input
                  type="text"
                  value={form.portfolio}
                  onChange={e =>
                    handleChange(
                      'portfolio',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background: '#fdf4ff',
                  }}
                  placeholder="yourportfolio.com"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  About Me / Bio
                </label>

                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={e =>
                    handleChange(
                      'bio',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  style={{
                    background: '#fdf4ff',
                  }}
                  placeholder="Tell us a little about yourself..."
                />
              </div>

            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">

              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50 transition hover:shadow-lg"
                style={{
                  background:
                    'linear-gradient(#7f3e8b)',
                }}
              >
                {loading
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}