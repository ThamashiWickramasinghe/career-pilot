import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import CompanyProfile from './CompanyProfile'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

/* ============================================================
   COLOUR THEME (from provided palette)
   ============================================================ */
const C = {
  bg: '#edf9fd',

  sidebar: '#064E73',
  sidebarText: '#CDEAF7',
  sidebarMuted: '#8FC4DC',

  panel: '#FFFFFF',
  card: '#FFFFFF',
  border: '#D8EAF2',

  ink: '#12344D',
  sub: '#64748B',

  primary: '#588ca9',
  primaryDark: '#064E73',
  primarySoft: '#E0F2FE',

  light: '#0EA5D9',
  lightSoft: '#E0F6FD',

  accent: '#F97316',
  accentSoft: '#FFEDD5',

  accent2: '#FBBF24',
  accent2Soft: '#FEF3C7',

  green: '#16A34A',
  greenSoft: '#DCFCE7',

  red: '#DC2626',
  redSoft: '#FEE2E2',

  purple: '#8067D9',
  purpleSoft: '#F0ECFF',

  softPanel: '#F4FAFD'
}

const cardShadow =
  '0 2px 10px rgba(6, 78, 115, 0.06), 0 1px 3px rgba(6, 78, 115, 0.04)'

/* ============================================================
   INLINE SVG ICONS
   ============================================================ */

const Icon = ({ path, size = 18, color = 'currentColor', strokeWidth = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-shrink-0"
  >
    {path}
  </svg>
)

const IconHome = (p) => (
  <Icon {...p} path={<><path d="M3 9l9-7 9 7" /><path d="M9 22V12h6v10" /><path d="M5 10v10a1 1 0 001 1h3M19 10v10a1 1 0 01-1 1h-3" /></>} />
)

const IconPlus = (p) => (
  <Icon {...p} path={<><path d="M12 5v14" /><path d="M5 12h14" /></>} />
)

const IconBriefcase = (p) => (
  <Icon {...p} path={<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M3 12h18" /></>} />
)

const IconClipboardList = (p) => (
  <Icon {...p} path={<><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" /><path d="M9 10h6M9 13.5h6M9 17h3.5" /></>} />
)

const IconBuilding = (p) => (
  <Icon {...p} path={<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /><path d="M10 21v-3h4v3" /></>} />
)

const IconHelp = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 1.8-2.5 3.5" /><path d="M12 17h.01" /></>} />
)

const IconLogout = (p) => (
  <Icon {...p} path={<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>} />
)

const IconSearch = (p) => (
  <Icon {...p} path={<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>} />
)

const IconBell = (p) => (
  <Icon {...p} path={<><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></>} />
)

const IconCalendar = (p) => (
  <Icon {...p} path={<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>} />
)

const IconChevronLeft = (p) => <Icon {...p} path={<path d="M15 18l-6-6 6-6" />} />
const IconChevronRight = (p) => <Icon {...p} path={<path d="M9 18l6-6-6-6" />} />

const IconSparkle = (p) => (
  <Icon {...p} path={<path d="M12 3l1.8 4.9L19 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8L12 3z" />} />
)

const IconUsers = (p) => (
  <Icon {...p} path={<><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.4 2.9-6 6.5-6s6.5 2.6 6.5 6" /><circle cx="17.5" cy="8.8" r="2.4" /><path d="M15.8 14.3c2.7.5 4.7 2.5 4.7 5.7" /></>} />
)

const IconCheckCircle = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.7 2.7L16 9.5" /></>} />
)

const IconClock = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>} />
)

const IconTag = (p) => (
  <Icon {...p} path={<><path d="M3 12.5V5a2 2 0 012-2h7.5L21 11.5 12.5 20 3 12.5z" /><circle cx="8.3" cy="8.3" r="1.4" /></>} />
)

const IconX = (p) => (
  <Icon {...p} path={<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>} />
)

const IconTrash = (p) => (
  <Icon {...p} path={<><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></>} />
)

const IconAlertCircle = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16h.01" /></>} />
)

const IconInbox = (p) => (
  <Icon {...p} path={<><path d="M4 12h4l2 3h4l2-3h4" /><path d="M5.5 5h13l2.5 7v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z" /></>} />
)

