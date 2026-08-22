import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import PostContent from './PostContent'
import ManageContent from './ManageContent'
import Profile from './Profile'
import Analytics from './Analytics'

/* ============================================================
   COLOUR THEME
   ============================================================ */
const C = {
  bg: '#F7F9FC',

  sidebar: '#102A43',
  sidebarDark: '#0B1F33',
  sidebarText: '#D9E2EC',
  sidebarMuted: '#829AB1',

  panel: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E6EAF0',

  ink: '#243B53',
  sub: '#829AB1',

  accent: '#394d5e',
  accentDark: '#102A43',
  accentSoft: '#E8F1FF',

  teal: '#20A39E',
  tealDark: '#16847F',
  tealSoft: '#E4F7F5',

  green: '#2FB171',
  greenSoft: '#E7F8EF',

  orange: '#F4A340',
  orangeSoft: '#FFF2DE',

  red: '#EF625C',
  redSoft: '#FDEAE9',

  purple: '#8067D9',
  purpleSoft: '#F0ECFF',

  softPanel: '#F5F7FA'
}

const cardShadow =
  '0 2px 10px rgba(16, 42, 67, 0.06), 0 1px 3px rgba(16, 42, 67, 0.04)'

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

const IconUser = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" /></>} />
)

const IconUpload = (p) => (
  <Icon {...p} path={<><path d="M12 3v12" /><path d="M7 8l5-5 5 5" /><path d="M5 21h14" /></>} />
)

