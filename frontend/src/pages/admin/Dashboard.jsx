import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
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
    { id: 'users', icon: '👥', label: 'Manage Users' },
    { id: 'content', icon: '📋', label: 'Manage Content' },
    { id: 'jobs', icon: '💼', label: 'Manage Jobs' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'reports', icon: '📈', label: 'Reports' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    
  ]

  const notifications = [
    { id: 1, icon: '📋', text: 'New content pending approval', time: '5 min ago', unread: true },
    { id: 2, icon: '👥', text: '3 new users registered today', time: '1 hr ago', unread: true },
    { id: 3, icon: '💼', text: 'New job post needs review', time: '2 hrs ago', unread: false },
    { id: 4, icon: '📈', text: 'Monthly report is ready', time: '1 day ago', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  // Chart data
  const userGrowthData = [
    { month: 'Jan', users: 40 },
    { month: 'Feb', users: 65 },
    { month: 'Mar', users: 90 },
    { month: 'Apr', users: 120 },
    { month: 'May', users: 160 },
    { month: 'Jun', users: 210 },
  ]

  const activityData = [
    { month: 'Jan', jobs: 5, content: 8, challenges: 12 },
    { month: 'Feb', jobs: 8, content: 12, challenges: 18 },
    { month: 'Mar', jobs: 6, content: 15, challenges: 22 },
    { month: 'Apr', jobs: 10, content: 18, challenges: 28 },
    { month: 'May', jobs: 14, content: 22, challenges: 35 },
    { month: 'Jun', jobs: 12, content: 25, challenges: 40 },
  ]

  const userRoleData = [
    { name: 'Job Seekers', value: 180 },
    { name: 'Instructors', value: 25 },
    { name: 'Admins', value: 5 },
  ]

  const COLORS = ['#10b981', '#06b6d4', '#0f4c35']

  return (
    <div className="min-h-screen flex" style={{background: '#f0fdf4'}}>

      {/* ── LEFT SIDEBAR ── */}
      <div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 overflow-y-auto"
        style={{background: 'linear-gradient(180deg, #0f4c35 0%, #1a7a5e 50%, #0f766e 100%)'}}>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-white border-opacity-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-2xl flex-shrink-0">
              🚀
            </div>
            <span className="text-white font-bold text-lg">Career Pilot</span>
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
              <p className="text-green-300 text-xs">Administrator</p>
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

        {/* Logout */}
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
            <p className="text-xs text-gray-400">Admin Control Panel</p>
          </div>

          <div className="flex items-center gap-3">
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
                      {n.unread && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background: '#10b981'}}></div>}
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
                <div className="relative z-10">
                  <p className="text-green-200 text-sm font-medium mb-1">Welcome back 👋</p>
                  <h1 className="text-3xl font-bold mb-2">{user?.full_name}</h1>
                  <p className="text-green-100 text-sm">Administrator · Managing Career Pilot Platform</p>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setActiveTab('content')}
                      className="bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition">
                      📋 Review Content
                    </button>
                    <button onClick={() => setActiveTab('reports')}
                      className="bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition">
                      📈 Generate Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: '👥', label: 'Total Users', value: '210', bg: '#d1fae5', color: '#065f46' },
                  { icon: '📚', label: 'Content Items', value: '48', bg: '#cffafe', color: '#164e63' },
                  { icon: '💼', label: 'Active Jobs', value: '15', bg: '#fef3c7', color: '#92400e' },
                  { icon: '📋', label: 'Pending Review', value: '7', bg: '#ede9fe', color: '#4c1d95' },
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

                {/* User Growth Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="font-bold text-gray-800 text-lg mb-5">📈 User Growth</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{fontSize: 12}} />
                      <YAxis tick={{fontSize: 12}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{fill: '#0f4c35', r: 4}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* User Role Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="font-bold text-gray-800 text-lg mb-5">👥 User Roles</h2>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={userRoleData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                        {userRoleData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {userRoleData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{background: COLORS[i]}}></div>
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Content Approvals */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">📋 Pending Approvals</h2>
                    <button onClick={() => setActiveTab('content')}
                      className="text-sm text-teal-600 font-medium hover:underline">See all</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'UI/UX Design Basics', instructor: 'Dr. Perera', type: '🔗 Drive Link', time: '2 hrs ago' },
                      { title: 'Advanced Python', instructor: 'Prof. Silva', type: '📄 PDF', time: '5 hrs ago' },
                      { title: 'DevOps Fundamentals', instructor: 'Mr. Kumar', type: '🎥 Video', time: '1 day ago' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{background: '#fef3c7'}}>
                          📚
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.instructor} · {item.type} · {item.time}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                            style={{background: '#10b981'}}>Approve</button>
                          <button className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                            style={{background: '#ef4444'}}>Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">👥 Recent Users</h2>
                    <button onClick={() => setActiveTab('users')}
                      className="text-sm text-teal-600 font-medium hover:underline">See all</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Kasun Perera', role: 'Job Seeker', time: '2 min ago' },
                      { name: 'Nimasha Silva', role: 'Instructor', time: '1 hr ago' },
                      { name: 'Dinesh Kumar', role: 'Job Seeker', time: '3 hrs ago' },
                      { name: 'Amali Perera', role: 'Job Seeker', time: '5 hrs ago' },
                    ].map((u, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                          {u.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.role} · {u.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          u.role === 'Instructor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>{u.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '🤖', label: 'Job Matches Made', value: '1,240', bg: '#d1fae5', color: '#065f46' },
                  { icon: '🏆', label: 'Challenges Done', value: '856', bg: '#cffafe', color: '#164e63' },
                  { icon: '📚', label: 'Course Enrollments', value: '432', bg: '#fef3c7', color: '#92400e' },
                  { icon: '💼', label: 'Applications', value: '298', bg: '#ede9fe', color: '#4c1d95' },
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

              {/* Activity Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 text-lg mb-5">📊 Platform Activity Overview</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="jobs" name="Jobs Posted" fill="#0f4c35" radius={[4,4,0,0]} />
                    <Bar dataKey="content" name="Content Uploaded" fill="#10b981" radius={[4,4,0,0]} />
                    <Bar dataKey="challenges" name="Challenges Taken" fill="#06b6d4" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* User Growth */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-800 text-lg mb-5">📈 User Growth Trend</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" name="Total Users" stroke="#10b981" strokeWidth={3} dot={{fill: '#0f4c35', r: 5}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">👥 Manage Users</h2>
                  <p className="text-gray-500 mt-1">View, activate or deactivate platform users</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-3">
                  <input type="text" placeholder="Search users..."
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64" />
                  <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Roles</option>
                    <option>Job Seeker</option>
                    <option>Instructor</option>
                  </select>
                </div>
                <table className="w-full">
                  <thead style={{background: '#f0fdf4'}}>
                    <tr>
                      {['User', 'Email', 'Role', 'Post', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { name: 'Kasun Perera', email: 'kasun@gmail.com', role: 'Job Seeker', post: 'Undergraduate', status: 'Active' },
                      { name: 'Nimasha Silva', email: 'nimasha@gmail.com', role: 'Instructor', post: 'Software Engineer', status: 'Active' },
                      { name: 'Dinesh Kumar', email: 'dinesh@gmail.com', role: 'Job Seeker', post: 'Frontend Developer', status: 'Active' },
                      { name: 'Amali Perera', email: 'amali@gmail.com', role: 'Job Seeker', post: 'UI/UX Designer', status: 'Inactive' },
                    ].map((u, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                              {u.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-800">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            u.role === 'Instructor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{u.post}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                          }`}>{u.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                              style={{background: u.status === 'Active' ? '#ef4444' : '#10b981'}}>
                              {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                              style={{background: '#dc2626'}}>
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CONTENT ── */}
          {activeTab === 'content' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📋 Manage Content</h2>
                <p className="text-gray-500 mt-1">Review and approve instructor uploaded materials</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-3">
                  <input type="text" placeholder="Search content..."
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64" />
                  <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <table className="w-full">
                  <thead style={{background: '#f0fdf4'}}>
                    <tr>
                      {['Title', 'Instructor', 'Type', 'Category', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { title: 'React.js for Beginners', instructor: 'Dr. Perera', type: '🎥 Video', category: 'Web Dev', status: 'Approved' },
                      { title: 'UI/UX Design Basics', instructor: 'Ms. Silva', type: '🔗 Drive Link', category: 'Design', status: 'Pending' },
                      { title: 'Python Data Science', instructor: 'Prof. Kumar', type: '📄 PDF', category: 'Data', status: 'Approved' },
                      { title: 'DevOps Fundamentals', instructor: 'Mr. Perera', type: '🎥 Video', category: 'DevOps', status: 'Pending' },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.instructor}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            item.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{item.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {item.status === 'Pending' && <>
                              <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                                style={{background: '#10b981'}}>Approve</button>
                              <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                                style={{background: '#ef4444'}}>Reject</button>
                            </>}
                            <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                              style={{background: '#6b7280'}}>View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── JOBS ── */}
          {activeTab === 'jobs' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💼 Manage Job Posts</h2>
                <p className="text-gray-500 mt-1">Review and manage all job vacancies</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <input type="text" placeholder="Search jobs..."
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64" />
                </div>
                <table className="w-full">
                  <thead style={{background: '#f0fdf4'}}>
                    <tr>
                      {['Job Title', 'Company', 'Type', 'Posted By', 'Applications', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { title: 'Frontend Developer', company: 'TechCorp Lanka', type: 'Full Time', posted: 'Dr. Perera', apps: 12 },
                      { title: 'UI/UX Designer', company: 'Creative Studio', type: 'Part Time', posted: 'Ms. Silva', apps: 8 },
                      { title: 'Data Analyst', company: 'DataX', type: 'Internship', posted: 'Prof. Kumar', apps: 5 },
                    ].map((job, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{job.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{job.company}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">{job.type}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{job.posted}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">{job.apps}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                              style={{background: '#0891b2'}}>View</button>
                            <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                              style={{background: '#ef4444'}}>Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {activeTab === 'reports' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📈 Generate Reports</h2>
                <p className="text-gray-500 mt-1">Generate and send performance reports to instructors</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Generate Report Form */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-5">📊 Generate Report</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Report Type</label>
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                        <option>Monthly Instructor Performance</option>
                        <option>Annual Instructor Performance</option>
                        <option>Platform Usage Report</option>
                        <option>User Activity Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Instructor</label>
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                        <option>All Instructors</option>
                        <option>Dr. Perera</option>
                        <option>Ms. Silva</option>
                        <option>Prof. Kumar</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">From Date</label>
                        <input type="date"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">To Date</label>
                        <input type="date"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Report Format</label>
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                        <option>PDF Report</option>
                        <option>Excel Spreadsheet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Send Email To</label>
                      <input type="email"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        placeholder="instructor@example.com" />
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 rounded-xl font-semibold text-white"
                        style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                        📧 Generate & Send Email
                      </button>
                      <button className="px-5 py-3 rounded-xl font-semibold border-2 border-teal-500 text-teal-600 hover:bg-teal-50 transition">
                        ⬇️ Download
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-5">🕐 Recent Reports</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Monthly Report — Dr. Perera', date: 'Jun 1, 2026', type: 'PDF', sent: true },
                      { title: 'Annual Report — All Instructors', date: 'May 15, 2026', type: 'Excel', sent: true },
                      { title: 'Monthly Report — Ms. Silva', date: 'May 1, 2026', type: 'PDF', sent: true },
                      { title: 'Platform Usage Report', date: 'Apr 30, 2026', type: 'PDF', sent: false },
                    ].map((report, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{background: report.type === 'PDF' ? '#fef3c7' : '#d1fae5'}}>
                          {report.type === 'PDF' ? '📄' : '📊'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{report.title}</p>
                          <p className="text-xs text-gray-500">{report.date} · {report.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {report.sent && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Sent</span>
                          )}
                          <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                            style={{background: '#0891b2'}}>
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === 'notifications' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">🔔 Send Notifications</h2>
                  <p className="text-gray-500 mt-1">Send announcements to users or specific groups</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Send Notification Form */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-5">📢 Send Announcement</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Send To</label>
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                        <option>All Users</option>
                        <option>Job Seekers Only</option>
                        <option>Instructors Only</option>
                        <option>Specific User</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Notification Title</label>
                      <input type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        placeholder="e.g. New Feature Available!" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                      <textarea rows={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        placeholder="Write your announcement message..." />
                    </div>
                    <button className="w-full py-3 rounded-xl font-semibold text-white"
                      style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                      Send Notification →
                    </button>
                  </div>
                </div>

                {/* Notification History */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-5">🕐 Sent History</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'New AI feature launched!', target: 'All Users', time: '2 hrs ago', count: 210 },
                      { title: 'Monthly challenge available', target: 'Job Seekers', time: '1 day ago', count: 180 },
                      { title: 'Please submit content reports', target: 'Instructors', time: '2 days ago', count: 25 },
                      { title: 'Platform maintenance notice', target: 'All Users', time: '5 days ago', count: 210 },
                    ].map((n, i) => (
                      <div key={i} className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-gray-800">{n.title}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{n.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">{n.target}</span>
                          <span className="text-xs text-gray-400">{n.count} recipients</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                <p className="text-sm font-medium mt-1" style={{color: '#10b981'}}>Administrator</p>
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
                    { label: 'Role', value: 'Administrator' },
                    { label: 'Current Post', value: user?.current_post || 'Not set' },
                    { label: 'Experience', value: `${user?.experience_years || 0} years` },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}