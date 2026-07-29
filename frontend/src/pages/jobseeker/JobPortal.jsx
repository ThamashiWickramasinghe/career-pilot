import { useState, useEffect } from 'react'
import API from '../../utils/api'
import Quiz from './Quiz'

const CATEGORIES = [
  'All', 'Software Engineering', 'Web Development', 'Mobile Development',
  'Data Science', 'UI/UX Design', 'DevOps & Cloud', 'Cybersecurity',
  'Machine Learning & AI', 'Database & SQL', 'Project Management',
  'Quality Assurance', 'Other'
]
const JOB_TYPES = ['All', 'Full Time', 'Part Time', 'Internship', 'Remote', 'Contract']

export default function JobPortal() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [myApplications, setMyApplications] = useState([])
  const [activeSection, setActiveSection] = useState('browse')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [jobType, setJobType] = useState('All')
  const [location, setLocation] = useState('')

  useEffect(() => {
    fetchJobs()
    fetchMyApplications()
  }, [])

  useEffect(() => { fetchJobs() }, [category, jobType])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'All') params.append('category', category)
      if (jobType !== 'All') params.append('job_type', jobType)
      if (search) params.append('search', search)
      if (location) params.append('location', location)
      const res = await API.get(`/jobs/all?${params}`)
      setJobs(res.data.jobs)
    } catch (err) {
      setError('Failed to load jobs')
    }
    setLoading(false)
  }

  const fetchMyApplications = async () => {
    try {
      const res = await API.get('/jobs/my-applications')
      setMyApplications(res.data.applications)
    } catch (err) {
      console.error('Failed to load applications')
    }
  }

  const handleApply = async () => {
    setApplying(true)
    setError('')
    try {
      await API.post(`/jobs/${selectedJob.id}/apply`, { cover_letter: coverLetter })
      setSuccess('Application submitted! 🎉')
      setCoverLetter('')
      setSelectedJob(null)
      fetchMyApplications()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply')
    }
    setApplying(false)
  }

  const handleQuizComplete = (result) => {
    setQuizResult(result)
    setShowQuiz(false)
    setActiveSection('browse')
  }

  const isApplied = (jobId) => myApplications.some(a => a.job_id === jobId)

  const displayJobs = quizResult
    ? [...jobs].sort((a, b) => {
        const scoreA = quizResult.categoryScores?.[a.category] || 0
        const scoreB = quizResult.categoryScores?.[b.category] || 0
        return scoreB - scoreA
      })
    : jobs

  // ── QUIZ VIEW ──
  if (showQuiz) {
    return (
      <div>
        <button onClick={() => setShowQuiz(false)}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm mb-5">
          ← Back to Job Portal
        </button>
        <Quiz onComplete={handleQuizComplete} />
      </div>
    )
  }

  // ── JOB DETAIL VIEW ──
  if (selectedJob) {
    return (
      <div>
        <button onClick={() => setSelectedJob(null)}
          className="flex items-center gap-2 text-teal-600 font-medium text-sm mb-5">
          ← Back to Job Portal
        </button>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">⚠️ {error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-sm">✅ {success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  {selectedJob.company_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h1>
                  <p className="text-teal-600 font-medium">{selectedJob.company_name}</p>
                </div>
              </div>
              {isApplied(selectedJob.id) ? (
                <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-100 text-green-700">✅ Applied</span>
              ) : (
                <button onClick={() => document.getElementById('apply-section').scrollIntoView({behavior: 'smooth'})}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  Apply Now →
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { icon: '📍', label: 'Location', value: selectedJob.location },
                { icon: '⏰', label: 'Type', value: selectedJob.job_type },
                { icon: '📁', label: 'Category', value: selectedJob.category },
                { icon: '💰', label: 'Salary', value: selectedJob.salary_range || 'Not specified' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                  <p className="text-xs text-gray-500 mb-1">{item.icon} {item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">🛠️ Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.required_skills?.split(',').map(skill => (
                  <span key={skill} className="text-sm px-3 py-1 rounded-full font-medium"
                    style={{background: '#d1fae5', color: '#065f46'}}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {selectedJob.experience && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">📊 Experience Required</h3>
                <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">{selectedJob.experience}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">📋 Job Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
            </div>

            {!isApplied(selectedJob.id) && (
              <div id="apply-section" className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-800 mb-4">✍️ Apply for this Job</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Cover Letter <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Tell the company why you're a great fit..." />
                  </div>
                  <button onClick={handleApply} disabled={applying}
                    className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50"
                    style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                    {applying ? 'Submitting...' : 'Submit Application →'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">🏢 About Company</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  {selectedJob.company_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedJob.company_name}</p>
                  <p className="text-xs text-gray-400">IT Company</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📍 {selectedJob.location}</p>
                <p>💼 {selectedJob.applications_count} applications</p>
                <p>📅 Posted {new Date(selectedJob.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN VIEW ──
  return (
    <div>
      {success && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✅ {success}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setActiveSection('browse')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeSection === 'browse' ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          style={activeSection === 'browse' ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
          🔍 Browse Jobs ({jobs.length})
        </button>
        <button onClick={() => setActiveSection('applications')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeSection === 'applications' ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          style={activeSection === 'applications' ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
          📝 My Applications ({myApplications.length})
        </button>
      </div>

      {activeSection === 'browse' && (
        <div>
          {/* TOP ROW: Quiz button LEFT, Search RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">

            {/* Quiz Button — LEFT, bigger and prominent */}
            <div className="lg:col-span-2">
              <div className="h-full rounded-2xl p-5 text-white relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full opacity-10"
                  style={{background: 'radial-gradient(circle, #ffffff, transparent)'}}></div>
                <div className="relative z-10">
                  {quizResult ? (
                    <>
                      <div className="text-3xl mb-2">🎯</div>
                      <h3 className="font-bold text-base mb-1">Quiz Completed!</h3>
                      <p className="text-green-200 text-xs mb-3">
                        Jobs ranked by your skill match
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowQuiz(true)}
                          className="flex-1 bg-white bg-opacity-20 text-white text-xs py-2 rounded-lg font-medium hover:bg-opacity-30 transition border border-white border-opacity-30">
                          Retake Quiz
                        </button>
                        <button onClick={() => setQuizResult(null)}
                          className="flex-1 bg-white bg-opacity-20 text-white text-xs py-2 rounded-lg font-medium hover:bg-opacity-30 transition border border-white border-opacity-30">
                          Show All Jobs
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-2">🧠</div>
                      <h3 className="font-bold text-base mb-1">Take Career Quiz</h3>
                      <p className="text-green-200 text-xs mb-3">
                        Answer 140 questions across 14 IT categories. We'll rank the most suitable jobs for you!
                      </p>
                      <button onClick={() => setShowQuiz(true)}
                        className="w-full bg-white text-teal-700 text-sm py-2 rounded-xl font-bold hover:bg-green-50 transition">
                        🚀 Start Quiz Now
                      </button>
                      <p className="text-green-300 text-xs mt-2 text-center">Optional · Takes ~30 minutes</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Search + Filters — RIGHT */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              {quizResult && (
                <div className="flex items-center gap-2 mb-3 p-2 rounded-xl bg-teal-50 border border-teal-200">
                  <span className="text-sm">🎯</span>
                  <p className="text-xs text-teal-700 font-medium">
                    Jobs are ranked by your quiz results. Most suitable jobs appear first!
                  </p>
                </div>
              )}

              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input type="text" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  placeholder="Search by job title, skills or keywords..." />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs">📍</span>
                  <input type="text" value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                    className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    placeholder="Location..." />
                </div>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs bg-white">
                  {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <button onClick={fetchJobs}
                  className="py-2 rounded-xl text-xs font-semibold text-white"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      category === cat ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={category === cat ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loading ? 'Loading...' : `${displayJobs.length} job${displayJobs.length !== 1 ? 's' : ''} found`}
              {quizResult && <span className="ml-2 text-teal-600 font-medium">· Ranked by quiz results 🎯</span>}
            </p>
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4 animate-pulse">💼</div>
              <p className="text-gray-500">Loading jobs...</p>
            </div>
          ) : displayJobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs found</h3>
              <p className="text-gray-500 text-sm">Try different search terms or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayJobs.map((job, index) => (
                <div key={job.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedJob(job)}>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                        style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                        {job.company_name?.charAt(0).toUpperCase()}
                      </div>
                      {quizResult && index < 3 && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{background: index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : '#b45309'}}>
                          {index + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800 text-lg">{job.title}</h3>
                            {quizResult && index === 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                                🏆 Best Match
                              </span>
                            )}
                          </div>
                          <p className="text-teal-600 font-medium text-sm">{job.company_name}</p>
                        </div>
                        {isApplied(job.id) && (
                          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium flex-shrink-0">
                            ✅ Applied
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">
                          {job.job_type}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          📍 {job.location}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          📁 {job.category}
                        </span>
                        {job.salary_range && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
                            💰 {job.salary_range}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {job.required_skills?.split(',').slice(0, 5).map(skill => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded-full"
                            style={{background: '#d1fae5', color: '#065f46'}}>
                            {skill.trim()}
                          </span>
                        ))}
                        {job.required_skills?.split(',').length > 5 && (
                          <span className="text-xs text-gray-400">
                            +{job.required_skills.split(',').length - 5} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>📝 {job.applications_count} applications</span>
                          <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedJob(job) }}
                          className="text-xs px-4 py-1.5 rounded-lg text-white font-medium"
                          style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                          View & Apply →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY APPLICATIONS */}
      {activeSection === 'applications' && (
        <div>
          {myApplications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No applications yet</h3>
              <button onClick={() => setActiveSection('browse')}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map(app => (
                <div key={app.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                      style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                      {app.company_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800">{app.job_title}</h3>
                          <p className="text-teal-600 text-sm">{app.company_name}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${
                          app.status === 'Hired' ? 'bg-green-100 text-green-700' :
                          app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status === 'Hired' ? '🎉' :
                           app.status === 'Shortlisted' ? '⭐' :
                           app.status === 'Rejected' ? '❌' : '⏳'} {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}