const IconLoader = (p) => (
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" className="animate-spin flex-shrink-0">
    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
    <path d="M21 12a9 9 0 00-9-9" stroke={p.trackColor || '#ffffff'} strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const IconMapPin = (p) => (
  <Icon {...p} path={<><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>} />
)

const IconFileText = (p) => (
  <Icon {...p} path={<><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /><path d="M9 13h6M9 17h6M9 9.5h2" /></>} />
)

const IconGraduationCap = (p) => (
  <Icon {...p} path={<><path d="M2 9.5L12 5l10 4.5-10 4.5-10-4.5z" /><path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" /><path d="M22 9.5v6" /></>} />
)

const IconGlobe = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 010 18 15 15 0 010-18z" /></>} />
)

const IconTrendingUp = (p) => (
  <Icon {...p} path={<><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>} />
)

/* ============================================================
   LOOKUPS
   ============================================================ */

const JOB_CATEGORIES = [
  'Software Engineering', 'Web Development', 'Mobile Development',
  'Data Science', 'UI/UX Design', 'DevOps & Cloud', 'Cybersecurity',
  'Machine Learning & AI', 'Database & SQL', 'Project Management',
  'Quality Assurance', 'Other'
]

const JOB_TYPE_META = {
  'Full Time': { icon: IconBriefcase, color: '#075985', soft: '#E0F2FE' },
  'Part Time': { icon: IconClock, color: '#0EA5D9', soft: '#E0F6FD' },
  'Internship': { icon: IconGraduationCap, color: '#8067D9', soft: '#F0ECFF' },
  'Remote': { icon: IconGlobe, color: '#16A34A', soft: '#DCFCE7' },
  'Contract': { icon: IconFileText, color: '#F97316', soft: '#FFEDD5' }
}

const PIE_COLORS = ['#075985', '#0EA5D9', '#F97316', '#8067D9', '#16A34A', '#FBBF24']

const JOB_STATUS_STYLE = {
  Active: { color: '#16A34A', soft: '#DCFCE7' },
  Closed: { color: '#64748B', soft: '#F1F5F9' }
}

const APP_STATUS_STYLE = {
  Pending: { color: '#B45309', soft: '#FEF3C7' },
  Shortlisted: { color: '#075985', soft: '#E0F2FE' },
  Hired: { color: '#16A34A', soft: '#DCFCE7' },
  Rejected: { color: '#DC2626', soft: '#FEE2E2' }
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

function buildMonthlyTrend(applications) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const buckets = []
  let y = now.getFullYear(), m = now.getMonth() + 1
  for (let i = 5; i >= 0; i--) {
    let mm = m - i, yy = y
    while (mm <= 0) { mm += 12; yy -= 1 }
    buckets.push({ yy, mm })
  }
  const counts = {}
  buckets.forEach((b) => { counts[`${b.yy}-${String(b.mm).padStart(2, '0')}`] = 0 })
  applications.forEach((a) => {
    if (!a.applied_at) return
    const d = new Date(a.applied_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (key in counts) counts[key] += 1
  })
  return buckets.map((b) => ({
    month: monthNames[b.mm - 1],
    count: counts[`${b.yy}-${String(b.mm).padStart(2, '0')}`]
  }))
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs font-medium"
      style={{ background: C.primaryDark, color: '#ffffff', boxShadow: '0 6px 16px rgba(6,78,115,0.25)' }}
    >
      <p className="mb-0.5 opacity-80">{label}</p>
      <p>{payload[0].value} application{payload[0].value === 1 ? '' : 's'}</p>
    </div>
  )
}

/* ============================================================
   COMPANY DASHBOARD
   ============================================================ */

export default function CompanyDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('home')
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [myJobs, setMyJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [appFilter, setAppFilter] = useState('All')

  const [jobForm, setJobForm] = useState({
    title: '', category: 'Software Engineering', job_type: 'Full Time',
    location: '', salary_range: '', required_skills: '',
    experience: 'Fresh Graduate / No Experience', description: '', deadline: ''
  })

  useEffect(() => {
    fetchMyJobs()
    fetchApplications()
  }, [])

  const fetchMyJobs = async () => {
    setJobsLoading(true)
    try {
      const res = await API.get('/jobs/my-jobs')
      setMyJobs(res.data.jobs || [])
    } catch (err) {
      console.error('Failed to load jobs')
    }
    setJobsLoading(false)
  }

  const fetchApplications = async () => {
    setApplicationsLoading(true)
    try {
      const res = await API.get('/jobs/applications')
      setApplications(res.data.applications || [])
    } catch (err) {
      console.error('Failed to load applications')
    }
    setApplicationsLoading(false)
  }

  const handlePostJob = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/jobs/post', jobForm)
      setSuccess('Job posted successfully.')
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
    setDeleteLoading(jobId)
    try {
      await API.delete(`/jobs/${jobId}`)
      setSuccess('Job deleted successfully.')
      fetchMyJobs()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete job')
    }
    setDeleteLoading(null)
  }

  const handleUpdateStatus = async (appId, status) => {
    try {
      await API.put(`/jobs/applications/${appId}/status`, { status })
      setSuccess(`Status updated to ${status}.`)
      fetchApplications()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update status')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredApplications = applications.filter((a) =>
    appFilter === 'All' ? true : a.status === appFilter
  )

  /* ============================================================
     NAVIGATION
     ============================================================ */

  const navItems = [
    { id: 'home', icon: IconHome, label: 'Home' },
    { id: 'profile', icon: IconBuilding, label: 'Profile' },
    { id: 'post-job', icon: IconPlus, label: 'Post Job' },
    { id: 'my-jobs', icon: IconBriefcase, label: 'Manage Vacancies' },
    { id: 'applications', icon: IconClipboardList, label: 'Applications' }
  ]

  const secondaryNavItems = [{ id: 'help', icon: IconHelp, label: 'Help' }]

  const allNavItems = [...navItems, ...secondaryNavItems]

  const filteredNavItems = useMemo(() => {
    if (!searchQuery.trim()) return []
    return allNavItems.filter((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  const navBtnClass = (id) =>
    `w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
      activeTab === id ? 'font-semibold' : 'hover:bg-white/10'
    }`

  /* ============================================================
     NOTIFICATIONS
     ============================================================ */

  const notifications = useMemo(() => {
    const recentApps = applications
      .slice()
      .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
      .slice(0, 5)
      .map((a) => ({
        id: `app-${a.id}`,
        text: `${a.applicant_name} applied for "${a.job_title}"`,
        time: a.applied_at,
        type: 'application'
      }))
    return recentApps
  }, [applications])

  const unreadCount = notifications.length

  const handleNotifClick = () => {
    setActiveTab('applications')
    setNotifOpen(false)
  }

  /* ============================================================
     CALENDAR
     ============================================================ */

  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay()
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [calMonth, calYear])

  const goPrevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1) }
    else setCalMonth((m) => m - 1)
  }
  const goNextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1) }
    else setCalMonth((m) => m + 1)
  }

  const isToday = (d) =>
    d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()

  const deadlineDays = useMemo(() => {
    return myJobs
      .filter((j) => j.deadline)
      .map((j) => new Date(j.deadline))
      .filter((d) => d.getMonth() === calMonth && d.getFullYear() === calYear)
      .map((d) => d.getDate())
  }, [myJobs, calMonth, calYear])

  /* ============================================================
     STATS + TREND CHART
     ============================================================ */

  const stats = [
    { id: 'active', label: 'Active Jobs', value: myJobs.filter((j) => j.is_active).length, icon: IconBriefcase, color: C.primary, soft: C.primarySoft },
    { id: 'total', label: 'Total Applications', value: applications.length, icon: IconClipboardList, color: C.light, soft: C.lightSoft },
    { id: 'pending', label: 'Pending', value: applications.filter((a) => a.status === 'Pending').length, icon: IconClock, color: C.accent, soft: C.accentSoft },
    { id: 'hired', label: 'Hired', value: applications.filter((a) => a.status === 'Hired').length, icon: IconCheckCircle, color: C.green, soft: C.greenSoft }
  ]

  const trendData = useMemo(() => buildMonthlyTrend(applications), [applications])

  /* ============================================================
     RIGHT SIDEBAR — job type + category breakdown
     ============================================================ */

  const jobTypeCounts = useMemo(() => {
    const counts = {}
    myJobs.forEach((j) => { counts[j.job_type] = (counts[j.job_type] || 0) + 1 })
    return Object.entries(counts).map(([type, count]) => {
      const meta = JOB_TYPE_META[type] || { icon: IconBriefcase, color: C.primary, soft: C.primarySoft }
      return { id: type, label: type, value: count, icon: meta.icon, color: meta.color, soft: meta.soft }
    })
  }, [myJobs])

  const categoryCounts = useMemo(() => {
    const counts = {}
    myJobs.forEach((j) => {
      const cat = j.category || 'Other'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([category, count], i) => ({ id: category, label: category, count, color: PIE_COLORS[i % PIE_COLORS.length] }))
  }, [myJobs])

  /* ============================================================
     RIGHT SIDEBAR HEADER
     ============================================================ */

  const RightSidebarHeader = () => (
    <div className="flex items-center gap-2 mb-5" style={{ minHeight: '40px' }}>
      <div className="relative flex-1 min-w-0">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <IconSearch size={15} color={C.sub} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 transition"
          style={{ borderColor: C.border, background: C.bg, color: C.ink, '--tw-ring-color': C.primary }}
        />
        {filteredNavItems.length > 0 && (
          <div
            className="absolute left-0 right-0 top-12 rounded-xl shadow-lg border z-50 overflow-hidden"
            style={{ background: C.card, borderColor: C.border }}
          >
            {filteredNavItems.map((item) => {
              const IconComp = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSearchQuery('') }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left hover:bg-gray-50 transition"
                  style={{ color: C.ink }}
                >
                  <IconComp size={14} color={C.primary} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="relative flex-shrink-0">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="w-10 h-10 rounded-xl border flex items-center justify-center transition hover:shadow-sm"
          style={{ background: C.bg, borderColor: C.border }}
          title="Notifications"
        >
          <IconBell size={17} color={C.primary} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-white text-[9px] flex items-center justify-center font-bold"
              style={{ background: C.accent }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div
            className="absolute right-0 top-12 w-80 rounded-2xl shadow-xl border z-50 overflow-hidden"
            style={{ background: C.card, borderColor: C.border }}
          >
            <div className="p-4 border-b" style={{ borderColor: C.border }}>
              <h3 className="font-semibold text-sm" style={{ color: C.ink }}>Notifications</h3>
              <p className="text-[10px] mt-0.5" style={{ color: C.sub }}>Recent applicant activity</p>
            </div>
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: C.softPanel }}>
                    <IconBell size={16} color={C.sub} />
                  </div>
                  <p className="text-xs" style={{ color: C.sub }}>No recent activity</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={handleNotifClick}
                    className="px-4 py-3 flex gap-3 items-start cursor-pointer transition hover:bg-gray-50"
                    style={{ background: C.primarySoft }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#ffffff' }}>
                      <IconClipboardList size={13} color={C.primary} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed" style={{ color: C.ink }}>{n.text}</p>
                      <p className="text-[10px] mt-1" style={{ color: C.sub }}>{timeAgo(n.time)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const inputStyle = {
    background: C.softPanel,
    border: `1px solid ${C.border}`,
    color: C.ink,
    '--tw-ring-color': C.primary,
  }

  /* ============================================================
     MAIN RETURN
     ============================================================ */

  return (
    <div className="min-h-screen flex" style={{ background: C.bg }}>
      <style>{`
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { width: 0; height: 0; display: none; }
      `}</style>

      {/* ========================================================
          LEFT SIDEBAR
          ======================================================== */}

      <div
        className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40"
        style={{ background: C.sidebar }}
      >
        <div className="px-6 pt-6 pb-12 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.14)' }}>
            <IconSparkle size={24} color="#ffffff" />
          </div>
          <p className="font-bold text-xl" style={{ color: '#ffffff' }}>Career Pilot</p>
        </div>

        <nav className="flex-1 px-4 py-1 space-y-2.5 overflow-y-auto">
          {navItems.map((item) => {
            const IconComp = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={navBtnClass(item.id)}
                style={active ? { background: 'rgba(255,255,255,0.14)', color: '#ffffff' } : { color: C.sidebarText }}
              >
                <IconComp size={18} color={active ? '#ffffff' : C.sidebarMuted} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            )
          })}

          <div className="mx-1 my-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {secondaryNavItems.map((item) => {
            const IconComp = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={navBtnClass(item.id)}
                style={active ? { background: 'rgba(255,255,255,0.14)', color: '#ffffff' } : { color: C.sidebarText }}
              >
                <IconComp size={18} color={active ? '#ffffff' : C.sidebarMuted} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          <div className="flex items-center gap-3 px-2 py-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.16)' }}
            >
              {(user?.company_name || user?.full_name)?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: '#ffffff' }}>{user?.company_name || user?.full_name}</p>
              <p className="text-[11px]" style={{ color: C.sidebarText }}>● Active</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-white/10" title="Log out">
              <IconLogout size={16} color={C.sidebarMuted} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN CONTENT
          ======================================================== */}

      <div className="flex-1 lg:ml-64 xl:mr-80">
        <div className="p-6">

          {/* ALERTS */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5" style={{ background: C.redSoft, color: C.red }}>
              <IconAlertCircle size={16} color={C.red} />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError('')}><IconX size={14} color={C.red} /></button>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5" style={{ background: C.greenSoft, color: C.green }}>
              <IconCheckCircle size={16} color={C.green} />
              <span className="flex-1">{success}</span>
              <button onClick={() => setSuccess('')}><IconX size={14} color={C.green} /></button>
            </div>
          )}

          {/* ====================================================
              HOME
              ==================================================== */}

          {activeTab === 'home' && (
            <div>
              <div
                className="relative overflow-hidden rounded-2xl p-6 mb-6"
                style={{
                  background: `linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 100%)`,
                  boxShadow: '0 8px 24px rgba(6,78,115,0.20)'
                }}
              >
                <div className="relative z-10 max-w-2xl">
                  <h1 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>
                    Welcome back, {user?.company_name || user?.full_name || 'there'}! 👋
                  </h1>
                  <p className="text-sm max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    Company Account · Find the best IT talent for your team.
                  </p>
                </div>
                <div className="absolute -right-12 -top-16 w-44 h-44 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
                <div className="absolute right-20 -bottom-20 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stats.map((s) => {
                  const IconComp = s.icon
                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                      style={{ background: C.card, boxShadow: cardShadow }}
                      onClick={() => setActiveTab(s.id === 'active' ? 'my-jobs' : 'applications')}
                    >
                      <div className="h-1.5 w-full" style={{ background: s.color }} />
                      <div className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.soft }}>
                          <IconComp size={22} color={s.color} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold leading-none" style={{ color: C.ink }}>
                            {(jobsLoading || applicationsLoading) ? '—' : s.value}
                          </p>
                          <p className="text-xs mt-1.5" style={{ color: C.sub }}>{s.label}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* APPLICATIONS TREND CHART */}
              <div className="rounded-2xl p-6 mb-6" style={{ background: C.card, boxShadow: cardShadow }}>
                <div className="flex items-center gap-2 mb-1">
                  <IconTrendingUp size={16} color={C.primary} />
                  <h2 className="font-bold text-base" style={{ color: C.ink }}>Applications Received</h2>
                </div>
                <p className="text-xs mb-4" style={{ color: C.sub }}>Applicant volume over the last 6 months</p>

                <div style={{ width: '100%', height: 240 }}>
                  <ResponsiveContainer>
                    <AreaChart data={trendData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.primary} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={C.primary} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.sub }} axisLine={{ stroke: C.border }} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.sub }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={C.primary}
                        strokeWidth={2.5}
                        fill="url(#colorApps)"
                        dot={{ r: 3, fill: C.primary, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: C.primary }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* MY JOB POSTS + RECENT APPLICATIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: C.ink }}>
                      <IconBriefcase size={17} color={C.primary} />
                      My Job Posts
                    </h2>
                    <button onClick={() => setActiveTab('my-jobs')} className="text-xs font-medium hover:underline" style={{ color: C.primary }}>
                      See all
                    </button>
                  </div>

                  {jobsLoading ? (
                    <p className="text-sm text-center py-10" style={{ color: C.sub }}>Loading...</p>
                  ) : myJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5" style={{ background: C.softPanel }}>
                        <IconInbox size={18} color={C.sub} />
                      </div>
                      <p className="text-sm" style={{ color: C.sub }}>No jobs posted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {myJobs.slice(0, 4).map((job) => {
                        const status = job.is_active ? 'Active' : 'Closed'
                        const style = JOB_STATUS_STYLE[status]
                        return (
                          <div
                            key={job.id}
                            onClick={() => setActiveTab('my-jobs')}
                            className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition hover:opacity-80"
                            style={{ background: C.softPanel }}
                          >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.primarySoft }}>
                              <IconBriefcase size={16} color={C.primary} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: C.ink }}>{job.title}</p>
                              <p className="text-[11px] truncate" style={{ color: C.sub }}>
                                {job.job_type} · {job.applications_count} applications
                              </p>
                            </div>
                            <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: style.soft, color: style.color }}>
                              {status}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: C.ink }}>
                      <IconClipboardList size={17} color={C.primary} />
                      Recent Applications
                    </h2>
                    <button onClick={() => setActiveTab('applications')} className="text-xs font-medium hover:underline" style={{ color: C.primary }}>
                      See all
                    </button>
                  </div>

                  {applicationsLoading ? (
                    <p className="text-sm text-center py-10" style={{ color: C.sub }}>Loading...</p>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5" style={{ background: C.softPanel }}>
                        <IconInbox size={18} color={C.sub} />
                      </div>
                      <p className="text-sm" style={{ color: C.sub }}>No applications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {applications.slice(0, 4).map((app) => {
                        const style = APP_STATUS_STYLE[app.status] || APP_STATUS_STYLE.Pending
                        return (
                          <div
                            key={app.id}
                            onClick={() => setActiveTab('applications')}
                            className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition hover:opacity-80"
                            style={{ background: C.softPanel }}
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                              style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                            >
                              {app.applicant_name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: C.ink }}>{app.applicant_name}</p>
                              <p className="text-[11px] truncate" style={{ color: C.sub }}>{app.job_title}</p>
                            </div>
                            <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: style.soft, color: style.color }}>
                              {app.status}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              POST JOB
              ==================================================== */}

          {activeTab === 'post-job' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: C.ink }}>
                  
                  Post Your Job Vacancy
                </h2>
              </div>

              <form onSubmit={handlePostJob} className="max-w-2xl mx-auto rounded-2xl p-6 space-y-5" style={{ background: C.card, boxShadow: cardShadow }}>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Job Title <span style={{ color: C.red }}>*</span></label>
                  <input
                    required
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                    style={inputStyle}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Job Type <span style={{ color: C.red }}>*</span></label>
                    <select
                      value={jobForm.job_type}
                      onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                      style={inputStyle}
                    >
                      {['Full Time', 'Part Time', 'Internship', 'Remote', 'Contract'].map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Category <span style={{ color: C.red }}>*</span></label>
                    <select
                      value={jobForm.category}
                      onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                      style={inputStyle}
                    >
                      {JOB_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Location <span style={{ color: C.red }}>*</span></label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <IconMapPin size={15} color={C.sub} />
                      </div>
                      <input
                        required
                        type="text"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                        style={inputStyle}
                        placeholder="e.g. Colombo, Sri Lanka"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Salary Range</label>
                    <input
                      type="text"
                      value={jobForm.salary_range}
                      onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                      style={inputStyle}
                      placeholder="e.g. LKR 80,000 - 120,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Required Skills <span style={{ color: C.red }}>*</span></label>
                  <input
                    required
                    type="text"
                    value={jobForm.required_skills}
                    onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                    style={inputStyle}
                    placeholder="e.g. React, JavaScript, CSS (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Experience Required</label>
                  <select
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                    style={inputStyle}
                  >
                    {['Fresh Graduate / No Experience', '1 - 2 Years', '2 - 3 Years', '3 - 5 Years', '5+ Years'].map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Job Description <span style={{ color: C.red }}>*</span></label>
                  <textarea
                    required
                    rows={5}
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition resize-none"
                    style={inputStyle}
                    placeholder="Describe the role, responsibilities and requirements..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Application Deadline</label>
                  <input
                    type="date"
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition disabled:opacity-60 flex items-center justify-center gap-2 hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                >
                  {loading ? <IconLoader size={16} /> : <IconPlus size={16} color="#ffffff" />}
                  {loading ? 'Posting...' : 'Post Job Vacancy'}
                </button>
              </form>
            </div>
          )}

          {/* ====================================================
              MY JOBS
              ==================================================== */}

          {activeTab === 'my-jobs' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: C.ink }}>
                    
                    My Job Posts
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('post-job')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:shadow-md"
                  style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                >
                  <IconPlus size={15} color="#ffffff" />
                  Post New Job
                </button>
              </div>

              {jobsLoading ? (
                <div className="text-center py-20 rounded-2xl" style={{ background: C.card, boxShadow: cardShadow }}>
                  <p className="text-sm" style={{ color: C.sub }}>Loading...</p>
                </div>
              ) : myJobs.length === 0 ? (
                <div className="text-center py-20 rounded-2xl" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: C.softPanel }}>
                    <IconInbox size={24} color={C.sub} />
                  </div>
                  <h3 className="text-base font-bold mb-1.5" style={{ color: C.ink }}>No jobs posted yet</h3>
                  <button
                    onClick={() => setActiveTab('post-job')}
                    className="mt-3 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: C.softPanel }}>
                          {['Job Title', 'Type', 'Location', 'Applications', 'Deadline', 'Status', 'Actions'].map((h) => (
                            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: C.sub }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: C.border }}>
                        {myJobs.map((job) => {
                          const status = job.is_active ? 'Active' : 'Closed'
                          const style = JOB_STATUS_STYLE[status]
                          return (
                            <tr key={job.id} className="hover:bg-gray-50 transition">
                              <td className="px-5 py-4">
                                <p className="text-sm font-semibold" style={{ color: C.ink }}>{job.title}</p>
                                <p className="text-xs mt-0.5" style={{ color: C.sub }}>{job.category}</p>
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: C.primarySoft, color: C.primaryDark }}>
                                  {job.job_type}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-sm" style={{ color: C.sub }}>{job.location}</td>
                              <td className="px-5 py-4 text-sm font-semibold" style={{ color: C.ink }}>{job.applications_count}</td>
                              <td className="px-5 py-4 text-xs" style={{ color: C.sub }}>
                                {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: style.soft, color: style.color }}>
                                  {status}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => handleDeleteJob(job.id)}
                                  disabled={deleteLoading === job.id}
                                  title="Delete"
                                  className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-80 disabled:opacity-50"
                                  style={{ background: C.redSoft }}
                                >
                                  {deleteLoading === job.id ? <IconLoader size={13} color={C.red} /> : <IconTrash size={14} color={C.red} />}
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              APPLICATIONS
              ==================================================== */}

          {activeTab === 'applications' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: C.ink }}>
                  Job Applications
                </h2>
              </div>

              <div className="flex flex-wrap gap-2.5 mb-5">
                {['All', 'Pending', 'Shortlisted', 'Hired', 'Rejected'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setAppFilter(f)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition"
                    style={
                      appFilter === f
                        ? { background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`, color: '#ffffff' }
                        : { background: C.card, color: C.sub, border: `1px solid ${C.border}` }
                    }
                  >
                    {f} {f !== 'All' && `(${applications.filter((a) => a.status === f).length})`}
                  </button>
                ))}
              </div>

              {applicationsLoading ? (
                <div className="text-center py-20 rounded-2xl" style={{ background: C.card, boxShadow: cardShadow }}>
                  <p className="text-sm" style={{ color: C.sub }}>Loading...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-20 rounded-2xl" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: C.softPanel }}>
                    <IconInbox size={24} color={C.sub} />
                  </div>
                  <p className="text-sm" style={{ color: C.sub }}>No applications found</p>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: C.softPanel }}>
                          {['Applicant', 'Job', 'Skills', 'Applied', 'Status', 'Update', 'Cover Letter'].map((h) => (
                            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: C.sub }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: C.border }}>
                        {filteredApplications.map((app) => {
                          const style = APP_STATUS_STYLE[app.status] || APP_STATUS_STYLE.Pending
                          return (
                            <tr key={app.id} className="hover:bg-gray-50 transition">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                    style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                                  >
                                    {app.applicant_name?.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate" style={{ color: C.ink }}>{app.applicant_name}</p>
                                    <p className="text-xs truncate" style={{ color: C.sub }}>{app.applicant_email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-sm" style={{ color: C.ink }}>{app.job_title}</td>
                              <td className="px-5 py-4">
                                <div className="flex flex-wrap gap-1 max-w-32">
                                  {app.applicant_skills?.split(',').slice(0, 2).map((s) => (
                                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: C.primarySoft, color: C.primaryDark }}>
                                      {s.trim()}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-5 py-4 text-xs" style={{ color: C.sub }}>
                                {new Date(app.applied_at).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: style.soft, color: style.color }}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <select
                                  value={app.status}
                                  onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                  className="text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 transition"
                                  style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink }}
                                >
                                  {['Pending', 'Shortlisted', 'Hired', 'Rejected'].map((s) => <option key={s}>{s}</option>)}
                                </select>
                              </td>
                              <td className="px-5 py-4">
                                {app.cover_letter ? (
                                  <span className="text-xs italic truncate max-w-24 block" style={{ color: C.sub }}>
                                    "{app.cover_letter.substring(0, 30)}..."
                                  </span>
                                ) : (
                                  <span className="text-xs" style={{ color: C.sub }}>No letter</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              COMPANY PROFILE
              ==================================================== */}

          {activeTab === 'profile' && <CompanyProfile />}

          {/* ====================================================
              HELP
              ==================================================== */}

          {activeTab === 'help' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ color: C.ink }}>Help & Guidelines</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    q: 'How do I post a new job?',
                    a: 'Go to Post Job, fill in the title, type, category, location, required skills, and description, then submit. Your listing appears immediately under My Job Posts.'
                  },
                  {
                    q: 'How do I review applications?',
                    a: 'Open the Applications tab to see every applicant across your job posts. Use the filter chips to narrow by status, and check the Skills and Cover Letter columns before deciding.'
                  },
                  {
                    q: "How do I update an applicant's status?",
                    a: 'Use the Update dropdown in the Applications table to move a candidate between Pending, Shortlisted, Hired, or Rejected. The change is saved immediately.'
                  },
                  {
                    q: 'How do I close or remove a job post?',
                    a: 'Go to My Job Posts and use the delete action next to a listing. This permanently removes the post — applicants who already applied remain in your Applications list.'
                  },
                  {
                    q: 'What do the Dashboard stat cards mean?',
                    a: '"Active Jobs" counts currently open listings. "Total Applications" and "Pending" track applicant volume awaiting review. "Hired" counts candidates you have marked as hired.'
                  },
                  {
                    q: 'What does the Applications Received chart show?',
                    a: 'It plots how many applications you have received per month over the last 6 months, so you can see whether interest in your listings is growing.'
                  }
                ].map((item) => (
                  <div key={item.q} className="rounded-2xl p-5" style={{ background: C.card, boxShadow: cardShadow }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: C.ink }}>{item.q}</p>
                    <p className="text-xs leading-relaxed" style={{ color: C.sub }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          RIGHT SIDEBAR
          ======================================================== */}

      <div
        className="hidden xl:flex flex-col w-80 h-screen fixed right-0 top-0 z-30 border-l overflow-hidden p-5"
        style={{ background: C.panel, borderColor: C.border }}
      >
        <RightSidebarHeader />

        {/* CALENDAR */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: C.ink }}>
              <IconCalendar size={15} color={C.primary} />
              {monthNames[calMonth]} {calYear}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={goPrevMonth} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100">
                <IconChevronLeft size={14} color={C.sub} />
              </button>
              <button onClick={goNextMonth} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-gray-100">
                <IconChevronRight size={14} color={C.sub} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold py-0.5" style={{ color: C.sub }}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => (
              <div
                key={i}
                className="aspect-square flex flex-col items-center justify-center rounded-full relative text-[11px]"
                style={{
                  background: d && isToday(d) ? C.primaryDark : 'transparent',
                  color: d && isToday(d) ? '#ffffff' : d ? C.ink : 'transparent',
                  fontWeight: d && isToday(d) ? 700 : 500
                }}
              >
                {d || ''}
                {d && deadlineDays.includes(d) && !isToday(d) && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: C.accent }} />
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-2 flex items-center gap-1.5" style={{ color: C.sub }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.accent }} />
            Job application deadlines
          </p>
        </div>

        {/* JOB TYPE COUNTS */}
        <div className="mb-5">
          <p className="text-xs font-semibold flex items-center gap-2 mb-2.5" style={{ color: C.ink }}>
            <IconBriefcase size={14} color={C.primary} />
            Job Type Breakdown
          </p>

          {jobsLoading ? (
            <p className="text-xs" style={{ color: C.sub }}>Loading...</p>
          ) : jobTypeCounts.length === 0 ? (
            <p className="text-xs" style={{ color: C.sub }}>No jobs yet</p>
          ) : (
            <div className="space-y-2">
              {jobTypeCounts.map((t) => {
                const IconComp = t.icon
                return (
                  <div key={t.id} className="flex items-center gap-3 rounded-xl p-2.5" style={{ background: C.softPanel }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: t.soft }}>
                      <IconComp size={15} color={t.color} />
                    </div>
                    <span className="flex-1 text-xs font-medium" style={{ color: C.ink }}>{t.label}</span>
                    <span className="text-xs font-bold" style={{ color: t.color }}>{t.value}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* CATEGORY BREAKDOWN */}
        <div>
          <p className="text-xs font-semibold flex items-center gap-2 mb-2.5" style={{ color: C.ink }}>
            <IconTag size={14} color={C.primary} />
            Posted Job Categories
          </p>

          {jobsLoading ? (
            <p className="text-xs" style={{ color: C.sub }}>Loading...</p>
          ) : categoryCounts.length === 0 ? (
            <p className="text-xs" style={{ color: C.sub }}>No categories yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categoryCounts.map((cat) => (
                <div key={cat.id} className="flex items-center gap-1.5 rounded-full pl-2.5 pr-3 py-1.5" style={{ background: C.softPanel }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                  <span className="text-[11px] font-medium" style={{ color: C.ink }}>{cat.label}</span>
                  <span className="text-[10px] font-bold" style={{ color: cat.color }}>{cat.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
