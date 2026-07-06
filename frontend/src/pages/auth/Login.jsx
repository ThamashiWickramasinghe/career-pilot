import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/auth/login', form)
      login(res.data.user, res.data.token)
      const role = res.data.user.role
      if (role === 'admin') navigate('/admin/dashboard')
    else if (role === 'instructor') navigate('/instructor/dashboard')
    else if (role === 'company') navigate('/company/dashboard')
    else navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side — Abstract Gradient */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center px-12 text-center"
        style={{background: 'linear-gradient(135deg, #0f4c35 0%, #1a7a5e 30%, #22c55e 60%, #10b981 80%, #06b6d4 100%)'}}>

        {/* Abstract background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-20"
          style={{background: 'radial-gradient(circle, #ffffff, transparent)'}}></div>
        <div className="absolute bottom-[-100px] right-[-60px] w-80 h-80 rounded-full opacity-15"
          style={{background: 'radial-gradient(circle, #06b6d4, transparent)'}}></div>
        <div className="absolute top-1/3 right-[-40px] w-60 h-60 rounded-full opacity-10"
          style={{background: 'radial-gradient(circle, #ffffff, transparent)'}}></div>

        {/* Center content */}
        <div className="relative z-10 w-full">
          {/* Logo */}
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center text-4xl mb-5 mx-auto backdrop-blur-sm border border-white border-opacity-30">
            🚀
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Career Pilot</h1>
          <p className="text-green-100 text-base leading-relaxed max-w-xs mx-auto mb-10">
            Your AI-powered platform for smarter career decisions and faster growth
          </p>

          {/* Feature list — icon + text only, no boxes */}
          <div className="space-y-5 text-left max-w-xs mx-auto">
            {[
              { icon: '🤖', title: 'AI Job Matching', desc: 'Find jobs that perfectly match your skills' },
              { icon: '📊', title: 'Skill Gap Analysis', desc: 'Discover what skills you need to grow' },
              { icon: '🗺️', title: 'Career Roadmap', desc: 'Get a personalized step-by-step career path' },
              { icon: '🏆', title: 'Skill Challenges', desc: 'Test yourself and earn achievement badges' },
              { icon: '📚', title: 'Learning Hub', desc: 'Access curated courses and study materials' },
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

          {/* Stats */}
          <div className="flex gap-6 mt-10 justify-center">
            <div className="text-center">
              <p className="text-white text-2xl font-bold">500+</p>
              <p className="text-green-200 text-xs">Job Matches</p>
            </div>
            <div className="w-px bg-white bg-opacity-30"></div>
            <div className="text-center">
              <p className="text-white text-2xl font-bold">50+</p>
              <p className="text-green-200 text-xs">Courses</p>
            </div>
            <div className="w-px bg-white bg-opacity-30"></div>
            <div className="text-center">
              <p className="text-white text-2xl font-bold">100+</p>
              <p className="text-green-200 text-xs">Challenges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold text-teal-700 mt-2">Career Pilot</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome back!</h2>
            <p className="text-gray-500 mt-2">Sign in to continue your career journey</p>
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
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition"
                placeholder="Example@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password"
                className="text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}