const IconClipboardList = (p) => (
  <Icon {...p} path={<><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" /><path d="M9 10h6M9 13.5h6M9 17h3.5" /></>} />
)

const IconBarChart = (p) => (
  <Icon {...p} path={<><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></>} />
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

const IconRefreshCcw = (p) => (
  <Icon {...p} path={<><path d="M3 12a9 9 0 0115-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 01-15 6.7L3 16" /><path d="M3 21v-5h5" /></>} />
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

const IconVideo = (p) => (
  <Icon {...p} path={<><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3.2v10.4L16 14" /></>} />
)

const IconFileText = (p) => (
  <Icon {...p} path={<><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /><path d="M9 13h6M9 17h6M9 9.5h2" /></>} />
)

const IconNotes = (p) => (
  <Icon {...p} path={<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>} />
)

const IconX = (p) => (
  <Icon {...p} path={<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>} />
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

/* ============================================================
   LOOKUPS
   ============================================================ */

const TYPE_META = {
  video_link: { label: 'Video', icon: IconVideo, color: '#1769E0', soft: '#E8F1FF' },
  pdf: { label: 'PDF', icon: IconFileText, color: '#2FB171', soft: '#E7F8EF' },
  note: { label: 'Notes', icon: IconNotes, color: '#8067D9', soft: '#F0ECFF' }
}

const PIE_COLORS = ['#1769E0', '#2FB171', '#8067D9', '#F4A340', '#EF625C', '#20A39E']

const STATUS_STYLE = {
  Approved: { color: '#2FB171', soft: '#E7F8EF' },
  Pending: { color: '#F4A340', soft: '#FFF2DE' },
  Rejected: { color: '#EF625C', soft: '#FDEAE9' }
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

/* ============================================================
   INSTRUCTOR DASHBOARD
   ============================================================ */

export default function InstructorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('home')
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [contents, setContents] = useState([])
  const [contentsLoading, setContentsLoading] = useState(true)
  const [reaccessRequests, setReaccessRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  const [readIds, setReadIds] = useState(() => new Set())
  const [respondingId, setRespondingId] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)

  useEffect(() => {
    fetchMyContent()
    fetchReaccessRequests()
    fetchAnalytics()
  }, [])

  const fetchMyContent = async () => {
    setContentsLoading(true)
    try {
      const res = await API.get('/learning/my-content')
      setContents(res.data.content || [])
    } catch (err) {
      console.error('Failed to load content')
    }
    setContentsLoading(false)
  }

  const fetchReaccessRequests = async () => {
    setRequestsLoading(true)
    try {
      const res = await API.get('/learning/reaccess/requests')
      setReaccessRequests(res.data.requests || [])
    } catch (err) {
      console.error('Failed to load requests')
    }
    setRequestsLoading(false)
  }

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const res = await API.get('/learning/analytics')
      setAnalytics(res.data)
    } catch (err) {
      console.error('Failed to load analytics')
    }
    setAnalyticsLoading(false)
  }

  const handleRespond = async (requestId, action) => {
    setRespondingId(requestId)
    try {
      await API.post(`/learning/reaccess/${requestId}/respond`, { action })
      setActionMessage({ type: 'success', text: `Request ${action} successfully.` })
      await fetchReaccessRequests()
      fetchAnalytics()
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to respond to request' })
    }
    setRespondingId(null)
    setTimeout(() => setActionMessage(null), 3000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  /* ============================================================
     NAVIGATION
     ============================================================ */

  const navItems = [
    { id: 'home', icon: IconHome, label: 'Dashboard' },
    { id: 'profile', icon: IconUser, label: 'Profile' },
    { id: 'post-content', icon: IconUpload, label: 'Post Content' },
    { id: 'manage-content', icon: IconClipboardList, label: 'Manage Content' },
    { id: 'analytics', icon: IconBarChart, label: 'Analytics' }
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
     NOTIFICATIONS — built from live re-access requests
     (student → instructor) and content approval/rejection
     (admin → instructor)
     ============================================================ */

  const notifications = useMemo(() => {
    const reaccessNotifs = reaccessRequests.map((r) => ({
      id: `reaccess-${r.id}`,
      text: `${r.user_name || 'A student'} requested re-access to "${r.content_title}"`,
      time: r.requested_at,
      type: 'reaccess'
    }))

    const decisionNotifs = contents
      .filter((c) => c.is_approved || c.is_rejected)
      .map((c) => ({
        id: `content-${c.id}`,
        text: c.is_approved
          ? `Your content "${c.title}" was approved`
          : `Your content "${c.title}" was rejected`,
        time: c.created_at,
        type: c.is_approved ? 'approved' : 'rejected'
      }))

    return [...reaccessNotifs, ...decisionNotifs]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 8)
  }, [reaccessRequests, contents])

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)))
  }

  const handleNotifClick = (n) => {
    setReadIds((prev) => new Set(prev).add(n.id))
    setActiveTab('manage-content')
    setNotifOpen(false)
  }

  const notifIcon = (type) => {
    if (type === 'reaccess') return { Icon: IconRefreshCcw, color: C.accent }
    if (type === 'approved') return { Icon: IconCheckCircle, color: C.green }
    return { Icon: IconX, color: C.red }
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

  const eventDays = [9, 12, 20]

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay()
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [calMonth, calYear])

  const goPrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11)
      setCalYear((y) => y - 1)
    } else {
      setCalMonth((m) => m - 1)
    }
  }

  const goNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0)
      setCalYear((y) => y + 1)
    } else {
      setCalMonth((m) => m + 1)
    }
  }

  const isToday = (d) =>
    d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()

  /* ============================================================
     LIVE STATS (from /learning/analytics + /learning/my-content
     + /learning/reaccess/requests)
     ============================================================ */

  const stats = [
    {
      id: 'content',
      label: 'Content Posted',
      value: analytics?.total_content ?? contents.length,
      icon: IconClipboardList, color: C.accent, soft: C.accentSoft
    },
    {
      id: 'students',
      label: 'Students Reached',
      value: analytics?.students_reached ?? 0,
      icon: IconUsers, color: C.teal, soft: C.tealSoft
    },
    {
      id: 'requests',
      label: 'Re-Access Requests',
      value: reaccessRequests.length,
      icon: IconRefreshCcw, color: C.orange, soft: C.orangeSoft
    },
    {
      id: 'approved',
      label: 'Approved Content',
      value: analytics?.approved_count ?? 0,
      icon: IconCheckCircle, color: C.green, soft: C.greenSoft
    }
  ]

  /* ============================================================
     REACH PIE CHART — from analytics.top_content (real student
     access counts per content item)
     ============================================================ */

  const reachData = (analytics?.top_content || []).filter((c) => c.students > 0)
  const reachTotal = reachData.reduce((sum, c) => sum + c.students, 0)

  const pieGradient = useMemo(() => {
    if (reachTotal === 0) return null
    let cursor = 0
    const stops = reachData.map((c, i) => {
      const start = (cursor / reachTotal) * 360
      cursor += c.students
      const end = (cursor / reachTotal) * 360
      return `${PIE_COLORS[i % PIE_COLORS.length]} ${start}deg ${end}deg`
    })
    return `conic-gradient(${stops.join(', ')})`
  }, [reachData, reachTotal])

  /* ============================================================
     RIGHT SIDEBAR — content type counts + categories, from
     analytics.content_type_breakdown / category_breakdown
     ============================================================ */

  const contentTypeCounts = (analytics?.content_type_breakdown || []).map((t) => {
    const meta = TYPE_META[t.type] || TYPE_META.note
    return { id: t.type, label: meta.label, value: t.count, icon: meta.icon, color: meta.color, soft: meta.soft }
  })

  const contentCategories = (analytics?.category_breakdown || []).slice(0, 6).map((c, i) => ({
    id: c.category,
    label: c.category,
    count: c.count,
    color: PIE_COLORS[i % PIE_COLORS.length]
  }))

  /* ============================================================
     RIGHT SIDEBAR HEADER (search + notifications)
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
          style={{
            borderColor: C.border,
            background: C.bg,
            color: C.ink,
            '--tw-ring-color': C.accent
          }}
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
                  onClick={() => {
                    setActiveTab(item.id)
                    setSearchQuery('')
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left hover:bg-gray-50 transition"
                  style={{ color: C.ink }}
                >
                  <IconComp size={14} color={C.accent} />
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
          <IconBell size={17} color={C.accent} />
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
                  <p className="text-[10px] mt-0.5" style={{ color: C.sub }}>
                    {unreadCount} unread{unreadCount !== 1 ? ' notifications' : ' notification'}
                  </p>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  className="text-[10px] font-medium hover:underline"
                  style={{ color: C.accent }}
                  onClick={markAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: C.softPanel }}
                  >
                    <IconBell size={16} color={C.sub} />
                  </div>
                  <p className="text-xs" style={{ color: C.sub }}>You're all caught up</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const unread = !readIds.has(n.id)
                  const { Icon: NotifIcon, color } = notifIcon(n.type)
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className="px-4 py-3 flex gap-3 items-start cursor-pointer transition hover:bg-gray-50"
                      style={{ background: unread ? C.accentSoft : 'transparent' }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: unread ? '#ffffff' : C.softPanel }}
                      >
                        <NotifIcon size={13} color={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed" style={{ color: C.ink }}>{n.text}</p>
                        <p className="text-[10px] mt-1" style={{ color: C.sub }}>{timeAgo(n.time)}</p>
                      </div>
                      {unread && (
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: C.accent }} />
                      )}
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
          LEFT SIDEBAR
          ======================================================== */}

      <div
        className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40"
        style={{ background: C.sidebar }}
      >
        {/* LOGO */}
        <div className="px-6 pt-6 pb-10 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.14)' }}
          >
            <IconSparkle size={24} color="#ffffff" />
          </div>
          <p className="font-bold text-xl" style={{ color: '#ffffff' }}>Career Pilot</p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-2 space-y-2.5 overflow-y-auto">
          {navItems.map((item) => {
            const IconComp = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={navBtnClass(item.id)}
                style={
                  active
                    ? { background: 'rgba(255,255,255,0.14)', color: '#ffffff' }
                    : { color: C.sidebarText }
                }
              >
                <IconComp size={18} color={active ? '#ffffff' : C.sidebarMuted} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            )
          })}

          {/* DIVIDER */}
          <div className="mx-1 my-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {secondaryNavItems.map((item) => {
            const IconComp = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={navBtnClass(item.id)}
                style={
                  active
                    ? { background: 'rgba(255,255,255,0.14)', color: '#ffffff' }
                    : { color: C.sidebarText }
                }
              >
                <IconComp size={18} color={active ? '#ffffff' : C.sidebarMuted} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* USER SECTION */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          <div className="flex items-center gap-3 px-2 py-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.16)' }}
            >
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: '#ffffff' }}>{user?.full_name}</p>
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

          {/* ====================================================
              HOME
              ==================================================== */}

          {activeTab === 'home' && (
            <div>

              {/* WELCOME BANNER */}
              <div
                className="relative overflow-hidden rounded-2xl p-6 mb-6"
                style={{
                  background: `linear-gradient(135deg, ${C.accentDark} 0%, ${C.accent} 100%)`,
                  boxShadow: '0 8px 24px rgba(23,105,224,0.18)'
                }}
              >
                <div className="relative z-10 max-w-2xl">
                  <h1 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>
                    Welcome back, {user?.full_name || user?.username || 'there'}! 👋
                  </h1>
                  <p className="text-sm max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    {user?.current_post || 'Instructor'} · Track your content performance, manage
                    student access and keep growing your reach.
                  </p>
                </div>

                <div className="absolute -right-12 -top-16 w-44 h-44 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
                <div className="absolute right-20 -bottom-20 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <div
                  className="absolute right-10 bottom-8 w-14 h-14 rounded-2xl rotate-12"
                  style={{ border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.06)' }}
                />
              </div>

              {/* ACTION MESSAGE */}
              {actionMessage && (
                <div
                  className="mb-5 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5"
                  style={
                    actionMessage.type === 'success'
                      ? { background: C.greenSoft, color: C.green }
                      : { background: C.redSoft, color: C.red }
                  }
                >
                  {actionMessage.type === 'success'
                    ? <IconCheckCircle size={16} color={C.green} />
                    : <IconAlertCircle size={16} color={C.red} />}
                  <span className="flex-1">{actionMessage.text}</span>
                  <button onClick={() => setActionMessage(null)}>
                    <IconX size={14} color={actionMessage.type === 'success' ? C.green : C.red} />
                  </button>
                </div>
              )}

              {/* COLOURFUL STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => {
                  const IconComp = s.icon
                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                      style={{ background: C.card, boxShadow: cardShadow }}
                      onClick={() => setActiveTab(s.id === 'requests' ? 'manage-content' : (s.id === 'students' || s.id === 'approved') ? 'analytics' : 'manage-content')}
                    >
                      <div className="h-1.5 w-full" style={{ background: s.color }} />

                      <div className="p-5 flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: s.soft }}
                        >
                          <IconComp size={22} color={s.color} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold leading-none" style={{ color: C.ink }}>
                            {(contentsLoading || analyticsLoading || requestsLoading) ? '—' : s.value}
                          </p>
                          <p className="text-xs mt-1.5" style={{ color: C.sub }}>{s.label}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* PIE CHART + POSTED LEARNING CONTENT — SAME ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">

                {/* PIE CHART — HOW CONTENT REACHED STUDENTS */}
                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <h2 className="font-bold text-lg mb-1" style={{ color: C.ink }}>How Your Content Reached Students</h2>
                  <p className="text-xs mb-5" style={{ color: C.sub }}>Breakdown of student access by course</p>

                  {analyticsLoading ? (
                    <div className="py-16 text-center">
                      <p className="text-sm" style={{ color: C.sub }}>Loading...</p>
                    </div>
                  ) : reachTotal === 0 ? (
                    <div className="py-14 text-center">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                        style={{ background: C.softPanel }}
                      >
                        <IconUsers size={20} color={C.sub} />
                      </div>
                      <p className="text-sm" style={{ color: C.sub }}>No student access recorded yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <div
                        className="w-40 h-40 rounded-full flex-shrink-0 relative"
                        style={{ background: pieGradient }}
                      >
                        <div
                          className="absolute inset-0 m-auto rounded-full flex flex-col items-center justify-center"
                          style={{ background: C.card, width: '5.25rem', height: '5.25rem' }}
                        >
                          <p className="text-lg font-bold" style={{ color: C.ink }}>{reachTotal}</p>
                          <p className="text-[10px]" style={{ color: C.sub }}>Total Views</p>
                        </div>
                      </div>

                      <div className="w-full space-y-3">
                        {reachData.map((c, i) => {
                          const pct = Math.round((c.students / reachTotal) * 100)
                          return (
                            <div key={c.id} className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                              <span className="flex-1 text-sm truncate" style={{ color: C.ink }}>{c.title}</span>
                              <span className="text-xs font-semibold flex-shrink-0" style={{ color: C.sub }}>{c.students} · {pct}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* POSTED LEARNING CONTENT LIST */}
                <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="font-bold text-lg" style={{ color: C.ink }}>Posted Learning Content</h2>
                      <p className="text-xs mt-0.5" style={{ color: C.sub }}>Everything you've uploaded to the Learning Hub</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('manage-content')}
                      className="text-xs font-medium hover:underline flex-shrink-0"
                      style={{ color: C.accent }}
                    >
                      Manage all
                    </button>
                  </div>

                  {contentsLoading ? (
                    <p className="text-sm text-center py-10" style={{ color: C.sub }}>Loading...</p>
                  ) : contents.length === 0 ? (
                    <div className="text-center py-10">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5"
                        style={{ background: C.softPanel }}
                      >
                        <IconInbox size={18} color={C.sub} />
                      </div>
                      <p className="text-sm" style={{ color: C.sub }}>No content posted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {contents.slice(0, 5).map((c) => {
                        const meta = TYPE_META[c.content_type] || TYPE_META.note
                        const TypeIcon = meta.icon
                        const statusLabel = c.is_approved ? 'Approved' : c.is_rejected ? 'Rejected' : 'Pending'
                        const style = STATUS_STYLE[statusLabel]
                        const studentsCount = analytics?.top_content?.find((t) => t.id === c.id)?.students ?? 0
                        return (
                          <div
                            key={c.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl transition hover:opacity-80 cursor-pointer"
                            style={{ background: C.softPanel }}
                            onClick={() => setActiveTab('manage-content')}
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: meta.soft }}
                            >
                              <TypeIcon size={16} color={meta.color} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: C.ink }}>{c.title}</p>
                              <p className="text-[11px] truncate" style={{ color: C.sub }}>
                                {meta.label} · {studentsCount} students · {new Date(c.created_at).toLocaleDateString()}
                              </p>
                            </div>

                            <span
                              className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{ background: style.soft, color: style.color }}
                            >
                              {statusLabel}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* AVAILABLE REQUESTS LIST */}
              <div className="rounded-2xl p-6 mb-6" style={{ background: C.card, boxShadow: cardShadow }}>
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h2 className="font-bold text-lg" style={{ color: C.ink }}>Available Requests List</h2>
                    <p className="text-xs mt-0.5" style={{ color: C.sub }}>Students requesting re-access to expired content</p>
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: C.orangeSoft, color: C.orange }}
                  >
                    {reaccessRequests.length} pending
                  </span>
                </div>

                {requestsLoading ? (
                  <p className="text-sm text-center py-10" style={{ color: C.sub }}>Loading...</p>
                ) : reaccessRequests.length === 0 ? (
                  <div className="text-center py-10">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5"
                      style={{ background: C.greenSoft }}
                    >
                      <IconCheckCircle size={18} color={C.green} />
                    </div>
                    <p className="text-sm" style={{ color: C.sub }}>No pending requests right now</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: C.softPanel }}>
                          {['Student', 'Content', 'Requested', 'Action'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold rounded-l-lg first:rounded-l-lg last:rounded-r-lg" style={{ color: C.sub }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: C.border }}>
                        {reaccessRequests.map((r) => (
                          <tr key={r.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                  style={{ background: C.accent }}
                                >
                                  {r.user_name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate" style={{ color: C.ink }}>{r.user_name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm" style={{ color: C.ink }}>{r.content_title}</td>
                            <td className="px-4 py-3 text-xs" style={{ color: C.sub }}>{timeAgo(r.requested_at)}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRespond(r.id, 'approved')}
                                  disabled={respondingId === r.id}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-60 flex items-center gap-1.5"
                                  style={{ background: C.green }}
                                >
                                  {respondingId === r.id ? <IconLoader size={12} /> : null}
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRespond(r.id, 'denied')}
                                  disabled={respondingId === r.id}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-60 flex items-center gap-1.5"
                                  style={{ background: C.red }}
                                >
                                  {respondingId === r.id ? <IconLoader size={12} /> : null}
                                  Deny
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
              POST CONTENT
              ==================================================== */}

          {activeTab === 'post-content' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ color: C.ink }}>Post Content</h2>
              </div>
              <PostContent
                onSuccess={() => {
                  setActiveTab('manage-content')
                  fetchMyContent()
                  fetchAnalytics()
                }}
              />
            </div>
          )}

          {/* ====================================================
              MANAGE CONTENT
              ==================================================== */}

          {activeTab === 'manage-content' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ color: C.ink }}>Manage Content</h2>
              </div>
              <ManageContent />
            </div>
          )}

          {/* ====================================================
              ANALYTICS
              ==================================================== */}

          {activeTab === 'analytics' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ color: C.ink }}>Analytics</h2>
              </div>
              <Analytics />
            </div>
          )}

          {/* ====================================================
              PROFILE
              ==================================================== */}

          {activeTab === 'profile' && <Profile />}

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
                    q: 'How do I post new learning content?',
                    a: 'Go to Post Content, add a Google Drive video link or upload a PDF, then submit for admin approval.'
                  },
                  {
                    q: 'How long does student access last?',
                    a: 'Students get 30 days of access from the moment they enroll. After that they can send a re-access request.'
                  },
                  {
                    q: 'Where do I approve re-access requests?',
                    a: 'Re-access requests appear on your Dashboard under "Available Requests List" and in Manage Content — both act on the same live data, so approving one updates the other immediately.'
                  },
                  {
                    q: 'What do the stat cards on my Dashboard mean?',
                    a: '"Content Posted" and "Approved Content" reflect all your uploads and admin decisions. "Students Reached" counts distinct students who have accessed your content. "Re-Access Requests" shows requests still awaiting your response.'
                  },
                  {
                    q: 'How is my content reach calculated?',
                    a: 'The Analytics page tracks students with access per course, uploads over the last 6 months, your content mix by type, and category spread — all computed live from your content.'
                  },
                  {
                    q: 'What do notifications tell me?',
                    a: 'The bell shows two kinds of updates: new re-access requests from students awaiting your decision, and admin decisions (approved or rejected) on content you have posted. Click any notification to jump to Manage Content.'
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
              <IconCalendar size={15} color={C.accent} />
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
                  background: d && isToday(d) ? C.accentDark : 'transparent',
                  color: d && isToday(d) ? '#ffffff' : d ? C.ink : 'transparent',
                  fontWeight: d && isToday(d) ? 700 : 500
                }}
              >
                {d || ''}
                {d && eventDays.includes(d) && !isToday(d) && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: C.orange }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT TYPE COUNTS */}
        <div className="mb-5">
          <p className="text-xs font-semibold flex items-center gap-2 mb-2.5" style={{ color: C.ink }}>
            <IconClipboardList size={14} color={C.accent} />
            Content Type Counts
          </p>

          {analyticsLoading ? (
            <p className="text-xs" style={{ color: C.sub }}>Loading...</p>
          ) : contentTypeCounts.length === 0 ? (
            <p className="text-xs" style={{ color: C.sub }}>No content yet</p>
          ) : (
            <div className="space-y-2">
              {contentTypeCounts.map((t) => {
                const IconComp = t.icon
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 rounded-xl p-2.5"
                    style={{ background: C.softPanel }}
                  >
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

        {/* POSTED CONTENT CATEGORIES */}
        <div>
          <p className="text-xs font-semibold flex items-center gap-2 mb-2.5" style={{ color: C.ink }}>
            <IconTag size={14} color={C.accent} />
            Posted Content Categories
          </p>

          {analyticsLoading ? (
            <p className="text-xs" style={{ color: C.sub }}>Loading...</p>
          ) : contentCategories.length === 0 ? (
            <p className="text-xs" style={{ color: C.sub }}>No categories yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {contentCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1.5 rounded-full pl-2.5 pr-3 py-1.5"
                  style={{ background: C.softPanel }}
                >
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
