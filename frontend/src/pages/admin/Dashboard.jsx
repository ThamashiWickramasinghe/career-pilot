import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import AdminProfile from './AdminProfile'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

/* ============================================================
   COLOUR THEME (from provided palette)
   ============================================================ */
const C = {
  bg: '#F2F8EC',

  sidebar: '#7DB343',
  sidebarDark: '#5C8531',
  sidebarDarker: '#4A6B27',
  sidebarText: '#F2F8EC',
  sidebarMuted: '#DCECC8',

  panel: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E4E9DF',

  ink: '#26332A',
  sub: '#7A817B',

  primary: '#7DB343',
  primaryDark: '#5C8531',

  mainBg: '#A8CF72',
  lightGreen: '#DCECC8',
  veryLightGreen: '#F2F8EC',

  green: '#72B53D',
  orange: '#F2A65A',
  red: '#E95D5D',

  teal: '#0EA5D9',
  purple: '#8067D9',

  softPanel: '#F7F8F5'
}

// Soft tints derived from the base palette via opacity, since the
// provided palette only includes solid colours.
const primarySoft = 'rgba(125,179,67,0.14)'
const greenSoft = 'rgba(114,181,61,0.14)'
const orangeSoft = 'rgba(242,166,90,0.16)'
const redSoft = 'rgba(233,93,93,0.14)'
const darkSoft = 'rgba(74,107,39,0.14)'
const tealSoft = 'rgba(14,165,217,0.14)'
const purpleSoft = 'rgba(128,103,217,0.14)'

const cardShadow =
  '0 2px 10px rgba(38, 51, 42, 0.06), 0 1px 3px rgba(38, 51, 42, 0.04)'

// Chart colour set — green as primary, orange as highlight, teal/purple for extra variety
const CHART_COLORS = ['#7DB343', '#F2A65A', '#0EA5D9', '#8067D9']

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

const IconShield = (p) => (
  <Icon {...p} path={<><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></>} />
)

