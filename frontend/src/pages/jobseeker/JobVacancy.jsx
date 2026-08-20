import { useState, useEffect } from 'react'
import API from '../../utils/api'

const CATEGORIES = [
  'All', 'Software Engineering', 'Web Development', 'Mobile Development',
  'Data Science', 'UI/UX Design', 'DevOps & Cloud', 'Cybersecurity',
  'Machine Learning & AI', 'Database & SQL', 'Project Management',
  'Quality Assurance', 'Other'
]

const JOB_TYPES = ['All', 'Full Time', 'Part Time', 'Internship', 'Remote', 'Contract']

const theme = {
  bg: '#f6f3ff',
  primary: '#5b56b5',
  primaryDark: '#4d48a3',
  softPurple: '#e9e7f8',
  white: '#ffffff',
  softPanel: '#f3f0fa',
  border: '#e6e3f2',
  mainText: '#25243a',
  secondaryText: '#85839a',
  green: '#5db192',
  softGreen: '#dffff0',
  blue: '#6f8fd4',
  softBlue: '#e3eafb',
  orange: '#e5a26d',
  softOrange: '#ffefe0',
}

// ── Icons ──────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const BriefcaseIcon = ({ size = 4 }) => (
  <svg className={`w-${size} h-${size}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
)
const LocationIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
)
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const CurrencyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
  </svg>
)
const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
)
const PaperClipIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
  </svg>
)
const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)
const XIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
)
const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-3 0H3.75m8.25 6h9.75m-9.75 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-3 0H3.75m8.25 6h9.75m-9.75 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-3 0H3.75" />
  </svg>
)
const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
)
const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
)

export default function JobVacancy() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [myApplications, setMyApplications] = useState([])
  const [activeSection, setActiveSection] = useState('browse') // browse | detail | applications
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [jobType, setJobType] = useState('All')
  const [location, setLocation] = useState('')

  // Apply form
  const [coverLetter, setCoverLetter] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [applying, setApplying] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)

  useEffect(() => {
    fetchJobs()
    fetchMyApplications()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [jobs, search, category, jobType, location])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await API.get('/jobs/all')
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

  const applyFilters = () => {
    let filtered = [...jobs]
    if (category !== 'All') filtered = filtered.filter(j => j.category === category)
    if (jobType !== 'All') filtered = filtered.filter(j => j.job_type === jobType)
    if (location) filtered = filtered.filter(j => j.location.toLowerCase().includes(location.toLowerCase()))
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company_name.toLowerCase().includes(q) ||
        j.required_skills.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
      )
    }
    setFilteredJobs(filtered)
  }

  const handleApply = async () => {
    setApplying(true)
    setError('')
    try {
      await API.post(`/jobs/${selectedJob.id}/apply`, { cover_letter: coverLetter })
      setSuccess('Application submitted successfully!')
      setCoverLetter('')
      setCvFile(null)
      setShowApplyForm(false)
      fetchMyApplications()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply')
    }
    setApplying(false)
  }

  const isApplied = (jobId) => myApplications.some(a => a.job_id === jobId)

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Hired': return { bg: theme.softGreen, color: theme.green, icon: <CheckIcon /> }
      case 'Shortlisted': return { bg: theme.softBlue, color: theme.blue, icon: <StarIcon /> }
      case 'Rejected': return { bg: '#fee2e2', color: '#dc2626', icon: <XIcon /> }
      default: return { bg: theme.softOrange, color: theme.orange, icon: <ClockIcon /> }
    }
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setJobType('All')
    setLocation('')
  }

  // ── JOB DETAIL ──────────────────────────────────────
  if (activeSection === 'detail' && selectedJob) {
    const applied = isApplied(selectedJob.id)
    const myApp = myApplications.find(a => a.job_id === selectedJob.id)
    const statusStyle = myApp ? getStatusStyle(myApp.status) : null

    return (
      <div className="min-h-screen" style={{background: theme.bg}}>
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Back */}
          <button onClick={() => { setActiveSection('browse'); setShowApplyForm(false) }}
            className="flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition"
            style={{color: theme.primary}}>
            <ArrowLeftIcon /> Back to Job Listings
          </button>

          {/* Alerts */}
          {success && (
            <div className="mb-4 p-3 rounded-xl text-sm font-medium"
              style={{background: theme.softGreen, color: theme.green}}>
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm font-medium flex items-center justify-between"
              style={{background: '#fee2e2', color: '#dc2626'}}>
              {error}
              <button onClick={() => setError('')}><XIcon /></button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Main Details */}
            <div className="lg:col-span-2 space-y-5">

              {/* Header Card */}
              <div className="rounded-2xl p-6" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                    style={{background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                    {selectedJob.company_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-bold mb-0.5" style={{color: theme.mainText}}>
                          {selectedJob.title}
                        </h1>
                        <p className="font-semibold" style={{color: theme.primary}}>
                          {selectedJob.company_name}
                        </p>
                      </div>
                      {applied && statusStyle && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0"
                          style={{background: statusStyle.bg, color: statusStyle.color}}>
                          {statusStyle.icon}
                          {myApp.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { icon: <LocationIcon />, label: 'Location', value: selectedJob.location },
                    { icon: <ClockIcon />, label: 'Job Type', value: selectedJob.job_type },
                    { icon: <BriefcaseIcon />, label: 'Category', value: selectedJob.category },
                    { icon: <CurrencyIcon />, label: 'Salary', value: selectedJob.salary_range || 'Negotiable' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{background: theme.softPanel}}>
                      <div className="flex items-center gap-1.5 mb-1" style={{color: theme.secondaryText}}>
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                      </div>
                      <p className="text-sm font-semibold" style={{color: theme.mainText}}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Apply Button */}
                {!applied ? (
                  <button onClick={() => setShowApplyForm(!showApplyForm)}
                    className="w-full py-3 rounded-xl font-bold text-white text-sm transition"
                    style={{background: showApplyForm ? theme.primaryDark : `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                    {showApplyForm ? 'Hide Application Form' : 'Apply for this Position'}
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-xl font-bold text-center text-sm"
                    style={{background: theme.softGreen, color: theme.green}}>
                    ✓ You have applied for this position
                  </div>
                )}
              </div>

              {/* Apply Form */}
              {showApplyForm && !applied && (
                <div className="rounded-2xl p-6" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{background: theme.softPurple}}>
                      <PaperClipIcon />
                    </div>
                    <div>
                      <h3 className="font-bold" style={{color: theme.mainText}}>Submit Application</h3>
                      <p className="text-xs" style={{color: theme.secondaryText}}>Complete your application below</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{color: theme.mainText}}>
                        Cover Letter
                        <span className="text-xs font-normal ml-1" style={{color: theme.secondaryText}}>(optional)</span>
                      </label>
                      <textarea rows={5} value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
                        style={{
                          background: theme.softPanel,
                          border: `1px solid ${theme.border}`,
                          color: theme.mainText,
                          focusRingColor: theme.primary
                        }}
                        placeholder="Tell the company about yourself, your experience and why you're a great fit for this role..." />
                    </div>

                    {/* CV Upload */}
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{color: theme.mainText}}>
                        Attach CV / Resume
                        <span className="text-xs font-normal ml-1" style={{color: theme.secondaryText}}>(optional)</span>
                      </label>
                      <div
                        onClick={() => document.getElementById('cv-upload').click()}
                        className="rounded-xl p-6 text-center cursor-pointer transition hover:opacity-80"
                        style={{
                          background: theme.softPanel,
                          border: `2px dashed ${theme.border}`
                        }}>
                        <input id="cv-upload" type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={e => setCvFile(e.target.files[0])}
                          className="hidden" />
                        <div className="flex justify-center mb-2" style={{color: theme.secondaryText}}>
                          <DocumentIcon />
                        </div>
                        {cvFile ? (
                          <p className="text-sm font-semibold" style={{color: theme.primary}}>
                            ✓ {cvFile.name}
                          </p>
                        ) : (
                          <>
                            <p className="text-sm font-medium" style={{color: theme.mainText}}>
                              Click to upload your CV
                            </p>
                            <p className="text-xs mt-1" style={{color: theme.secondaryText}}>
                              PDF, DOC, DOCX supported
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={handleApply} disabled={applying}
                        className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition"
                        style={{background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button onClick={() => setShowApplyForm(false)}
                        className="px-5 py-3 rounded-xl text-sm font-medium border transition"
                        style={{
                          background: theme.white,
                          border: `1px solid ${theme.border}`,
                          color: theme.secondaryText
                        }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Required Skills */}
              <div className="rounded-2xl p-6" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{color: theme.mainText}}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{background: theme.softBlue}}>
                    <svg className="w-3.5 h-3.5" style={{color: theme.blue}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>
                  </div>
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.required_skills?.split(',').map(skill => (
                    <span key={skill} className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{background: theme.softPurple, color: theme.primary}}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              {selectedJob.experience && (
                <div className="rounded-2xl p-6" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <h3 className="font-bold mb-3 flex items-center gap-2" style={{color: theme.mainText}}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{background: theme.softOrange}}>
                      <svg className="w-3.5 h-3.5" style={{color: theme.orange}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Experience Required
                  </h3>
                  <p className="text-sm px-4 py-3 rounded-xl" style={{background: theme.softPanel, color: theme.mainText}}>
                    {selectedJob.experience}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="rounded-2xl p-6" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{color: theme.mainText}}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{background: theme.softGreen}}>
                    <svg className="w-3.5 h-3.5" style={{color: theme.green}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  Job Description
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{color: theme.mainText}}>
                  {selectedJob.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Company Card */}
              <div className="rounded-2xl p-5" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <h3 className="font-bold mb-4" style={{color: theme.mainText}}>About Company</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                    {selectedJob.company_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{color: theme.mainText}}>{selectedJob.company_name}</p>
                    <p className="text-xs" style={{color: theme.secondaryText}}>IT Company</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm" style={{color: theme.secondaryText}}>
                  <div className="flex items-center gap-2">
                    <LocationIcon />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon />
                    <span>{selectedJob.applications_count} applications</span>
                  </div>
                  {selectedJob.deadline && (
                    <div className="flex items-center gap-2">
                      <ClockIcon />
                      <span>Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* My Application Status */}
              {applied && myApp && (
                <div className="rounded-2xl p-5" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <h3 className="font-bold mb-4" style={{color: theme.mainText}}>Application Status</h3>
                  <div className="space-y-3">
                    {['Pending', 'Shortlisted', 'Hired', 'Rejected'].map((step, i) => {
                      const steps = ['Pending', 'Shortlisted', 'Hired']
                      const currentIdx = steps.indexOf(myApp.status)
                      const stepIdx = steps.indexOf(step)
                      const isRejected = myApp.status === 'Rejected'
                      const isActive = step === myApp.status
                      const isDone = !isRejected && stepIdx < currentIdx

                      return step !== 'Rejected' ? (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                            style={{
                              background: isDone ? theme.green : isActive ? theme.primary : theme.softPanel,
                              color: isDone || isActive ? 'white' : theme.secondaryText
                            }}>
                            {isDone ? <CheckIcon /> : i + 1}
                          </div>
                          <p className="text-sm font-medium"
                            style={{color: isActive ? theme.primary : theme.secondaryText}}>
                            {step}
                          </p>
                          {isActive && (
                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{background: theme.softPurple, color: theme.primary}}>
                              Current
                            </span>
                          )}
                        </div>
                      ) : isRejected && step === 'Rejected' ? (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{background: '#fee2e2'}}>
                            <XIcon />
                          </div>
                          <p className="text-sm font-medium" style={{color: '#dc2626'}}>Rejected</p>
                        </div>
                      ) : null
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t text-xs" style={{borderColor: theme.border, color: theme.secondaryText}}>
                    Applied: {new Date(myApp.applied_at).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Similar Jobs */}
              <div className="rounded-2xl p-5" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <h3 className="font-bold mb-4" style={{color: theme.mainText}}>Similar Jobs</h3>
                <div className="space-y-3">
                  {filteredJobs
                    .filter(j => j.id !== selectedJob.id && j.category === selectedJob.category)
                    .slice(0, 3)
                    .map(j => (
                      <button key={j.id}
                        onClick={() => setSelectedJob(j)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:opacity-80 transition"
                        style={{background: theme.softPanel}}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{background: theme.primary}}>
                          {j.company_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{color: theme.mainText}}>{j.title}</p>
                          <p className="text-xs truncate" style={{color: theme.secondaryText}}>{j.company_name}</p>
                        </div>
                      </button>
                    ))}
                  {filteredJobs.filter(j => j.id !== selectedJob.id && j.category === selectedJob.category).length === 0 && (
                    <p className="text-xs text-center py-2" style={{color: theme.secondaryText}}>No similar jobs found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN BROWSE / APPLICATIONS ───────────────────────
  return (
    <div className="min-h-screen" style={{background: theme.bg}}>
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold mb-0.5" style={{color: theme.mainText}}>Job Vacancies</h1>
          <p className="text-sm" style={{color: theme.secondaryText}}>
            Explore available IT positions and track your applications
          </p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-4 p-3 rounded-xl text-sm font-medium"
            style={{background: theme.softGreen, color: theme.green}}>
            ✓ {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 rounded-2xl" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
          {[
            { id: 'browse', label: `Browse Jobs (${filteredJobs.length})` },
            { id: 'applications', label: `My Applications (${myApplications.length})` },
          ].map(tab => (
            <button key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
              style={activeSection === tab.id
                ? {background: theme.primary, color: 'white'}
                : {color: theme.secondaryText}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── BROWSE ── */}
        {activeSection === 'browse' && (
          <div>
            {/* Search & Filter Bar */}
            <div className="rounded-2xl p-5 mb-5" style={{background: theme.white, border: `1px solid ${theme.border}`}}>

              {/* Search Input */}
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{color: theme.secondaryText}}>
                  <SearchIcon />
                </div>
                <input type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: theme.softPanel,
                    border: `1px solid ${theme.border}`,
                    color: theme.mainText
                  }}
                  placeholder="Search by job title, company, skills or category..." />
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Location */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{color: theme.secondaryText}}>
                    <LocationIcon />
                  </div>
                  <input type="text" value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none"
                    style={{background: theme.softPanel, border: `1px solid ${theme.border}`, color: theme.mainText}}
                    placeholder="Location..." />
                </div>

                {/* Job Type */}
                <div className="relative">
                  <select value={jobType}
                    onChange={e => setJobType(e.target.value)}
                    className="w-full appearance-none rounded-xl px-4 py-2.5 text-sm focus:outline-none pr-8"
                    style={{background: theme.softPanel, border: `1px solid ${theme.border}`, color: theme.mainText}}>
                    {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color: theme.secondaryText}}>
                    <ChevronDownIcon />
                  </div>
                </div>

                {/* Category */}
                <div className="relative">
                  <select value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl px-4 py-2.5 text-sm focus:outline-none pr-8"
                    style={{background: theme.softPanel, border: `1px solid ${theme.border}`, color: theme.mainText}}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color: theme.secondaryText}}>
                    <ChevronDownIcon />
                  </div>
                </div>

                {/* Clear */}
                <button onClick={clearFilters}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition"
                  style={{background: theme.softPurple, color: theme.primary}}>
                  <FilterIcon />
                  Clear Filters
                </button>
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs" style={{color: theme.secondaryText}}>
                  Showing <span className="font-semibold" style={{color: theme.mainText}}>{filteredJobs.length}</span> of{' '}
                  <span className="font-semibold" style={{color: theme.mainText}}>{jobs.length}</span> jobs
                </p>
                {(search || category !== 'All' || jobType !== 'All' || location) && (
                  <div className="flex gap-2 flex-wrap">
                    {category !== 'All' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{background: theme.softPurple, color: theme.primary}}>{category}</span>
                    )}
                    {jobType !== 'All' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{background: theme.softBlue, color: theme.blue}}>{jobType}</span>
                    )}
                    {search && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{background: theme.softGreen, color: theme.green}}>"{search}"</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Jobs Table */}
            {loading ? (
              <div className="text-center py-20 rounded-2xl" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <div className="w-12 h-12 rounded-full border-4 border-t-purple-600 animate-spin mx-auto mb-4"
                  style={{borderColor: theme.softPurple, borderTopColor: theme.primary}}></div>
                <p style={{color: theme.secondaryText}}>Loading job listings...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{background: theme.softPurple}}>
                  <BriefcaseIcon size={7} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{color: theme.mainText}}>No jobs found</h3>
                <p className="text-sm mb-4" style={{color: theme.secondaryText}}>
                  Try adjusting your search or filters
                </p>
                <button onClick={clearFilters}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{background: theme.primary}}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                {/* Table Header */}
                <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold"
                  style={{background: theme.softPanel, color: theme.secondaryText, borderBottom: `1px solid ${theme.border}`}}>
                  <div className="col-span-4">Position</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Salary</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y" style={{borderColor: theme.border}}>
                  {filteredJobs.map((job, i) => {
                    const applied = isApplied(job.id)
                    const myApp = myApplications.find(a => a.job_id === job.id)
                    const statusStyle = myApp ? getStatusStyle(myApp.status) : null

                    return (
                      <div key={job.id}
                        className="grid grid-cols-12 px-5 py-4 items-center hover:opacity-90 transition"
                        style={{background: i % 2 === 0 ? theme.white : theme.bg + '80'}}>

                        {/* Position */}
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                            {job.company_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate" style={{color: theme.mainText}}>{job.title}</p>
                            <p className="text-xs truncate" style={{color: theme.secondaryText}}>{job.company_name}</p>
                          </div>
                        </div>

                        {/* Type */}
                        <div className="col-span-2">
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{background: theme.softPurple, color: theme.primary}}>
                            {job.job_type}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="col-span-2 flex items-center gap-1"
                          style={{color: theme.secondaryText}}>
                          <LocationIcon />
                          <span className="text-xs truncate">{job.location}</span>
                        </div>

                        {/* Salary */}
                        <div className="col-span-2">
                          <span className="text-xs font-medium" style={{color: theme.mainText}}>
                            {job.salary_range || 'Negotiable'}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-1 flex justify-center">
                          {applied && statusStyle ? (
                            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                              style={{background: statusStyle.bg, color: statusStyle.color}}>
                              {statusStyle.icon}
                              <span className="hidden lg:inline">{myApp.status}</span>
                            </span>
                          ) : (
                            <span className="text-xs" style={{color: theme.secondaryText}}>—</span>
                          )}
                        </div>

                        {/* Action */}
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => { setSelectedJob(job); setActiveSection('detail'); setShowApplyForm(false) }}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition hover:opacity-80"
                            style={{background: theme.softPurple, color: theme.primary}}>
                            <EyeIcon />
                            <span className="hidden lg:inline">View</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MY APPLICATIONS ── */}
        {activeSection === 'applications' && (
          <div>
            {myApplications.length === 0 ? (
              <div className="text-center py-20 rounded-2xl"
                style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{background: theme.softPurple}}>
                  <BriefcaseIcon size={7} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{color: theme.mainText}}>No applications yet</h3>
                <p className="text-sm mb-4" style={{color: theme.secondaryText}}>
                  Browse available jobs and start applying
                </p>
                <button onClick={() => setActiveSection('browse')}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{background: theme.primary}}>
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden"
                style={{background: theme.white, border: `1px solid ${theme.border}`}}>

                {/* Table Header */}
                <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold"
                  style={{background: theme.softPanel, color: theme.secondaryText, borderBottom: `1px solid ${theme.border}`}}>
                  <div className="col-span-4">Position</div>
                  <div className="col-span-2">Applied Date</div>
                  <div className="col-span-2">Job Type</div>
                  <div className="col-span-2">Cover Letter</div>
                  <div className="col-span-2 text-center">Status</div>
                </div>

                <div className="divide-y" style={{borderColor: theme.border}}>
                  {myApplications.map((app, i) => {
                    const statusStyle = getStatusStyle(app.status)
                    return (
                      <div key={app.id}
                        className="grid grid-cols-12 px-5 py-4 items-center hover:opacity-90 transition"
                        style={{background: i % 2 === 0 ? theme.white : theme.bg + '80'}}>

                        {/* Position */}
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                            {app.company_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate" style={{color: theme.mainText}}>{app.job_title}</p>
                            <p className="text-xs truncate" style={{color: theme.secondaryText}}>{app.company_name}</p>
                          </div>
                        </div>

                        {/* Applied Date */}
                        <div className="col-span-2">
                          <p className="text-xs" style={{color: theme.mainText}}>
                            {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Job Type */}
                        <div className="col-span-2">
                          <span className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{background: theme.softPurple, color: theme.primary}}>
                            Full Time
                          </span>
                        </div>

                        {/* Cover Letter */}
                        <div className="col-span-2">
                          {app.cover_letter ? (
                            <p className="text-xs italic truncate" style={{color: theme.secondaryText}}>
                              "{app.cover_letter.substring(0, 30)}..."
                            </p>
                          ) : (
                            <p className="text-xs" style={{color: theme.secondaryText}}>No letter</p>
                          )}
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex justify-center">
                          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold"
                            style={{background: statusStyle.bg, color: statusStyle.color}}>
                            {statusStyle.icon}
                            {app.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Summary Footer */}
                <div className="px-5 py-3 flex items-center gap-5 text-xs"
                  style={{background: theme.softPanel, borderTop: `1px solid ${theme.border}`, color: theme.secondaryText}}>
                  <span>Total: <strong style={{color: theme.mainText}}>{myApplications.length}</strong></span>
                  {['Pending', 'Shortlisted', 'Hired', 'Rejected'].map(s => {
                    const count = myApplications.filter(a => a.status === s).length
                    const style = getStatusStyle(s)
                    return count > 0 ? (
                      <span key={s} className="flex items-center gap-1 px-2 py-0.5 rounded-full font-medium"
                        style={{background: style.bg, color: style.color}}>
                        {style.icon} {s}: {count}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}