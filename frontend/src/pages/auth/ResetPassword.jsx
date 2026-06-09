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
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
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
    <div className="min-h-screen flex">

      {/* Left Side — Abstract Gradient */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center px-12 text-center"
        style={{background: 'linear-gradient(135deg, #0f4c35 0%, #1a7a5e 30%, #22c55e 60%, #10b981 80%, #06b6d4 100%)'}}>

        {/* Background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-20"
          style={{background: 'radial-gradient(circle, #ffffff, transparent)'}}></div>
        <div className="absolute bottom-[-100px] right-[-60px] w-80 h-80 rounded-full opacity-15"
          style={{background: 'radial-gradient(circle, #06b6d4, transparent)'}}></div>
        <div className="absolute top-1/3 right-[-40px] w-60 h-60 rounded-full opacity-10"
          style={{background: 'radial-gradient(circle, #ffffff, transparent)'}}></div>

        <div className="relative z-10 w-full">
          {/* Logo */}
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center text-4xl mb-5 mx-auto backdrop-blur-sm border border-white border-opacity-30">
            🔑
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Set New Password</h1>
          <p className="text-green-100 text-base leading-relaxed max-w-xs mx-auto mb-10">
            Choose a strong password to keep your Career Pilot account secure
          </p>

          {/* Password tips */}
          <div className="space-y-5 text-left max-w-xs mx-auto">
            {[
              { icon: '✅', title: 'At least 6 characters', desc: 'Longer passwords are more secure' },
              { icon: '🔤', title: 'Mix letters and numbers', desc: 'Combine uppercase, lowercase & digits' },
              { icon: '🔒', title: 'Avoid common words', desc: "Don't use your name or birthday" },
              { icon: '🔄', title: 'Never reuse passwords', desc: 'Use a unique password for each account' },
              { icon: '🛡️', title: 'Keep it private', desc: 'Never share your password with anyone' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="text-2xl mt-0.5 flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-green-200 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold text-teal-700 mt-2">Career Pilot</h1>
          </div>

          {success ? (
            /* Success State */
            <div className="text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"
                style={{background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)'}}>
                ✅
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Password Reset Successful!
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                Your password has been updated successfully.
              </p>
              <p className="text-gray-400 text-xs">
                Redirecting to login page in 3 seconds...
              </p>
              <Link
                to="/login"
                className="inline-block mt-6 px-6 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                Go to Login →
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">New Password</h2>
                <p className="text-gray-500 mt-2">
                  Enter and confirm your new password below
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password" required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition"
                    placeholder="Min. 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password" required value={form.confirm_password}
                    onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition"
                    placeholder="Re-enter new password"
                  />
                </div>

                {/* Password strength indicator */}
                {form.password && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Password strength</span>
                      <span className={
                        form.password.length >= 10 ? 'text-green-600 font-medium' :
                        form.password.length >= 6 ? 'text-yellow-600 font-medium' :
                        'text-red-500 font-medium'
                      }>
                        {form.password.length >= 10 ? 'Strong' :
                         form.password.length >= 6 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: form.password.length >= 10 ? '100%' :
                                 form.password.length >= 6 ? '60%' : '25%',
                          background: form.password.length >= 10 ? '#10b981' :
                                      form.password.length >= 6 ? '#f59e0b' : '#ef4444'
                        }}>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  {loading ? 'Resetting...' : 'Reset Password →'}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-8">
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">
              ← Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}