const IconUsers = (p) => (
  <Icon {...p} path={<><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.4 2.9-6 6.5-6s6.5 2.6 6.5 6" /><circle cx="17.5" cy="8.8" r="2.4" /><path d="M15.8 14.3c2.7.5 4.7 2.5 4.7 5.7" /></>} />
)

const IconClipboardList = (p) => (
  <Icon {...p} path={<><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" /><path d="M9 10h6M9 13.5h6M9 17h3.5" /></>} />
)

const IconBriefcase = (p) => (
  <Icon {...p} path={<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M3 12h18" /></>} />
)

const IconBarChart = (p) => (
  <Icon {...p} path={<><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></>} />
)

const IconTrendingUp = (p) => (
  <Icon {...p} path={<><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>} />
)

const IconMegaphone = (p) => (
  <Icon {...p} path={<><path d="M3 11v2a2 2 0 002 2h1l3 5V4l-3 5H5a2 2 0 00-2 2z" /><path d="M13 8a4 4 0 010 8" /><path d="M17 5a8 8 0 010 14" /></>} />
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

const IconCheckCircle = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.7 2.7L16 9.5" /></>} />
)

const IconClock = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>} />
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

const IconFileText = (p) => (
  <Icon {...p} path={<><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /><path d="M9 13h6M9 17h6M9 9.5h2" /></>} />
)

const IconVideo = (p) => (
  <Icon {...p} path={<><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3.2v10.4L16 14" /></>} />
)

const IconNotes = (p) => (
  <Icon {...p} path={<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>} />
)

const IconExternalLink = (p) => (
  <Icon {...p} path={<><path d="M14 3h7v7" /><path d="M21 3l-9.5 9.5" /><path d="M19 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5" /></>} />
)

const IconTag = (p) => (
  <Icon {...p} path={<><path d="M3 12.5V5a2 2 0 012-2h7.5L21 11.5 12.5 20 3 12.5z" /><circle cx="8.3" cy="8.3" r="1.4" /></>} />
)

const IconMail = (p) => (
  <Icon {...p} path={<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 6 10-6" /></>} />
)

const IconDownload = (p) => (
  <Icon {...p} path={<><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></>} />
)

const IconSend = (p) => (
  <Icon {...p} path={<><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></>} />
)

/* ============================================================
   LOOKUPS
   ============================================================ */

const TYPE_META = {
  video_link: { label: 'Video', icon: IconVideo, color: '#0EA5D9', soft: tealSoft },
  pdf: { label: 'PDF', icon: IconFileText, color: '#F2A65A', soft: orangeSoft },
  note: { label: 'Notes', icon: IconNotes, color: '#26332A', soft: 'rgba(38,51,42,0.08)' }
}

const CONTENT_STATUS_STYLE = {
  Approved: { color: '#3F7A22', soft: greenSoft },
  Pending: { color: '#B45309', soft: orangeSoft },
  Rejected: { color: '#B42318', soft: redSoft }
}

const ROLE_LABELS = {
  job_seeker: 'Job Seekers',
  instructor: 'Instructors',
  company: 'Companies',
  admin: 'Admins'
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

function bucketLast6Months(items, dateField) {
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
  items.forEach((it) => {
    const raw = it[dateField]
    if (!raw) return
    const d = new Date(raw)
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
      style={{ background: C.primaryDark, color: '#ffffff', boxShadow: '0 6px 16px rgba(38,51,42,0.25)' }}
    >
      {label && <p className="mb-0.5 opacity-80">{label}</p>}
      {payload.map((p, i) => (
        <p key={i}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('home')
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [pendingContent, setPendingContent] = useState([])
  const [allContent, setAllContent] = useState([])
  const [contentLoading, setContentLoading] = useState(true)
  const [allJobs, setAllJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)

  const [contentFilter, setContentFilter] = useState('all')
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('All')

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [userActionLoading, setUserActionLoading] = useState(null)
  const [jobActionLoading, setJobActionLoading] = useState(null)
  const [readIds, setReadIds] = useState(() => new Set())

  const [reportForm, setReportForm] = useState({
    type: 'Monthly Instructor Performance',
    instructor: 'All Instructors',
    fromDate: '',
    toDate: '',
    format: 'PDF Report',
    email: ''
  })
  const [generatedReports, setGeneratedReports] = useState([])
  const [reportActionLoading, setReportActionLoading] = useState(false)

  const [notificationForm, setNotificationForm] = useState({
    audience: 'All Users',
    title: '',
    message: ''
  })
  const [sentAnnouncements, setSentAnnouncements] = useState([])
  const [notifSendLoading, setNotifSendLoading] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    fetchUsers()
    fetchPendingContent()
    fetchAllContent()
    fetchAllJobs()
  }, [])

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const res = await API.get('/auth/admin/users')
      setUsers(res.data.users || [])
    } catch (err) {
      console.error('Failed to fetch users')
    }
    setUsersLoading(false)
  }

  const fetchPendingContent = async () => {
    try {
      const res = await API.get('/learning/admin/pending')
      setPendingContent(res.data.content || [])
    } catch (err) {
      console.error('Failed to fetch pending content')
    }
  }

  const fetchAllContent = async () => {
    setContentLoading(true)
    try {
      const res = await API.get('/learning/admin/all')
      setAllContent(res.data.content || [])
    } catch (err) {
      console.error('Failed to fetch all content')
    }
    setContentLoading(false)
  }

  const fetchAllJobs = async () => {
    setJobsLoading(true)
    try {
      const res = await API.get('/jobs/admin/all')
      setAllJobs(res.data.jobs || [])
    } catch (err) {
      console.error('Failed to fetch jobs')
    }
    setJobsLoading(false)
  }

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }
  const showError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }

  const handleContentReview = async (contentId, action) => {
    try {
      await API.post(`/learning/admin/content/${contentId}/review`, { action })
      showSuccess(`Content ${action}d successfully!`)
      fetchPendingContent()
      fetchAllContent()
    } catch (err) {
      showError('Failed to review content')
    }
  }

  const handleToggleUserStatus = async (targetUser) => {
    setUserActionLoading(targetUser.id)
    try {
      await API.put(`/auth/admin/users/${targetUser.id}/status`, { is_active: !targetUser.is_active })
      showSuccess(`${targetUser.full_name} ${targetUser.is_active ? 'deactivated' : 'activated'} successfully.`)
      fetchUsers()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update user status')
    }
    setUserActionLoading(null)
  }

  const handleRemoveUser = async (targetUser) => {
    if (!window.confirm(`Remove ${targetUser.full_name}? This cannot be undone.`)) return
    setUserActionLoading(targetUser.id)
    try {
      await API.delete(`/auth/admin/users/${targetUser.id}`)
      showSuccess('User removed successfully.')
      fetchUsers()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to remove user')
    }
    setUserActionLoading(null)
  }

  const handleRemoveJob = async (jobId) => {
    if (!window.confirm('Remove this job post? This cannot be undone.')) return
    setJobActionLoading(jobId)
    try {
      await API.delete(`/jobs/admin/${jobId}`)
      showSuccess('Job removed successfully.')
      fetchAllJobs()
    } catch (err) {
      showError('Failed to remove job')
    }
    setJobActionLoading(null)
  }

  /* ============================================================
     REPORTS — dataset building, CSV/PDF generation, download & email
     ============================================================ */

  const escapeCSVValue = (val) => {
    const s = String(val ?? '')
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }

  const buildCSV = (columns, rows) => {
    const lines = [columns.map(escapeCSVValue).join(',')]
    rows.forEach((row) => lines.push(row.map(escapeCSVValue).join(',')))
    return lines.join('\n')
  }

  const downloadBlob = (content, filename, mime) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Opens a formatted, print-ready report in a new tab and triggers the
  // browser print dialog so the admin can "Save as PDF". This avoids
  // needing an extra PDF-generation dependency for a working download.
  const openPrintableReport = (title, columns, rows) => {
    const win = window.open('', '_blank')
    if (!win) return false
    const headHtml = columns
      .map((c) => `<th style="padding:8px 10px;border:1px solid #E4E9DF;background:#F2F8EC;text-align:left;font-size:12px;color:#26332A;">${c}</th>`)
      .join('')
    const rowsHtml = rows
      .map((r) => `<tr>${r.map((c) => `<td style="padding:8px 10px;border:1px solid #E4E9DF;font-size:12px;color:#26332A;">${c}</td>`).join('')}</tr>`)
      .join('')
    win.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 32px; color: #26332A; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            p.meta { font-size: 12px; color: #7A817B; margin-top: 0; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p class="meta">Career Pilot · Generated on ${new Date().toLocaleString()}</p>
          <table>
            <thead><tr>${headHtml}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print() }, 400)
    return true
  }

  const isDateInRange = (dateStr, fromDate, toDate) => {
    if (!dateStr) return true
    const d = new Date(dateStr)
    if (fromDate && d < new Date(fromDate)) return false
    if (toDate && d > new Date(`${toDate}T23:59:59`)) return false
    return true
  }

  const buildReportDataset = () => {
    const { type, instructor, fromDate, toDate } = reportForm

    if (type === 'Platform Usage Report') {
      return {
        title: 'Platform Usage Report',
        columns: ['Metric', 'Value'],
        rows: [
          ['Total Users', users.length],
          ['Job Seekers', users.filter((u) => u.role === 'job_seeker').length],
          ['Instructors', users.filter((u) => u.role === 'instructor').length],
          ['Companies', users.filter((u) => u.role === 'company').length],
          ['Total Content Items', allContent.length],
          ['Approved Content', allContent.filter((c) => c.is_approved).length],
          ['Pending Content', allContent.filter((c) => !c.is_approved && !c.is_rejected).length],
          ['Rejected Content', allContent.filter((c) => c.is_rejected).length],
          ['Total Job Posts', allJobs.length],
          ['Active Jobs', allJobs.filter((j) => j.is_active).length]
        ]
      }
    }

    if (type === 'User Activity Report') {
      const rows = users
        .filter((u) => isDateInRange(u.created_at, fromDate, toDate))
        .map((u) => [
          u.full_name,
          u.email,
          ROLE_LABELS[u.role] || u.role,
          u.is_active ? 'Active' : 'Inactive',
          u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'
        ])
      return {
        title: 'User Activity Report',
        columns: ['Name', 'Email', 'Role', 'Status', 'Joined'],
        rows: rows.length ? rows : [['No users found for the selected date range', '', '', '', '']]
      }
    }

    // Monthly / Annual Instructor Performance
    const filteredContent = allContent.filter(
      (c) =>
        isDateInRange(c.created_at, fromDate, toDate) &&
        (instructor === 'All Instructors' || c.instructor_name === instructor)
    )
    const grouped = {}
    filteredContent.forEach((c) => {
      const name = c.instructor_name || 'Unknown'
      if (!grouped[name]) grouped[name] = { submitted: 0, approved: 0, pending: 0, rejected: 0 }
      grouped[name].submitted += 1
      if (c.is_approved) grouped[name].approved += 1
      else if (c.is_rejected) grouped[name].rejected += 1
      else grouped[name].pending += 1
    })
    const rows = Object.entries(grouped).map(([name, g]) => [name, g.submitted, g.approved, g.pending, g.rejected])
    return {
      title: type,
      columns: ['Instructor', 'Content Submitted', 'Approved', 'Pending', 'Rejected'],
      rows: rows.length ? rows : [['No content found for the selected filters', '', '', '', '']]
    }
  }

  const addGeneratedReport = (dataset, format, sent) => {
    const entry = {
      id: Date.now(),
      title: dataset.title,
      dateLabel: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: format === 'PDF Report' ? 'PDF' : 'Excel',
      sent,
      columns: dataset.columns,
      rows: dataset.rows
    }
    setGeneratedReports((prev) => [entry, ...prev].slice(0, 10))
  }

  const downloadReportEntry = (entry) => {
    if (entry.type === 'Excel') {
      downloadBlob(buildCSV(entry.columns, entry.rows), `${entry.title.replace(/\s+/g, '_')}.csv`, 'text/csv')
    } else {
      const opened = openPrintableReport(entry.title, entry.columns, entry.rows)
      if (!opened) showError('Please allow pop-ups to download this PDF report.')
    }
  }

  const handleDownloadReport = () => {
    const dataset = buildReportDataset()
    if (reportForm.format === 'Excel Spreadsheet') {
      downloadBlob(buildCSV(dataset.columns, dataset.rows), `${dataset.title.replace(/\s+/g, '_')}.csv`, 'text/csv')
    } else {
      const opened = openPrintableReport(dataset.title, dataset.columns, dataset.rows)
      if (!opened) {
        showError('Please allow pop-ups to download the PDF report.')
        return
      }
    }
    addGeneratedReport(dataset, reportForm.format, false)
    showSuccess('Report downloaded successfully.')
  }

  const handleGenerateAndSend = async () => {
    if (!reportForm.email || !/^\S+@\S+\.\S+$/.test(reportForm.email)) {
      showError('Please enter a valid email address to send the report to.')
      return
    }
    setReportActionLoading(true)
    const dataset = buildReportDataset()
    let sent = false

    try {
      await API.post('/admin/reports/send', {
        report_type: reportForm.type,
        format: reportForm.format,
        instructor: reportForm.instructor,
        from_date: reportForm.fromDate,
        to_date: reportForm.toDate,
        email: reportForm.email,
        columns: dataset.columns,
        rows: dataset.rows
      })
      sent = true
      showSuccess(`Report emailed to ${reportForm.email}.`)
    } catch (err) {
      // No backend email endpoint yet — generate the file locally and open
      // the admin's mail client with a prefilled draft so the report can
      // still be sent manually. Once /admin/reports/send exists server-side
      // (e.g. via Flask-Mail), this whole catch block becomes unnecessary.
      if (reportForm.format === 'Excel Spreadsheet') {
        downloadBlob(buildCSV(dataset.columns, dataset.rows), `${dataset.title.replace(/\s+/g, '_')}.csv`, 'text/csv')
      } else {
        openPrintableReport(dataset.title, dataset.columns, dataset.rows)
      }
      const subject = encodeURIComponent(dataset.title)
      const body = encodeURIComponent(
        `Hi,\n\nPlease find the "${dataset.title}" report — it has been downloaded to your device, please attach it to this email before sending.\n\nGenerated on ${new Date().toLocaleString()}.`
      )
      window.location.href = `mailto:${reportForm.email}?subject=${subject}&body=${body}`
      showSuccess("Email delivery isn't connected to a backend yet — the report was downloaded and your mail client opened so you can attach and send it manually.")
    }

    addGeneratedReport(dataset, reportForm.format, sent)
    setReportActionLoading(false)
  }

  /* ============================================================
     NOTIFICATIONS — send announcement to a user segment
     ============================================================ */

  const audienceCount = (audience) => {
    if (audience === 'Job Seekers Only') return users.filter((u) => u.role === 'job_seeker').length
    if (audience === 'Instructors Only') return users.filter((u) => u.role === 'instructor').length
    if (audience === 'Companies Only') return users.filter((u) => u.role === 'company').length
    return users.length
  }

  const handleSendNotification = async () => {
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      showError('Please add a title and message before sending.')
      return
    }
    setNotifSendLoading(true)
    const recipients = audienceCount(notificationForm.audience)

    try {
      await API.post('/admin/notifications/send', {
        audience: notificationForm.audience,
        title: notificationForm.title,
        message: notificationForm.message
      })
      showSuccess(`Notification sent to ${recipients} user${recipients === 1 ? '' : 's'}.`)
    } catch (err) {
      // No backend endpoint yet — the announcement is still recorded locally
      // so it shows up immediately in Recent Platform Activity. Once
      // /admin/notifications/send exists server-side, delivery becomes real.
      showSuccess(`Notification queued for ${recipients} user${recipients === 1 ? '' : 's'} (delivery isn't connected to a backend endpoint yet, so it hasn't actually been emailed/pushed).`)
    }

    setSentAnnouncements((prev) => [
      {
        id: `announcement-${Date.now()}`,
        title: notificationForm.title,
        message: notificationForm.message,
        audience: notificationForm.audience,
        time: new Date().toISOString()
      },
      ...prev
    ].slice(0, 10))

    setNotificationForm({ audience: notificationForm.audience, title: '', message: '' })
    setNotifSendLoading(false)
  }

  const filteredContent = allContent.filter((item) => {
    if (contentFilter === 'pending') return !item.is_approved && !item.is_rejected
    if (contentFilter === 'approved') return item.is_approved === true
    if (contentFilter === 'rejected') return item.is_rejected === true
    return true
  })

  const filteredUsers = users.filter((u) => {
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter
    const q = userSearch.trim().toLowerCase()
    const matchesSearch = !q ||
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    return matchesRole && matchesSearch
  })

  /* ============================================================
     NAVIGATION
     ============================================================ */

  const navItems = [
    { id: 'home', icon: IconHome, label: 'Home' },
    { id: 'profile', icon: IconShield, label: 'Profile' },
    { id: 'users', icon: IconUsers, label: 'Manage Users' },
    { id: 'content', icon: IconClipboardList, label: 'Manage Content' },
    { id: 'jobs', icon: IconBriefcase, label: 'Manage Jobs' },
    { id: 'analytics', icon: IconBarChart, label: 'Analytics' },
    { id: 'reports', icon: IconTrendingUp, label: 'Reports' },
    { id: 'notifications', icon: IconMegaphone, label: 'Notifications' }
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
     NOTIFICATIONS — pending content + newly registered users
     ============================================================ */

  const notifications = useMemo(() => {
    const contentNotifs = pendingContent.map((item) => ({
      id: `content-${item.id}`,
      text: `"${item.title}" by ${item.instructor_name || 'an instructor'} needs approval`,
      time: item.created_at,
      type: 'content'
    }))
    const userNotifs = users.slice(0, 5).map((u) => ({
      id: `user-${u.id}`,
      text: `${u.full_name} registered as ${ROLE_LABELS[u.role] || u.role}`,
      time: u.created_at,
      type: 'user'
    }))
    const announcementNotifs = sentAnnouncements.map((a) => ({
      id: a.id,
      text: `Announcement "${a.title}" sent to ${a.audience}`,
      time: a.time,
      type: 'announcement'
    }))
    return [...contentNotifs, ...userNotifs, ...announcementNotifs]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 8)
  }, [pendingContent, users, sentAnnouncements])

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length

  const markAllRead = () => setReadIds(new Set(notifications.map((n) => n.id)))

  const handleNotifClick = (n) => {
    setReadIds((prev) => new Set(prev).add(n.id))
    if (n.type === 'content') setActiveTab('content')
    else if (n.type === 'announcement') setActiveTab('notifications')
    else setActiveTab('users')
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

  const registrationDays = useMemo(() => {
    return users
      .filter((u) => u.created_at)
      .map((u) => new Date(u.created_at))
      .filter((d) => d.getMonth() === calMonth && d.getFullYear() === calYear)
      .map((d) => d.getDate())
  }, [users, calMonth, calYear])

  /* ============================================================
     STATS + DERIVED CHART DATA
     ============================================================ */

  const stats = [
    { id: 'users', label: 'Total Users', value: users.length, icon: IconUsers, color: C.primary, soft: primarySoft },
    { id: 'content', label: 'Content Items', value: allContent.length, icon: IconClipboardList, color: C.green, soft: greenSoft },
    { id: 'jobs', label: 'Active Jobs', value: allJobs.filter((j) => j.is_active).length, icon: IconBriefcase, color: C.orange, soft: orangeSoft },
    { id: 'pending', label: 'Pending Review', value: pendingContent.length, icon: IconClock, color: C.purple, soft: purpleSoft }
  ]

  const userGrowthData = useMemo(() => bucketLast6Months(users, 'created_at'), [users])

  const userRoleData = useMemo(() => {
    const counts = {}
    users.forEach((u) => { counts[u.role] = (counts[u.role] || 0) + 1 })
    return Object.entries(counts).map(([role, value]) => ({ name: ROLE_LABELS[role] || role, value }))
  }, [users])

  const activityData = useMemo(() => {
    const jobsTrend = bucketLast6Months(allJobs, 'created_at')
    const contentTrend = bucketLast6Months(allContent, 'created_at')
    return jobsTrend.map((j, i) => ({ month: j.month, jobs: j.count, content: contentTrend[i]?.count || 0 }))
  }, [allJobs, allContent])

  const contentStatusData = useMemo(() => ([
    { name: 'Approved', value: allContent.filter((c) => c.is_approved).length, color: C.green },
    { name: 'Pending', value: allContent.filter((c) => !c.is_approved && !c.is_rejected).length, color: C.orange },
    { name: 'Rejected', value: allContent.filter((c) => c.is_rejected).length, color: C.red }
  ]), [allContent])

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
              style={{ background: C.red }}
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
            <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: C.border }}>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: C.ink }}>Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-[10px] mt-0.5" style={{ color: C.sub }}>{unreadCount} unread</p>
                )}
              </div>
              {notifications.length > 0 && (
                <button className="text-[10px] font-medium hover:underline" style={{ color: C.primary }} onClick={markAllRead}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: C.softPanel }}>
                    <IconBell size={16} color={C.sub} />
                  </div>
                  <p className="text-xs" style={{ color: C.sub }}>You're all caught up</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const unread = !readIds.has(n.id)
                  const NotifIcon = n.type === 'content' ? IconClipboardList : IconUsers
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className="px-4 py-3 flex gap-3 items-start cursor-pointer transition hover:bg-gray-50"
                      style={{ background: unread ? primarySoft : 'transparent' }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: unread ? '#ffffff' : C.softPanel }}>
                        <NotifIcon size={13} color={C.primary} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed" style={{ color: C.ink }}>{n.text}</p>
                        <p className="text-[10px] mt-1" style={{ color: C.sub }}>{timeAgo(n.time)}</p>
                      </div>
                      {unread && <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: C.primary }} />}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

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
          LEFT SIDEBAR — single solid colour, no gradient mix
          ======================================================== */}

      <div
        className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40"
        style={{ background: C.sidebarDark }}
      >
        <div className="px-6 pt-6 pb-12 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.16)' }}>
            <IconSparkle size={24} color="#ffffff" />
          </div>
          <p className="font-bold text-xl" style={{ color: '#ffffff' }}>Career Pilot</p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2.5 overflow-y-auto">
          {navItems.map((item) => {
            const IconComp = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={navBtnClass(item.id)}
                style={active ? { background: 'rgba(255,255,255,0.18)', color: '#ffffff' } : { color: C.sidebarText }}
              >
                <IconComp size={18} color={active ? '#ffffff' : C.sidebarMuted} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            )
          })}

          <div className="mx-1 my-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.14)' }} />

          {secondaryNavItems.map((item) => {
            const IconComp = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={navBtnClass(item.id)}
                style={active ? { background: 'rgba(255,255,255,0.18)', color: '#ffffff' } : { color: C.sidebarText }}
              >
                <IconComp size={18} color={active ? '#ffffff' : C.sidebarMuted} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.14)' }}>
          <div className="flex items-center gap-3 px-2 py-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: '#ffffff' }}>{user?.full_name}</p>
              <p className="text-[11px]" style={{ color: C.sidebarText }}>● Administrator</p>
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
            <div className="mb-4 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5" style={{ background: redSoft, color: '#B42318' }}>
              <IconAlertCircle size={16} color="#B42318" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError('')}><IconX size={14} color="#B42318" /></button>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5" style={{ background: greenSoft, color: '#3F7A22' }}>
              <IconCheckCircle size={16} color="#3F7A22" />
              <span className="flex-1">{success}</span>
              <button onClick={() => setSuccess('')}><IconX size={14} color="#3F7A22" /></button>
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
                  background: `linear-gradient(135deg, ${C.sidebarDarker} 0%, ${C.primary} 70%, ${C.mainBg} 130%)`,
                  boxShadow: '0 8px 24px rgba(92,133,49,0.25)'
                }}
              >
                <div className="relative z-10 max-w-2xl">
                  <h1 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>Welcome back, {user?.full_name || 'there'}! 👋</h1>
                  <p className="text-sm max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Administrator · Managing the Career Pilot platform
                  </p>
                </div>
                <div className="absolute -right-12 -top-16 w-44 h-44 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
                <div className="absolute right-20 -bottom-20 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
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
                      onClick={() => setActiveTab(s.id === 'users' ? 'users' : s.id === 'jobs' ? 'jobs' : 'content')}
                    >
                      <div className="h-1.5 w-full" style={{ background: s.color }} />
                      <div className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.soft }}>
                          <IconComp size={22} color={s.color} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold leading-none" style={{ color: C.ink }}>
                            {(usersLoading || contentLoading || jobsLoading) ? '—' : s.value}
                          </p>
                          <p className="text-xs mt-1.5" style={{ color: C.sub }}>{s.label}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* CHARTS ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconTrendingUp size={16} color={C.orange} />
                    <h2 className="font-bold text-base" style={{ color: C.ink }}>User Growth</h2>
                  </div>
                  <p className="text-xs mb-4" style={{ color: C.sub }}>New registrations over the last 6 months</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={userGrowthData}>
                      <defs>
                        <linearGradient id="userGrowthOrange" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.orange} stopOpacity={0.45} />
                          <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.sub }} axisLine={{ stroke: C.border }} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.sub }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" name="Users" stroke={C.orange} strokeWidth={3} fill="url(#userGrowthOrange)" dot={{ fill: C.orange, r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconUsers size={16} color={C.primary} />
                    <h2 className="font-bold text-base" style={{ color: C.ink }}>User Roles</h2>
                  </div>
                  <p className="text-xs mb-3" style={{ color: C.sub }}>Breakdown by account type</p>
                  {userRoleData.length === 0 ? (
                    <p className="text-sm text-center py-10" style={{ color: C.sub }}>No users yet</p>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie data={userRoleData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                            {userRoleData.map((entry, index) => (
                              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 mt-2">
                        {userRoleData.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                              <span style={{ color: C.sub }}>{item.name}</span>
                            </div>
                            <span className="font-semibold" style={{ color: C.ink }}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* PENDING APPROVALS + RECENT USERS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: C.ink }}>
                      <IconClipboardList size={17} color={C.primary} />
                      Pending Approvals
                    </h2>
                    <button onClick={() => setActiveTab('content')} className="text-xs font-medium hover:underline" style={{ color: C.primary }}>See all</button>
                  </div>
                  {pendingContent.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5" style={{ background: greenSoft }}>
                        <IconCheckCircle size={18} color={C.green} />
                      </div>
                      <p className="text-sm" style={{ color: C.sub }}>No pending approvals</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {pendingContent.slice(0, 3).map((item) => {
                        const meta = TYPE_META[item.content_type] || TYPE_META.note
                        const TypeIcon = meta.icon
                        return (
                          <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl transition hover:opacity-90" style={{ background: C.softPanel }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.soft }}>
                              <TypeIcon size={16} color={meta.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: C.ink }}>{item.title}</p>
                              <p className="text-[11px] truncate" style={{ color: C.sub }}>
                                {item.instructor_name} · {item.category} · {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => handleContentReview(item.id, 'approve')}
                                className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                                style={{ background: C.green }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleContentReview(item.id, 'reject')}
                                className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                                style={{ background: C.red }}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: C.ink }}>
                      <IconUsers size={17} color={C.primary} />
                      Recent Users
                    </h2>
                    <button onClick={() => setActiveTab('users')} className="text-xs font-medium hover:underline" style={{ color: C.primary }}>See all</button>
                  </div>
                  {usersLoading ? (
                    <p className="text-sm text-center py-8" style={{ color: C.sub }}>Loading...</p>
                  ) : users.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: C.sub }}>No users yet</p>
                  ) : (
                    <div className="space-y-3">
                      {users.slice(0, 4).map((u) => (
                        <div key={u.id} className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                          >
                            {u.full_name?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: C.ink }}>{u.full_name}</p>
                            <p className="text-[11px] truncate" style={{ color: C.sub }}>{timeAgo(u.created_at)}</p>
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: primarySoft, color: C.primaryDark }}>
                            {ROLE_LABELS[u.role] || u.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              ANALYTICS
              ==================================================== */}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                <div className="flex items-center gap-2 mb-1">
                  <IconBarChart size={16} color={C.primary} />
                  <h2 className="font-bold text-base" style={{ color: C.ink }}>Platform Activity Overview</h2>
                </div>
                <p className="text-xs mb-4" style={{ color: C.sub }}>Jobs posted vs. content uploaded, last 6 months</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.sub }} axisLine={{ stroke: C.border }} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.sub }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="jobs" name="Jobs Posted" fill={C.primary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="content" name="Content Uploaded" fill={C.orange} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconTrendingUp size={16} color={C.orange} />
                    <h2 className="font-bold text-base" style={{ color: C.ink }}>User Growth Trend</h2>
                  </div>
                  <p className="text-xs mb-4" style={{ color: C.sub }}>Total registrations per month</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={userGrowthData}>
                      <defs>
                        <linearGradient id="userGrowthTrendOrange" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.orange} stopOpacity={0.45} />
                          <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.sub }} axisLine={{ stroke: C.border }} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.sub }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" name="Total Users" stroke={C.orange} strokeWidth={3} fill="url(#userGrowthTrendOrange)" dot={{ fill: C.orange, r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconClipboardList size={16} color={C.primary} />
                    <h2 className="font-bold text-base" style={{ color: C.ink }}>Content Approval Status</h2>
                  </div>
                  <p className="text-xs mb-3" style={{ color: C.sub }}>All submitted content by review status</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={contentStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                        {contentStatusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {contentStatusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                        <span style={{ color: C.sub }}>{item.name}</span>
                        <span className="font-semibold" style={{ color: C.ink }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              USERS
              ==================================================== */}

          {activeTab === 'users' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: C.ink }}>
                  Manage Users
                </h2>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: C.card, boxShadow: cardShadow }}>
                <div className="p-4 border-b flex flex-wrap gap-3" style={{ borderColor: C.border }}>
                  <div className="relative flex-1 min-w-[200px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <IconSearch size={14} color={C.sub} />
                    </div>
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
                      style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
                    style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                  >
                    <option value="All">All Roles</option>
                    <option value="job_seeker">Job Seeker</option>
                    <option value="instructor">Instructor</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {usersLoading ? (
                  <p className="text-sm text-center py-16" style={{ color: C.sub }}>Loading...</p>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: C.softPanel }}>
                      <IconInbox size={24} color={C.sub} />
                    </div>
                    <p className="text-sm" style={{ color: C.sub }}>No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: C.softPanel }}>
                          {['User', 'Email', 'Role', 'Post', 'Status', 'Actions'].map((h) => (
                            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: C.sub }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: C.border }}>
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50 transition">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                  style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                                >
                                  {u.full_name?.charAt(0)}
                                </div>
                                <span className="text-sm font-medium" style={{ color: C.ink }}>{u.full_name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm" style={{ color: C.sub }}>{u.email}</td>
                            <td className="px-5 py-4">
                              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: primarySoft, color: C.primaryDark }}>
                                {ROLE_LABELS[u.role] || u.role}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm" style={{ color: C.sub }}>{u.current_post || u.company_name || '—'}</td>
                            <td className="px-5 py-4">
                              <span
                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                style={u.is_active ? { background: greenSoft, color: '#3F7A22' } : { background: redSoft, color: '#B42318' }}
                              >
                                {u.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleUserStatus(u)}
                                  disabled={userActionLoading === u.id}
                                  className="text-xs px-3 py-1.5 rounded-lg text-white font-medium disabled:opacity-60 flex items-center gap-1.5"
                                  style={{ background: u.is_active ? C.red : C.green }}
                                >
                                  {userActionLoading === u.id ? <IconLoader size={11} /> : null}
                                  {u.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleRemoveUser(u)}
                                  disabled={userActionLoading === u.id}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-80 disabled:opacity-50 flex-shrink-0"
                                  style={{ background: redSoft }}
                                  title="Remove"
                                >
                                  <IconTrash size={13} color="#B42318" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              CONTENT
              ==================================================== */}

          {activeTab === 'content' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: C.ink }}>
                  Manage Content
                </h2>
              </div>

              <div className="flex gap-2.5 mb-5 flex-wrap">
                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setContentFilter(f)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition capitalize"
                    style={
                      contentFilter === f
                        ? { background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`, color: '#ffffff' }
                        : { background: C.card, color: C.sub, border: `1px solid ${C.border}` }
                    }
                  >
                    {f === 'all'
                      ? `All Content (${allContent.length})`
                      : f === 'pending'
                      ? `Pending (${allContent.filter((i) => !i.is_approved && !i.is_rejected).length})`
                      : f === 'approved'
                      ? `Approved (${allContent.filter((i) => i.is_approved).length})`
                      : `Rejected (${allContent.filter((i) => i.is_rejected).length})`}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: C.card, boxShadow: cardShadow }}>
                {contentLoading ? (
                  <div className="text-center py-16">
                    <p className="text-sm" style={{ color: C.sub }}>Loading content...</p>
                  </div>
                ) : filteredContent.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: C.softPanel }}>
                      <IconInbox size={24} color={C.sub} />
                    </div>
                    <p className="text-sm" style={{ color: C.sub }}>No content found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: C.softPanel }}>
                          {['Content', 'Instructor', 'Type', 'Category', 'Submitted', 'Status', 'Actions'].map((h) => (
                            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: C.sub }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: C.border }}>
                        {filteredContent.map((item) => {
                          const meta = TYPE_META[item.content_type] || TYPE_META.note
                          const TypeIcon = meta.icon
                          const statusLabel = item.is_approved ? 'Approved' : item.is_rejected ? 'Rejected' : 'Pending'
                          const statusStyle = CONTENT_STATUS_STYLE[statusLabel]
                          return (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.soft }}>
                                    <TypeIcon size={15} color={meta.color} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate max-w-[180px]" style={{ color: C.ink }}>{item.title}</p>
                                    <p className="text-xs truncate max-w-[180px]" style={{ color: C.sub }}>{item.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-sm" style={{ color: C.sub }}>{item.instructor_name}</td>
                              <td className="px-5 py-4 text-xs font-medium" style={{ color: C.sub }}>{meta.label}</td>
                              <td className="px-5 py-4">
                                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: primarySoft, color: C.primaryDark }}>
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-xs" style={{ color: C.sub }}>{new Date(item.created_at).toLocaleDateString()}</td>
                              <td className="px-5 py-4">
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: statusStyle.soft, color: statusStyle.color }}>
                                  {statusLabel}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex gap-1.5 flex-wrap">
                                  {!item.is_approved && (
                                    <button
                                      onClick={() => handleContentReview(item.id, 'approve')}
                                      className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                                      style={{ background: C.green }}
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {!item.is_rejected && (
                                    <button
                                      onClick={() => handleContentReview(item.id, 'reject')}
                                      className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                                      style={{ background: C.red }}
                                    >
                                      Reject
                                    </button>
                                  )}
                                  {item.drive_link && (
                                    <a
                                      href={item.drive_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                      style={{ background: primarySoft }}
                                      title="Open link"
                                    >
                                      <IconExternalLink size={12} color={C.primaryDark} />
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              JOBS
              ==================================================== */}

          {activeTab === 'jobs' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: C.ink }}>
                  Manage Job Posts
                </h2>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: C.card, boxShadow: cardShadow }}>
                {jobsLoading ? (
                  <div className="text-center py-16">
                    <p className="text-sm" style={{ color: C.sub }}>Loading jobs...</p>
                  </div>
                ) : allJobs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: C.softPanel }}>
                      <IconInbox size={24} color={C.sub} />
                    </div>
                    <p className="text-sm" style={{ color: C.sub }}>No job posts found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: C.softPanel }}>
                          {['Job Title', 'Company', 'Type', 'Location', 'Applications', 'Status', 'Actions'].map((h) => (
                            <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: C.sub }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: C.border }}>
                        {allJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50 transition">
                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold" style={{ color: C.ink }}>{job.title}</p>
                              <p className="text-xs mt-0.5" style={{ color: C.sub }}>{job.category}</p>
                            </td>
                            <td className="px-5 py-4 text-sm" style={{ color: C.sub }}>{job.company_name || 'Company'}</td>
                            <td className="px-5 py-4">
                              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: primarySoft, color: C.primaryDark }}>
                                {job.job_type}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm" style={{ color: C.sub }}>{job.location}</td>
                            <td className="px-5 py-4 text-sm font-semibold" style={{ color: C.ink }}>{job.applications_count ?? '—'}</td>
                            <td className="px-5 py-4">
                              <span
                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                style={job.is_active ? { background: greenSoft, color: '#3F7A22' } : { background: 'rgba(38,51,42,0.08)', color: C.sub }}
                              >
                                {job.is_active ? 'Active' : 'Closed'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => handleRemoveJob(job.id)}
                                disabled={jobActionLoading === job.id}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-80 disabled:opacity-50"
                                style={{ background: redSoft }}
                                title="Remove"
                              >
                                {jobActionLoading === job.id ? <IconLoader size={13} color="#B42318" /> : <IconTrash size={13} color="#B42318" />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              REPORTS
              ==================================================== */}

          {activeTab === 'reports' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: C.ink }}>
                  Generate Reports
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <h3 className="font-bold mb-5 flex items-center gap-2" style={{ color: C.ink }}>
                    Generate Report
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Report Type</label>
                      <select
                        value={reportForm.type}
                        onChange={(e) => setReportForm((f) => ({ ...f, type: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                        style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                      >
                        <option>Monthly Instructor Performance</option>
                        <option>Annual Instructor Performance</option>
                        <option>Platform Usage Report</option>
                        <option>User Activity Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Select Instructor</label>
                      <select
                        value={reportForm.instructor}
                        onChange={(e) => setReportForm((f) => ({ ...f, instructor: e.target.value }))}
                        disabled={reportForm.type === 'Platform Usage Report' || reportForm.type === 'User Activity Report'}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
                        style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                      >
                        <option>All Instructors</option>
                        {users.filter((u) => u.role === 'instructor').map((u) => (
                          <option key={u.id}>{u.full_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>From Date</label>
                        <input
                          type="date"
                          value={reportForm.fromDate}
                          onChange={(e) => setReportForm((f) => ({ ...f, fromDate: e.target.value }))}
                          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                          style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>To Date</label>
                        <input
                          type="date"
                          value={reportForm.toDate}
                          onChange={(e) => setReportForm((f) => ({ ...f, toDate: e.target.value }))}
                          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                          style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Report Format</label>
                      <select
                        value={reportForm.format}
                        onChange={(e) => setReportForm((f) => ({ ...f, format: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                        style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                      >
                        <option>PDF Report</option>
                        <option>Excel Spreadsheet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Send Email To</label>
                      <input
                        type="email"
                        value={reportForm.email}
                        onChange={(e) => setReportForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                        style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                        placeholder="instructor@example.com"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleGenerateAndSend}
                        disabled={reportActionLoading}
                        className="flex-1 py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition hover:shadow-md"
                        style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                      >
                        {reportActionLoading ? <IconLoader size={15} /> : <IconMail size={15} color="#ffffff" />}
                        {reportActionLoading ? 'Sending...' : 'Generate & Send Email'}
                      </button>
                      <button
                        onClick={handleDownloadReport}
                        className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition hover:opacity-80"
                        style={{ border: `1.5px solid ${C.primary}`, color: C.primaryDark }}
                      >
                        <IconDownload size={15} color={C.primaryDark} />
                        Download
                      </button>
                    </div>
                    
                  </div>
                </div>

                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <h3 className="font-bold mb-5 flex items-center gap-2" style={{ color: C.ink }}>
                    <IconClock size={16} color={C.primary} />
                    Recent Reports
                  </h3>
                  {generatedReports.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5" style={{ background: C.softPanel }}>
                        <IconFileText size={18} color={C.sub} />
                      </div>
                      <p className="text-sm" style={{ color: C.sub }}>No reports generated yet</p>
                      <p className="text-xs mt-1" style={{ color: C.sub }}>Generated and sent reports will appear here automatically.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {generatedReports.map((report) => (
                        <div key={report.id} className="flex items-center gap-4 p-3 rounded-xl transition hover:opacity-90" style={{ background: C.softPanel }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: report.type === 'PDF' ? orangeSoft : primarySoft }}>
                            <IconFileText size={17} color={report.type === 'PDF' ? C.orange : C.primary} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: C.ink }}>{report.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: C.sub }}>{report.dateLabel} · {report.type}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {report.sent && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: greenSoft, color: '#3F7A22' }}>Sent</span>
                            )}
                            <button
                              onClick={() => downloadReportEntry(report)}
                              title="Download"
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:opacity-80"
                              style={{ background: primarySoft }}
                            >
                              <IconDownload size={13} color={C.primaryDark} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              NOTIFICATIONS (SEND ANNOUNCEMENTS)
              ==================================================== */}

          {activeTab === 'notifications' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: C.ink }}>
                  Send Notifications
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <h3 className="font-bold mb-5" style={{ color: C.ink }}>Send Announcement</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Send To</label>
                      <select
                        value={notificationForm.audience}
                        onChange={(e) => setNotificationForm((f) => ({ ...f, audience: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                        style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                      >
                        <option>All Users ({users.length})</option>
                        <option>Job Seekers Only ({users.filter((u) => u.role === 'job_seeker').length})</option>
                        <option>Instructors Only ({users.filter((u) => u.role === 'instructor').length})</option>
                        <option>Companies Only ({users.filter((u) => u.role === 'company').length})</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Notification Title</label>
                      <input
                        type="text"
                        value={notificationForm.title}
                        onChange={(e) => setNotificationForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                        style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                        placeholder="e.g. New Feature Available!"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Message</label>
                      <textarea
                        rows={4}
                        value={notificationForm.message}
                        onChange={(e) => setNotificationForm((f) => ({ ...f, message: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
                        style={{ border: `1px solid ${C.border}`, background: C.softPanel, color: C.ink, '--tw-ring-color': C.primary }}
                        placeholder="Write your announcement message..."
                      />
                    </div>
                    <button
                      onClick={handleSendNotification}
                      disabled={notifSendLoading}
                      className="w-full py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition hover:shadow-md"
                      style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}
                    >
                      {notifSendLoading ? <IconLoader size={15} /> : <IconSend size={15} color="#ffffff" />}
                      {notifSendLoading ? 'Sending...' : 'Send Notification'}
                    </button>
                    
                  </div>
                </div>

                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <h3 className="font-bold mb-5" style={{ color: C.ink }}>Recent Platform Activity</h3>
                  <div className="space-y-3">
                    {notifications.length === 0 ? (
                      <p className="text-sm" style={{ color: C.sub }}>No recent activity</p>
                    ) : (
                      notifications.map((n) => {
                        const typeStyle =
                          n.type === 'content'
                            ? { soft: orangeSoft, color: '#B45309', label: 'Content' }
                            : n.type === 'announcement'
                            ? { soft: purpleSoft, color: '#5B3FA6', label: 'Announcement' }
                            : { soft: primarySoft, color: C.primaryDark, label: 'New User' }
                        return (
                          <div key={n.id} className="p-3 rounded-xl transition hover:opacity-90" style={{ background: C.softPanel }}>
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-sm font-medium" style={{ color: C.ink }}>{n.text}</p>
                              <span className="text-[11px] flex-shrink-0 ml-2" style={{ color: C.sub }}>{timeAgo(n.time)}</span>
                            </div>
                            <span
                              className="text-[11px] px-2 py-0.5 rounded-full inline-block mt-1"
                              style={{ background: typeStyle.soft, color: typeStyle.color }}
                            >
                              {typeStyle.label}
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              PROFILE
              ==================================================== */}

          {activeTab === 'profile' && <AdminProfile />}

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
                    q: 'How do I approve or reject content?',
                    a: 'Go to Manage Content, review each submission, and use the Approve or Reject buttons. Approved content becomes visible to job seekers immediately; rejected content is flagged and hidden.'
                  },
                  {
                    q: 'How do I activate or deactivate a user?',
                    a: 'Open Manage Users, find the account, and use the Activate/Deactivate button. Deactivated users lose access to their dashboard until reactivated.'
                  },
                  {
                    q: 'How do I remove a user permanently?',
                    a: 'In Manage Users, click the trash icon next to an account and confirm. This action cannot be undone, so use it only for accounts that should be permanently removed.'
                  },
                  {
                    q: 'How do I remove a job vacancy?',
                    a: 'Go to Manage Jobs and use the delete action next to a listing. This removes the post platform-wide; existing applications tied to it remain in the system.'
                  },
                  {
                    q: 'What do the Analytics charts show?',
                    a: 'Platform Activity compares jobs posted versus content uploaded per month. User Growth Trend tracks total registrations, and Content Approval Status breaks down submissions by review outcome.'
                  },
                  {
                    q: 'How do notifications work?',
                    a: 'The bell icon surfaces newly submitted content awaiting approval and newly registered users. Clicking a notification jumps you to the relevant management tab.'
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
                {d && registrationDays.includes(d) && !isToday(d) && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: C.orange }} />
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-2 flex items-center gap-1.5" style={{ color: C.sub }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.orange }} />
            New user registrations
          </p>
        </div>

        {/* USER ROLE BREAKDOWN */}
        <div className="mb-5">
          <p className="text-xs font-semibold flex items-center gap-2 mb-2.5" style={{ color: C.ink }}>
            <IconUsers size={14} color={C.primary} />
            User Role Breakdown
          </p>
          {usersLoading ? (
            <p className="text-xs" style={{ color: C.sub }}>Loading...</p>
          ) : userRoleData.length === 0 ? (
            <p className="text-xs" style={{ color: C.sub }}>No users yet</p>
          ) : (
            <div className="space-y-2">
              {userRoleData.map((r, i) => (
                <div key={r.name} className="flex items-center gap-3 rounded-xl p-2.5" style={{ background: C.softPanel }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${CHART_COLORS[i % CHART_COLORS.length]}22` }}>
                    <IconUsers size={14} color={CHART_COLORS[i % CHART_COLORS.length]} />
                  </div>
                  <span className="flex-1 text-xs font-medium" style={{ color: C.ink }}>{r.name}</span>
                  <span className="text-xs font-bold" style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTENT STATUS BREAKDOWN */}
        <div>
          <p className="text-xs font-semibold flex items-center gap-2 mb-2.5" style={{ color: C.ink }}>
            <IconTag size={14} color={C.primary} />
            Content Status
          </p>
          {contentLoading ? (
            <p className="text-xs" style={{ color: C.sub }}>Loading...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {contentStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 rounded-full pl-2.5 pr-3 py-1.5" style={{ background: C.softPanel }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-[11px] font-medium" style={{ color: C.ink }}>{item.name}</span>
                  <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
