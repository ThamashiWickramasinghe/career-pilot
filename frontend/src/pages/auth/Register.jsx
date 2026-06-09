import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../../utils/api'

const POST_OPTIONS = [
  { group: '👨‍🎓 Student', options: ['Undergraduate', 'Postgraduate'] },
  { group: '💻 Development', options: ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer'] },
  { group: '🎨 Design', options: ['UI/UX Designer', 'Graphic Designer'] },
  { group: '📊 Data', options: ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer'] },
  { group: '☁️ Infrastructure', options: ['DevOps Engineer', 'Cloud Engineer', 'Cybersecurity Analyst'] },
  { group: '🔍 Other', options: ['QA Engineer', 'Project Manager', 'Business Analyst', 'IT Support'] },
]

export default function Register() {
  const [form, setForm] = useState({
    full_name: '', username: '', email: '',
    password: '', confirm_password: '',
    current_post: '', role: 'job_seeker'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
            🚀
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Career Pilot</h1>
          <p className="text-green-100 text-base leading-relaxed max-w-xs mx-auto mb-10">
            Join thousands of professionals building their dream careers
          </p>

          {/* Feature list */}
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

      {/* Right Side — Register Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-lg py-8">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold text-teal-700 mt-2">Career Pilot</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create account</h2>
            <p className="text-gray-500 mt-2">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name + Username */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text" required value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition"
                  placeholder="Enter Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text" required value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition"
                  placeholder="Enter User Name"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Current Post + Role */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Current Post
                </label>
                <select
                  value={form.current_post}
                  onChange={(e) => setForm({ ...form, current_post: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                  <option value="">Select post</option>
                  {POST_OPTIONS.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  I am registering as
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                  <option value="job_seeker">Job Seeker</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
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
                  Confirm Password
                </label>
                <input
                  type="password" required value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 mt-2"
              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}