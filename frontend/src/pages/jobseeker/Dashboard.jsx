import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function JobSeekerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  const [notifOpen, setNotifOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'ai-jobs', icon: '🤖', label: 'AI Job Match' },
    { id: 'roadmap', icon: '🗺️', label: 'Career Roadmap' },
    { id: 'learning', icon: '📚', label: 'Learning Hub' },
    { id: 'jobs', icon: '💼', label: 'Job Vacancy' },
    { id: 'challenges', icon: '🏆', label: 'Skill Challenges' },
    
  ]

  const notifications = [
    { id: 1, icon: '🤖', text: 'New job matches found for you!', time: '2 min ago', unread: true },
    { id: 2, icon: '📚', text: 'Your learning access expires in 3 days', time: '1 hr ago', unread: true },
    { id: 3, icon: '🏆', text: 'You earned a Python badge!', time: '2 hrs ago', unread: false },
    { id: 4, icon: '💼', text: 'Application status updated', time: '1 day ago', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="min-h-screen flex" style={{background: '#f0fdf4'}}>

      {/* ── LEFT SIDEBAR ── */}
<div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 overflow-y-auto"        style={{background: 'linear-gradient(180deg, #0f4c35 0%, #1a7a5e 50%, #0f766e 100%)'}}>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-white border-opacity-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-2xl flex-shrink-0">
              🚀
            </div>
            <span className="text-white font-bold text-lg leading-tight">Career Pilot</span>
          </div>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-white border-opacity-10">
          <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 border-2 border-white border-opacity-30"
    style={{background: 'linear-gradient(135deg, #10b981, #06b6d4)'}}>
    {user?.full_name?.charAt(0).toUpperCase()}
  </div>
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-sm truncate">{user?.full_name}</p>
              <p className="text-green-300 text-xs truncate">{user?.current_post || 'Job Seeker'}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
<nav className="flex-1 px-4 py-4 space-y-1">
  {navItems.map(item => (
    <button key={item.id}
      onClick={() => setActiveTab(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
        activeTab === item.id
          ? 'text-teal-800 font-semibold'
          : 'text-green-200 hover:bg-white hover:bg-opacity-90 hover:text-teal-800'
      }`}
      style={activeTab === item.id ? {background: 'white'} : {}}>
      <span className="text-lg flex-shrink-0">{item.icon}</span>
      <span className="flex-shrink-0">{item.label}</span>
      {activeTab === item.id && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{background: '#0f4c35'}}></div>
      )}
    </button>
  ))}
</nav>

        {/* Logout at bottom */}
        <div className="px-4 py-4 border-t border-white border-opacity-10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-200 transition">
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 lg:ml-64">

        {/* Top Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {navItems.find(n => n.id === activeTab)?.icon}{' '}
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-gray-400">Career Pilot Dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition text-lg">
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{background: '#10b981'}}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <span className="text-xs text-teal-600 font-medium cursor-pointer">Mark all read</span>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id}
                      className={`px-4 py-3 flex gap-3 items-start hover:bg-gray-50 cursor-pointer ${n.unread ? 'bg-teal-50' : ''}`}>
                      <span className="text-xl flex-shrink-0">{n.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                      {n.unread && (
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{background: '#10b981'}}></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

           
          </div>
        </div>

        {/* Page Body */}
        <div className="p-6">

          {/* ── HOME ── */}
          {activeTab === 'home' && (
            <div>
              {/* Welcome Banner */}
              <div className="rounded-2xl p-8 mb-6 text-white relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #0f4c35 0%, #1a7a5e 40%, #10b981 80%, #06b6d4 100%)'}}>
                <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full opacity-10"
                  style={{background: 'radial-gradient(circle, #ffffff, transparent)'}}></div>
                <div className="absolute bottom-[-30px] left-1/3 w-48 h-48 rounded-full opacity-10"
                  style={{background: 'radial-gradient(circle, #06b6d4, transparent)'}}></div>
                <div className="relative z-10">
                  <p className="text-green-200 text-sm font-medium mb-1">Welcome back 👋</p>
                  <h1 className="text-3xl font-bold mb-2">{user?.full_name}</h1>
                  <p className="text-green-100 text-sm">{user?.current_post || 'Job Seeker'} · Building your career journey</p>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setActiveTab('ai-jobs')}
                      className="bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition">
                      🤖 Find Jobs
                    </button>
                    <button onClick={() => setActiveTab('roadmap')}
                      className="bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition">
                      🗺️ My Roadmap
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: '🎯', label: 'Job Matches', value: '12', bg: '#d1fae5', color: '#065f46' },
                  { icon: '📊', label: 'Skills Gap', value: '5', bg: '#cffafe', color: '#164e63' },
                  { icon: '🏆', label: 'Badges Earned', value: '3', bg: '#fef3c7', color: '#92400e' },
                  { icon: '📚', label: 'Courses Active', value: '2', bg: '#ede9fe', color: '#4c1d95' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3"
                      style={{background: stat.bg}}>
                      {stat.icon}
                    </div>
                    <p className="text-3xl font-bold" style={{color: stat.color}}>{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AI Job Matches */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">🤖 AI Job Matches</h2>
                    <button onClick={() => setActiveTab('ai-jobs')}
                      className="text-sm text-teal-600 font-medium hover:underline">See all</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'Frontend Developer', company: 'TechCorp Lanka', match: 92, skills: ['React', 'JavaScript'], color: '#d1fae5' },
                      { title: 'UI/UX Designer', company: 'Creative Studio', match: 85, skills: ['Figma', 'CSS'], color: '#cffafe' },
                      { title: 'Full Stack Developer', company: 'StartupX', match: 78, skills: ['Node.js', 'Python'], color: '#fef3c7' },
                    ].map((job, i) => (
                      <div key={i}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer border border-gray-100">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{background: job.color}}>
                          💼
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{job.title}</p>
                          <p className="text-xs text-gray-500 mb-1">{job.company}</p>
                          <div className="flex gap-1">
                            {job.skills.map(s => (
                              <span key={s}
                                className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold"
                            style={{color: job.match >= 90 ? '#10b981' : job.match >= 80 ? '#f59e0b' : '#6b7280'}}>
                            {job.match}%
                          </div>
                          <div className="text-xs text-gray-400">match</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenge Score */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">🏆 Challenge Score</h2>
                    <button onClick={() => setActiveTab('challenges')}
                      className="text-sm text-teal-600 font-medium hover:underline">View all</button>
                  </div>
                  <div className="flex flex-col items-center mb-5">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg"
                      style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                      780
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Total Score</p>
                    <p className="text-xs text-gray-400">Top 15% of users</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { badge: '🐍', name: 'Python Pro', level: 'Intermediate', bg: '#fef3c7' },
                      { badge: '⚛️', name: 'React Basics', level: 'Beginner', bg: '#cffafe' },
                      { badge: '🗄️', name: 'SQL Master', level: 'Advanced', bg: '#d1fae5' },
                    ].map((b, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl"
                        style={{background: b.bg}}>
                        <span className="text-xl">{b.badge}</span>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{b.name}</p>
                          <p className="text-xs text-gray-500">{b.level}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Learning */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">📚 Continue Learning</h2>
                    <button onClick={() => setActiveTab('learning')}
                      className="text-sm text-teal-600 font-medium hover:underline">Learning hub</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'React.js for Beginners', instructor: 'Dr. Silva', progress: 65, thumb: '⚛️', bg: '#cffafe' },
                      { title: 'Python Data Science', instructor: 'Prof. Perera', progress: 40, thumb: '🐍', bg: '#d1fae5' },
                    ].map((course, i) => (
                      <div key={i}
                        className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{background: course.bg}}>
                            {course.thumb}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{course.title}</p>
                            <p className="text-xs text-gray-500 mb-2">{course.instructor}</p>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full"
                                style={{width: `${course.progress}%`, background: 'linear-gradient(90deg, #0f4c35, #10b981)'}}>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{course.progress}% complete</p>
                          </div>
                          <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg flex-shrink-0"
                            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                            Continue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Roadmap Preview */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">🗺️ Career Roadmap</h2>
                    <button onClick={() => setActiveTab('roadmap')}
                      className="text-sm text-teal-600 font-medium hover:underline">Full map</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { step: 'Learn React.js', status: 'done' },
                      { step: 'Master Node.js', status: 'active' },
                      { step: 'Build Portfolio', status: 'upcoming' },
                      { step: 'Apply for Jobs', status: 'upcoming' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                          style={{
                            background: item.status === 'done' ? '#10b981' :
                                        item.status === 'active' ? '#0f4c35' : '#e5e7eb',
                            color: item.status === 'upcoming' ? '#9ca3af' : 'white'
                          }}>
                          {item.status === 'done' ? '✓' : i + 1}
                        </div>
                        <p className={`text-sm flex-1 ${
                          item.status === 'done' ? 'text-gray-400 line-through' :
                          item.status === 'active' ? 'font-semibold text-gray-800' :
                          'text-gray-500'
                        }`}>{item.step}</p>
                        {item.status === 'active' && (
                          <span className="text-xs px-2 py-0.5 rounded-full text-white"
                            style={{background: '#10b981'}}>Active</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab('roadmap')}
                    className="w-full mt-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                    Generate My Roadmap 🗺️
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── AI JOBS ── */}
          {activeTab === 'ai-jobs' && (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
              <div className="text-7xl mb-5">🤖</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Job Matching Engine</h3>
              <p className="text-gray-500 max-w-md mx-auto">Personalized job recommendations built with Scikit-learn — no external AI API</p>
              <div className="inline-block mt-5 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                In Development 🔧
              </div>
            </div>
          )}

          {/* ── ROADMAP ── */}
          {activeTab === 'roadmap' && (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
              <div className="text-7xl mb-5">🗺️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Career Roadmap</h3>
              <p className="text-gray-500 max-w-md mx-auto">Get a personalized step-by-step career path powered by Google Gemini AI</p>
              <div className="inline-block mt-5 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                Coming Soon 🔧
              </div>
            </div>
          )}

          {/* ── LEARNING ── */}
          {activeTab === 'learning' && (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
              <div className="text-7xl mb-5">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Learning Hub</h3>
              <p className="text-gray-500 max-w-md mx-auto">Browse courses uploaded by instructors with time-limited access control</p>
              <div className="inline-block mt-5 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                Coming Soon 🔧
              </div>
            </div>
          )}

          {/* ── JOBS ── */}
          {activeTab === 'jobs' && (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
              <div className="text-7xl mb-5">💼</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Job Vacancies</h3>
              <p className="text-gray-500 max-w-md mx-auto">Search and apply for jobs posted by instructors and companies</p>
              <div className="inline-block mt-5 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                Coming Soon 🔧
              </div>
            </div>
          )}

          {/* ── CHALLENGES ── */}
          {activeTab === 'challenges' && (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
              <div className="text-7xl mb-5">🏆</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Skill Challenges</h3>
              <p className="text-gray-500 max-w-md mx-auto">Take AI-generated challenges powered by Gemini, earn badges and track your scores</p>
              <div className="inline-block mt-5 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                Coming Soon 🔧
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  {user?.full_name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{user?.full_name}</h3>
                <p className="text-gray-500 text-sm">@{user?.username}</p>
                <p className="text-sm font-medium mt-1" style={{color: '#10b981'}}>{user?.current_post || 'Job Seeker'}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  Edit Profile
                </button>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-5">Profile Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Full Name', value: user?.full_name },
                    { label: 'Username', value: `@${user?.username}` },
                    { label: 'Email', value: user?.email },
                    { label: 'Current Post', value: user?.current_post || 'Not set' },
                    { label: 'Experience', value: `${user?.experience_years || 0} years` },
                    { label: 'Role', value: 'Job Seeker' },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {user?.skills
                      ? user.skills.split(',').map(s => (
                          <span key={s} className="text-xs text-teal-700 px-3 py-1 rounded-full border border-teal-200"
                            style={{background: '#d1fae5'}}>
                            {s.trim()}
                          </span>
                        ))
                      : <p className="text-sm text-gray-400">No skills added yet.</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}