import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function InstructorDashboard() {
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
    { id: 'post-content', icon: '📤', label: 'Post Content' },
    { id: 'manage-content', icon: '📋', label: 'Manage Content' },
    { id: 'post-job', icon: '💼', label: 'Post Job Vacancy' },
    { id: 'applications', icon: '📝', label: 'Job Applications' },
    { id: 'reaccess', icon: '🔄', label: 'Re-Access Requests' },
    
  ]

  const notifications = [
    { id: 1, icon: '📝', text: '3 new job applications received', time: '5 min ago', unread: true },
    { id: 2, icon: '🔄', text: 'Re-access request from Thamashi', time: '1 hr ago', unread: true },
    { id: 3, icon: '✅', text: 'Your content was approved by admin', time: '2 hrs ago', unread: false },
    { id: 4, icon: '💼', text: 'Job vacancy posted successfully', time: '1 day ago', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

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
              <p className="text-green-300 text-xs truncate">Instructor</p>
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
            <p className="text-xs text-gray-400">Instructor Dashboard</p>
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
                <div className="relative z-10">
                  <p className="text-green-200 text-sm font-medium mb-1">Welcome back 👋</p>
                  <h1 className="text-3xl font-bold mb-2">{user?.full_name}</h1>
                  <p className="text-green-100 text-sm">{user?.current_post || 'Instructor'} · Shaping careers through knowledge</p>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setActiveTab('post-content')}
                      className="bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition">
                      📤 Post Content
                    </button>
                    <button onClick={() => setActiveTab('post-job')}
                      className="bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition">
                      💼 Post Job
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: '📚', label: 'Content Posted', value: '8', bg: '#d1fae5', color: '#065f46' },
                  { icon: '💼', label: 'Jobs Posted', value: '3', bg: '#cffafe', color: '#164e63' },
                  { icon: '📝', label: 'Applications', value: '24', bg: '#fef3c7', color: '#92400e' },
                  { icon: '🔄', label: 'Re-Access Req', value: '5', bg: '#ede9fe', color: '#4c1d95' },
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

                {/* Recent Applications */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">📝 Recent Applications</h2>
                    <button onClick={() => setActiveTab('applications')}
                      className="text-sm text-teal-600 font-medium hover:underline">See all</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Kasun Perera', job: 'Frontend Developer', status: 'Pending', time: '2 hrs ago' },
                      { name: 'Nimasha Silva', job: 'UI/UX Designer', status: 'Shortlisted', time: '5 hrs ago' },
                      { name: 'Dinesh Kumar', job: 'Frontend Developer', status: 'Rejected', time: '1 day ago' },
                    ].map((app, i) => (
                      <div key={i}
                        className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                          {app.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{app.name}</p>
                          <p className="text-xs text-gray-500">{app.job}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">{app.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Re-Access Requests */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">🔄 Re-Access Requests</h2>
                    <button onClick={() => setActiveTab('reaccess')}
                      className="text-sm text-teal-600 font-medium hover:underline">See all</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Thamashi W.', content: 'React.js Course', days: '3 days ago' },
                      { name: 'Kasun P.', content: 'Python Basics', days: '1 day ago' },
                      { name: 'Amali S.', content: 'UI/UX Design', days: '5 hrs ago' },
                    ].map((req, i) => (
                      <div key={i} className="p-3 rounded-xl border border-gray-100" style={{background: '#f0fdf4'}}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                            {req.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700">{req.name}</p>
                            <p className="text-xs text-gray-400">{req.days}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{req.content}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1 rounded-lg text-xs font-medium text-white"
                            style={{background: '#10b981'}}>
                            Approve
                          </button>
                          <button className="flex-1 py-1 rounded-lg text-xs font-medium text-white"
                            style={{background: '#ef4444'}}>
                            Deny
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Content */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">📚 My Content</h2>
                    <button onClick={() => setActiveTab('manage-content')}
                      className="text-sm text-teal-600 font-medium hover:underline">Manage all</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'React.js for Beginners', type: 'Video', students: 45, status: 'Approved', bg: '#cffafe' },
                      { title: 'Python Data Science', type: 'PDF', students: 32, status: 'Approved', bg: '#d1fae5' },
                      { title: 'UI/UX Design Basics', type: 'Drive Link', students: 0, status: 'Pending', bg: '#fef3c7' },
                    ].map((content, i) => (
                      <div key={i} className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                          style={{background: content.bg}}>
                          {content.type === 'Video' ? '🎥' : content.type === 'PDF' ? '📄' : '🔗'}
                        </div>
                        <p className="font-semibold text-gray-800 text-sm mb-1">{content.title}</p>
                        <p className="text-xs text-gray-500 mb-2">{content.type} · {content.students} students</p>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          content.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {content.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── POST CONTENT ── */}
          {activeTab === 'post-content' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📤 Post Content</h2>
                <p className="text-gray-500 mt-1">Upload learning materials for job seekers</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Content Title</label>
                    <input type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      placeholder="e.g. React.js for Beginners" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      placeholder="Describe your content..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Content Type</label>
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                        <option>Video Upload</option>
                        <option>PDF Document</option>
                        <option>Google Drive Link</option>
                        <option>YouTube Link</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                        <option>Web Development</option>
                        <option>Data Science</option>
                        <option>UI/UX Design</option>
                        <option>DevOps</option>
                        <option>Cybersecurity</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload File or Paste Link</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-teal-400 transition cursor-pointer"
                      style={{background: '#f0fdf4'}}>
                      <div className="text-4xl mb-3">📁</div>
                      <p className="text-sm font-medium text-gray-600">Drag & drop file here or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">Supports PDF, MP4, or paste Google Drive / YouTube link</p>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl font-semibold text-white"
                    style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                    Submit for Admin Approval →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── MANAGE CONTENT ── */}
          {activeTab === 'manage-content' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📋 Manage Content</h2>
                <p className="text-gray-500 mt-1">View and manage all your uploaded materials</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <input type="text" placeholder="Search content..."
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64" />
                </div>
                <table className="w-full">
                  <thead style={{background: '#f0fdf4'}}>
                    <tr>
                      {['Title', 'Type', 'Students', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { title: 'React.js for Beginners', type: '🎥 Video', students: 45, status: 'Approved' },
                      { title: 'Python Data Science', type: '📄 PDF', students: 32, status: 'Approved' },
                      { title: 'UI/UX Design Basics', type: '🔗 Drive Link', students: 0, status: 'Pending' },
                      { title: 'Node.js Advanced', type: '🎥 Video', students: 18, status: 'Approved' },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.students}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            item.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                              style={{background: '#0891b2'}}>Edit</button>
                            <button className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                              style={{background: '#ef4444'}}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── POST JOB ── */}
          {activeTab === 'post-job' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">💼 Post Job Vacancy</h2>
                <p className="text-gray-500 mt-1">Create a new job opening for job seekers</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
                    <input type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      placeholder="e.g. Frontend Developer" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                      <input type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        placeholder="e.g. TechCorp Lanka" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Internship</option>
                        <option>Remote</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                      <input type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        placeholder="e.g. Colombo, Sri Lanka" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range</label>
                      <input type="text"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        placeholder="e.g. LKR 80,000 - 120,000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Required Skills</label>
                    <input type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      placeholder="e.g. React, JavaScript, CSS (comma separated)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description</label>
                    <textarea rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      placeholder="Describe the role, responsibilities and requirements..." />
                  </div>
                  <button className="w-full py-3 rounded-xl font-semibold text-white"
                    style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                    Post Job Vacancy →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── APPLICATIONS ── */}
          {activeTab === 'applications' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📝 Job Applications</h2>
                <p className="text-gray-500 mt-1">Review and update application statuses</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <input type="text" placeholder="Search applicants..."
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64" />
                </div>
                <table className="w-full">
                  <thead style={{background: '#f0fdf4'}}>
                    <tr>
                      {['Applicant', 'Job', 'Applied', 'Status', 'Update Status'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { name: 'Kasun Perera', job: 'Frontend Developer', date: 'Jun 9, 2026', status: 'Pending' },
                      { name: 'Nimasha Silva', job: 'UI/UX Designer', date: 'Jun 8, 2026', status: 'Shortlisted' },
                      { name: 'Dinesh Kumar', job: 'Frontend Developer', date: 'Jun 7, 2026', status: 'Rejected' },
                      { name: 'Amali Perera', job: 'UI/UX Designer', date: 'Jun 6, 2026', status: 'Hired' },
                    ].map((app, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                              {app.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-800">{app.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{app.job}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{app.date}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            app.status === 'Hired' ? 'bg-green-100 text-green-700' :
                            app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white">
                            <option>Pending</option>
                            <option>Shortlisted</option>
                            <option>Hired</option>
                            <option>Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── RE-ACCESS REQUESTS ── */}
          {activeTab === 'reaccess' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🔄 Re-Access Requests</h2>
                <p className="text-gray-500 mt-1">Manage expired content access requests from students</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Thamashi W.', content: 'React.js for Beginners', expired: '3 days ago', email: 'thamashi@gmail.com' },
                  { name: 'Kasun P.', content: 'Python Data Science', expired: '1 day ago', email: 'kasun@gmail.com' },
                  { name: 'Amali S.', content: 'UI/UX Design Basics', expired: '5 hrs ago', email: 'amali@gmail.com' },
                  { name: 'Dinesh K.', content: 'Node.js Advanced', expired: '2 days ago', email: 'dinesh@gmail.com' },
                ].map((req, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                        {req.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{req.name}</p>
                        <p className="text-xs text-gray-500">{req.email}</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl mb-4" style={{background: '#f0fdf4'}}>
                      <p className="text-xs text-gray-500 mb-1">Requested content</p>
                      <p className="text-sm font-semibold text-gray-800">📚 {req.content}</p>
                      <p className="text-xs text-red-500 mt-1">Access expired {req.expired}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                        ✅ Approve
                      </button>
                      <button className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{background: 'linear-gradient(135deg, #dc2626, #ef4444)'}}>
                        ❌ Deny
                      </button>
                    </div>
                  </div>
                ))}
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
                <p className="text-sm font-medium mt-1" style={{color: '#10b981'}}>
                  {user?.current_post || 'Instructor'}
                </p>
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
                    { label: 'Role', value: 'Instructor' },
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