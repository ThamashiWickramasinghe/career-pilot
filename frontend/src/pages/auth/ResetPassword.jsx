import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../../utils/api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm_password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/reset-password', { ...form, token })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Career Pilot</h1>
          <p className="text-gray-500 mt-2">Set new password</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Password Reset!</h3>
            <p className="text-gray-500 text-sm">Redirecting to login page...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Min. 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Re-enter new password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}