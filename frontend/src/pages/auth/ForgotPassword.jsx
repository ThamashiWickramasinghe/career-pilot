import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../utils/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Career Pilot</h1>
          <p className="text-gray-500 mt-2">Reset your password</p>
        </div>

        {!sent ? (
          <>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Check your email!</h3>
            <p className="text-gray-500 text-sm">{message}</p>
            <p className="text-gray-400 text-xs mt-4">
              Didn't receive it? Check your spam folder.
            </p>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}