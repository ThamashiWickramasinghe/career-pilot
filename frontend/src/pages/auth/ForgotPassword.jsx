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
            🔐
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Forgot Password?</h1>
          <p className="text-green-100 text-base leading-relaxed max-w-xs mx-auto mb-10">
            No worries! We'll send you a secure reset link to your email instantly.
          </p>

          {/* Steps */}
          <div className="space-y-5 text-left max-w-xs mx-auto">
            {[
              { icon: '📧', title: 'Enter your email', desc: 'Type the email you registered with' },
              { icon: '📬', title: 'Check your inbox', desc: 'We send a secure reset link instantly' },
              { icon: '🔗', title: 'Click the link', desc: 'Opens the password reset page' },
              { icon: '🔑', title: 'Set new password', desc: 'Choose a strong new password' },
              { icon: '✅', title: 'Sign in again', desc: 'Login with your new password' },
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

          {!sent ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                <p className="text-gray-500 mt-2">
                  Enter your email and we'll send you a reset link
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
                    Email Address
                  </label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  {loading ? 'Sending...' : 'Send Reset Link →'}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"
                style={{background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)'}}>
                📧
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Check your inbox!</h2>
              <p className="text-gray-500 mb-2 text-sm">{message}</p>
              <p className="text-gray-400 text-xs">
                Didn't receive it? Check your spam folder.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-5 text-sm font-medium px-5 py-2 rounded-xl border-2 border-teal-500 text-teal-600 hover:bg-teal-50 transition">
                Try a different email
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-8">
            Remember your password?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}