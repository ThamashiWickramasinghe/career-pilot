import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'

const JOB_CATEGORIES = [
  'Software Engineering', 'Web Development', 'Mobile Development',
  'Data Science', 'UI/UX Design', 'DevOps & Cloud', 'Cybersecurity',
  'Machine Learning & AI', 'Database & SQL', 'Project Management',
  'Quality Assurance', 'Other'
]

export default function CompanyDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  const [notifOpen, setNotifOpen] = useState(false)
  const [myJobs, setMyJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editJob, setEditJob] = useState(null)
  const [appFilter, setAppFilter] = useState('All')
  const [jobForm, setJobForm] = useState({
    title: '', category: 'Software Engineering', job_type: 'Full Time',
    location: '', salary_range: '', required_skills: '',
    experience: 'Fresh Graduate / No Experience', description: '', deadline: ''
  })

  const handleLogout = () => { logout(); navigate('/login') }

  useEffect(() => {
    fetchMyJobs()
    fetchApplications()
  }, [])

  const fetchMyJobs = async () => {
    try {
      const res = await API.get('/jobs/my-jobs')
      setMyJobs(res.data.jobs)
    } catch (err) {
      console.error('Failed to load jobs')
    }
  }

  const fetchApplications = async () => {
    try {
      const res = await API.get('/jobs/applications')
      setApplications(res.data.applications)
    } catch (err) {
      console.error('Failed to load applications')
    }
  }

  const handlePostJob = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/jobs/post', jobForm)
      setSuccess('Job posted successfully! ✅')
      setJobForm({
        title: '', category: 'Software Engineering', job_type: 'Full Time',
        location: '', salary_range: '', required_skills: '',
        experience: 'Fresh Graduate / No Experience', description: '', deadline: ''
      })
      fetchMyJobs()
      setActiveTab('my-jobs')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job')
    }
    setLoading(false)
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job post?')) return
    try {
      await API.delete(`/jobs/${jobId}`)
      setSuccess('Job deleted!')
      fetchMyJobs()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete job')
    }
  }

  const handleUpdateStatus = async (appId, status) => {
    try {
      await API.put(`/jobs/applications/${appId}/status`, { status })
      setSuccess(`Status updated to ${status}!`)
      fetchApplications()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const filteredApplications = applications.filter(a =>
    appFilter === 'All' ? true : a.status === appFilter
  )

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'post-job', icon: '➕', label: 'Post Job' },
    { id: 'my-jobs', icon: '💼', label: 'My Job Posts' },
    { id: 'applications', icon: '📝', label: 'Applications' },
    { id: 'profile', icon: '🏢', label: 'Company Profile' },
  ]

  const notifications = [
    { id: 1, icon: '📝', text: '5 new applications received', time: '10 min ago', unread: true },
    { id: 2, icon: '✅', text: 'Your job post is live', time: '1 hr ago', unread: true },
  ]
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="min-h-screen flex" style={{background: '#f0fdf4'}}>

      {/* SIDEBAR */}
      <div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 overflow-y-auto"
        style={{background: 'linear-gradient(180deg, #0f4c35 0%, #1a7a5e 50%, #0f766e 100%)'}}>
        <div className="px-6 py-6 border-b border-white border-opacity-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-2xl">🚀</div>
            <span className="text-white font-bold text-lg">Career Pilot</span>
          </div>
        </div>
        <div className="px-6 py-4 border-b border-white border-opacity-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg border-2 border-white border-opacity-30"
              style={{background: 'linear-gradient(135deg, #10b981, #06b6d4)'}}>
              {(user?.company_name || user?.full_name)?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-sm truncate">{user?.company_name || user?.full_name}</p>
              <p className="text-green-300 text-xs">Company Account</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                activeTab === item.id ? 'text-teal-800 font-semibold' : 'text-green-200 hover:bg-white hover:bg-opacity-90 hover:text-teal-800'
              }`}
              style={activeTab === item.id ? {background: 'white'} : {}}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="flex-shrink-0">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{background: '#0f4c35'}}></div>}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white border-opacity-10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500 hover:bg-opacity-20 transition">
            <span className="text-lg">🚪</span><span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {navItems.find(n => n.id === activeTab)?.icon}{' '}
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-gray-400">Company Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{background: '#10b981'}}>{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 flex gap-3 items-start hover:bg-gray-50 ${n.unread ? 'bg-teal-50' : ''}`}>
                      <span className="text-xl">{n.icon}</span>
                      <div>
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <p className="text-xs text-gray-400">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                {(user?.company_name || user?.full_name)?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.company_name || user?.full_name}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">

          {/* Toast */}
          {success && (
            <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
              ✅ {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* HOME */}
          {activeTab === 'home' && (
            <div>
              <div className="rounded-2xl p-8 mb-6 text-white relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #0f4c35 0%, #1a7a5e 40%, #10b981 80%, #06b6d4 100%)'}}>
                <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full opacity-10"
                  style={{background: 'radial-gradient(circle, #ffffff, transparent)'}}></div>
                <div className="relative z-10">
                  <p className="text-green-200 text-sm mb-1">Welcome back 👋</p>
                  <h1 className="text-3xl font-bold mb-2">{user?.company_name || user?.full_name}</h1>
                  <p className="text-green-100 text-sm">Company Account · Find the best IT talent</p>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setActiveTab('post-job')}
                      className="bg-white text-teal-700 px-5 py-2.5 rounded-xl text-sm font-semibold">
                      ➕ Post a Job
                    </button>
                    <button onClick={() => setActiveTab('applications')}
                      className="bg-white bg-opacity-20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold border border-white border-opacity-30">
                      📝 View Applications
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: '💼', label: 'Active Jobs', value: myJobs.filter(j => j.is_active).length.toString(), bg: '#d1fae5', color: '#065f46' },
                  { icon: '📝', label: 'Total Applications', value: applications.length.toString(), bg: '#cffafe', color: '#164e63' },
                  { icon: '⏳', label: 'Pending', value: applications.filter(a => a.status === 'Pending').length.toString(), bg: '#fef3c7', color: '#92400e' },
                  { icon: '✅', label: 'Hired', value: applications.filter(a => a.status === 'Hired').length.toString(), bg: '#ede9fe', color: '#4c1d95' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3" style={{background: stat.bg}}>
                      {stat.icon}
                    </div>
                    <p className="text-3xl font-bold" style={{color: stat.color}}>{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">💼 My Job Posts</h2>
                    <button onClick={() => setActiveTab('my-jobs')} className="text-sm text-teal-600">See all</button>
                  </div>
                  {myJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📭</div>
                      <p className="text-gray-500 text-sm">No jobs posted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myJobs.slice(0, 3).map(job => (
                        <div key={job.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background: '#d1fae5'}}>💼</div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{job.title}</p>
                            <p className="text-xs text-gray-500">{job.job_type} · {job.applications_count} applications</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${job.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {job.is_active ? 'Active' : 'Closed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-gray-800 text-lg">📝 Recent Applications</h2>
                    <button onClick={() => setActiveTab('applications')} className="text-sm text-teal-600">See all</button>
                  </div>
                  {applications.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📭</div>
                      <p className="text-gray-500 text-sm">No applications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.slice(0, 4).map(app => (
                        <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                            {app.applicant_name?.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{app.applicant_name}</p>
                            <p className="text-xs text-gray-500">{app.job_title}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            app.status === 'Hired' ? 'bg-green-100 text-green-700' :
                            app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{app.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* POST JOB */}
          {activeTab === 'post-job' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">➕ Post a Job</h2>
                <p className="text-gray-500 mt-1">Create a new job vacancy for IT professionals</p>
              </div>
              <form onSubmit={handlePostJob} className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
                  <input required type="text" value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Frontend Developer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type *</label>
                    <select value={jobForm.job_type} onChange={(e) => setJobForm({...jobForm, job_type: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                      {['Full Time','Part Time','Internship','Remote','Contract'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                    <select value={jobForm.category} onChange={(e) => setJobForm({...jobForm, category: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                      {JOB_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
                    <input required type="text" value={jobForm.location}
                      onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. Colombo, Sri Lanka" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range</label>
                    <input type="text" value={jobForm.salary_range}
                      onChange={(e) => setJobForm({...jobForm, salary_range: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. LKR 80,000 - 120,000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Required Skills *</label>
                  <input required type="text" value={jobForm.required_skills}
                    onChange={(e) => setJobForm({...jobForm, required_skills: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. React, JavaScript, CSS (comma separated)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Required</label>
                  <select value={jobForm.experience} onChange={(e) => setJobForm({...jobForm, experience: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                    {['Fresh Graduate / No Experience','1 - 2 Years','2 - 3 Years','3 - 5 Years','5+ Years'].map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description *</label>
                  <textarea required rows={5} value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Describe the role, responsibilities and requirements..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Application Deadline</label>
                  <input type="date" value={jobForm.deadline}
                    onChange={(e) => setJobForm({...jobForm, deadline: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  {loading ? 'Posting...' : 'Post Job Vacancy →'}
                </button>
              </form>
            </div>
          )}

          {/* MY JOBS */}
          {activeTab === 'my-jobs' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">💼 My Job Posts</h2>
                  <p className="text-gray-500 mt-1">Manage your posted job vacancies</p>
                </div>
                <button onClick={() => setActiveTab('post-job')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  ➕ Post New Job
                </button>
              </div>
              {myJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs posted yet</h3>
                  <button onClick={() => setActiveTab('post-job')}
                    className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead style={{background: '#f0fdf4'}}>
                      <tr>
                        {['Job Title', 'Type', 'Location', 'Applications', 'Deadline', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {myJobs.map(job => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-gray-800">{job.title}</p>
                            <p className="text-xs text-gray-400">{job.category}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">{job.job_type}</span>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">{job.location}</td>
                          <td className="px-5 py-4 text-sm font-semibold text-gray-700">{job.applications_count}</td>
                          <td className="px-5 py-4 text-xs text-gray-500">
                            {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${job.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {job.is_active ? 'Active' : 'Closed'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => handleDeleteJob(job.id)}
                                className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                                style={{background: '#ef4444'}}>🗑️ Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* APPLICATIONS */}
          {activeTab === 'applications' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📝 Job Applications</h2>
                <p className="text-gray-500 mt-1">Review applicants and update their status</p>
              </div>
              <div className="flex gap-3 mb-5">
                {['All', 'Pending', 'Shortlisted', 'Hired', 'Rejected'].map(f => (
                  <button key={f} onClick={() => setAppFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${appFilter === f ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    style={appFilter === f ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
                    {f} {f !== 'All' && `(${applications.filter(a => a.status === f).length})`}
                  </button>
                ))}
              </div>
              {filteredApplications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500">No applications found</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead style={{background: '#f0fdf4'}}>
                      <tr>
                        {['Applicant', 'Job', 'Skills', 'Applied', 'Status', 'Update', 'Cover Letter'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredApplications.map(app => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                                {app.applicant_name?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{app.applicant_name}</p>
                                <p className="text-xs text-gray-400">{app.applicant_email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">{app.job_title}</td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1 max-w-32">
                              {app.applicant_skills?.split(',').slice(0, 2).map(s => (
                                <span key={s} className="text-xs px-1.5 py-0.5 rounded-full" style={{background: '#d1fae5', color: '#065f46'}}>
                                  {s.trim()}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500">
                            {new Date(app.applied_at).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              app.status === 'Hired' ? 'bg-green-100 text-green-700' :
                              app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>{app.status}</span>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white">
                              {['Pending','Shortlisted','Hired','Rejected'].map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-5 py-4">
                            {app.cover_letter ? (
                              <span className="text-xs text-gray-500 italic truncate max-w-24 block">
                                "{app.cover_letter.substring(0, 30)}..."
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">No letter</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  {(user?.company_name || user?.full_name)?.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{user?.company_name || user?.full_name}</h3>
                <p className="text-gray-500 text-sm">@{user?.username}</p>
                <p className="text-sm font-medium mt-1" style={{color: '#10b981'}}>Company Account</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-5">Company Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Company Name', value: user?.company_name || 'Not set' },
                    { label: 'Contact Person', value: user?.full_name },
                    { label: 'Email', value: user?.email },
                    { label: 'Username', value: `@${user?.username}` },
                    { label: 'Website', value: user?.company_website || 'Not set' },
                    { label: 'Location', value: user?.company_location || 'Not set' },
                  ].map(item => (
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