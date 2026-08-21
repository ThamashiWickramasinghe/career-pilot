import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import LearningHub from './LearningHub'
import JobPortal from './JobPortal'
import Profile from './Profile'
import JobVacancy from './JobVacancy'
import CareerRoadmap from './CareerRoadmap'
import SkillChallenge from './SkillChallenge'
import Help from './Help'

/* ── Colour Theme ──
   Updated only to match the purple/lavender theme
   of the reference design.
*/
const C = {
  bg: '#f6f3ff',
  sidebar: '#5b56b5',
  panel: '#ffffff',
  card: '#ffffff',
  border: '#e6e3f2',

  ink: '#25243a',
  sub: '#85839a',

  accent: '#5b56b5',
  accentDark: '#4d48a3',
  accentSoft: '#e9e7f8',

  green: '#5db192',
  greenSoft: '#dffff0',

  orange: '#e5a26d',
  orangeSoft: '#ffefe0',

  purple: '#bf5bbd',
  purpleSoft: '#ffdcfc',

  pink: '#5b56b5',
  pinkSoft: '#f6e5f0',

  blue: '#6f8fd4',
  blueSoft: '#e3eafb',

  sidebarText: '#dedcf5',
  sidebarMuted: '#bcb9df',

  softPanel: '#f3f0fa'
}

const cardShadow =
  '0 2px 8px rgba(74, 69, 130, 0.06), 0 1px 3px rgba(74, 69, 130, 0.04)'

/* ── Inline SVG icons ── */
const Icon = ({
  path,
  size = 18,
  color = 'currentColor',
  strokeWidth = 2
}) => (
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
  <Icon
    {...p}
    path={
      <>
        <path d="M3 9l9-7 9 7" />
        <path d="M9 22V12h6v10" />
        <path d="M5 10v10a1 1 0 001 1h3M19 10v10a1 1 0 01-1 1h-3" />
      </>
    }
  />
)

const IconUser = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      </>
    }
  />
)

const IconBot = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="4" y="9" width="16" height="10" rx="2" />
        <path d="M12 9V5M9 5h6" />
        <circle cx="9" cy="14" r="1" />
        <circle cx="15" cy="14" r="1" />
      </>
    }
  />
)

const IconMap = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M9 3l6 2 6-2v16l-6 2-6-2-6 2V5z" />
        <path d="M9 3v16M15 5v16" />
      </>
    }
  />
)

const IconBook = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v16H6.5A2.5 2.5 0 004 20.5v-16z" />
        <path d="M4 20.5A2.5 2.5 0 016.5 18H20" />
      </>
    }
  />
)

const IconBriefcase = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </>
    }
  />
)

const IconTrophy = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M8 21h8M12 17v4" />
        <path d="M7 4h10v5a5 5 0 01-10 0V4z" />
        <path d="M7 5H4a2 2 0 002 4M17 5h3a2 2 0 01-2 4" />
      </>
    }
  />
)

const IconLogout = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <path d="M16 17l5-5-5-5M21 12H9" />
      </>
    }
  />
)

const IconSearch = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    }
  />
)

const IconBell = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 01-3.4 0" />
      </>
    }
  />
)

const IconCalendar = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    }
  />
)

const IconChevronLeft = (p) => (
  <Icon {...p} path={<path d="M15 18l-6-6 6-6" />} />
)

const IconChevronRight = (p) => (
  <Icon {...p} path={<path d="M9 18l6-6-6-6" />} />
)

const IconSparkle = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M12 3l1.8 4.9L19 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8L12 3z" />
      </>
    }
  />
)

const IconMedal = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="15" r="6" />
        <path d="M9 9.5L7 3h2l2 5M15 9.5L17 3h-2l-2 5" />
        <path d="M12 12v6" />
      </>
    }
  />
)

const IconShieldCheck = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    }
  />
)

const IconCertificate = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="M13 8h5M13 12h5" />
        <path d="M8 20l2-4M13 20l-2-4" />
      </>
    }
  />
)

const IconClock = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </>
    }
  />
)

const IconHelp = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 1.8-2.5 3.5" />
        <path d="M12 17h.01" />
      </>
    }
  />
)

// Colour palette cycled across earned badges so each one gets a distinct
// accent without needing the backend to store colour info.
const BADGE_PALETTE = [
  { color: C.green, soft: C.greenSoft },
  { color: C.blue, soft: C.blueSoft },
  { color: C.purple, soft: C.purpleSoft },
  { color: C.orange, soft: C.orangeSoft },
  { color: C.pink, soft: C.pinkSoft }
]

// Colour palettes for real "My Courses" rows (active / requested)
const ACTIVE_COURSE_PALETTE = [
  { color: C.green, soft: C.greenSoft },
  { color: C.blue, soft: C.blueSoft }
]

const REQUESTED_COURSE_PALETTE = [
  { color: C.orange, soft: C.orangeSoft },
  { color: C.purple, soft: C.purpleSoft }
]

// Real application status → display colour, used by the
// "Job Status Notifications" widget in the right panel.
const JOB_STATUS_STYLE = {
  Pending: { color: C.orange },
  Shortlisted: { color: C.blue },
  Hired: { color: C.green },
  Rejected: { color: '#dc2626' }
}

// Static base notifications kept as before (demo items).
// Real re-access + job-application notifications from the backend
// get merged in on top of these.
const BASE_NOTIFICATIONS = [
  {
    id: 1,
    text: 'New job matches found for you!',
    time: '2 min ago',
    unread: true
  },
  {
    id: 2,
    text: 'Your learning access expires in 3 days',
    time: '1 hr ago',
    unread: true
  },
  {
    id: 3,
    text: 'You earned a Python badge!',
    time: '2 hrs ago',
    unread: false
  }
]

export default function JobSeekerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('home')
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  // ── Real earned badges, fetched from the Skill Challenge backend ──
  const [earnedBadges, setEarnedBadges] = useState([])
  const [badgesLoading, setBadgesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchEarnedBadges = async () => {
      try {
        const res = await API.get('/challenge/badges')
        if (!cancelled) setEarnedBadges(res.data.badges || [])
      } catch (err) {
        console.error('Failed to load badges:', err)
      } finally {
        if (!cancelled) setBadgesLoading(false)
      }
    }
    fetchEarnedBadges()
    return () => { cancelled = true }
  }, [])

  // ── Real "My Courses" data, fetched from /learning/my-courses ──
  const [courses, setCourses] = useState({ active: [], requested: [] })
  const [coursesLoading, setCoursesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchMyCourses = async () => {
      try {
        const res = await API.get('/learning/my-courses')
        if (!cancelled) {
          setCourses({
            active: res.data.active_courses || [],
            requested: res.data.requested_courses || []
          })
        }
      } catch (err) {
        console.error('Failed to load my courses:', err)
      } finally {
        if (!cancelled) setCoursesLoading(false)
      }
    }
    fetchMyCourses()
    return () => { cancelled = true }
  }, [])

  // ── Real "Available Jobs" count, fetched from /jobs/all ──
  const [availableJobsCount, setAvailableJobsCount] = useState(0)
  const [jobsCountLoading, setJobsCountLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchJobsCount = async () => {
      try {
        const res = await API.get('/jobs/all')
        if (!cancelled) setAvailableJobsCount((res.data.jobs || []).length)
      } catch (err) {
        console.error('Failed to load available jobs count:', err)
      } finally {
        if (!cancelled) setJobsCountLoading(false)
      }
    }
    fetchJobsCount()
    return () => { cancelled = true }
  }, [])

  // ── Real "Job Status Notifications" data, fetched from
  //    /jobs/my-applications. Powers the right-panel widget that
  //    shows Pending / Shortlisted / Hired / Rejected per application.
  const [myApplications, setMyApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchMyApplications = async () => {
      try {
        const res = await API.get('/jobs/my-applications')
        if (!cancelled) setMyApplications(res.data.applications || [])
      } catch (err) {
        console.error('Failed to load my applications:', err)
      } finally {
        if (!cancelled) setApplicationsLoading(false)
      }
    }
    fetchMyApplications()
    return () => { cancelled = true }
  }, [])

  // ── Notifications: static demo items + real re-access decisions +
  //    real job-application status updates ──
  const [notifications, setNotifications] = useState(BASE_NOTIFICATIONS)

  useEffect(() => {
    let cancelled = false
    const fetchLearningNotifications = async () => {
      try {
        const res = await API.get('/learning/notifications')
        const reaccessNotifs = res.data.notifications || []

        if (!cancelled && reaccessNotifs.length > 0) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id))
            const fresh = reaccessNotifs.filter(
              (n) => !existingIds.has(n.id)
            )
            return [...fresh, ...prev]
          })
        }
      } catch (err) {
        console.error('Failed to load learning notifications:', err)
      }
    }
    fetchLearningNotifications()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchJobNotifications = async () => {
      try {
        const res = await API.get('/jobs/notifications')
        const jobNotifs = res.data.notifications || []

        if (!cancelled && jobNotifs.length > 0) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id))
            const fresh = jobNotifs.filter((n) => !existingIds.has(n.id))
            return [...fresh, ...prev]
          })
        }
      } catch (err) {
        console.error('Failed to load job notifications:', err)
      }
    }
    fetchJobNotifications()
    return () => { cancelled = true }
  }, [])

  const getDaysRemaining = (expiresAt) => {
    if (!expiresAt) return null
    const diff = new Date(expiresAt).getTime() - new Date().getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  // Real course rows, shaped the same way the old static array was,
  // so the render logic below stays untouched.
  const myCourses = useMemo(() => {
    const active = courses.active.map((c, i) => {
      const palette =
        ACTIVE_COURSE_PALETTE[i % ACTIVE_COURSE_PALETTE.length]
      const daysLeft = c.access
        ? getDaysRemaining(c.access.expires_at)
        : null

      return {
        id: `active-${c.id}`,
        content_id: c.id,
        type: 'active',
        title: c.title,
        instructor: c.instructor_name,
        status:
          daysLeft !== null
            ? `In progress · ${daysLeft} days left`
            : 'Active',
        icon: IconBook,
        color: palette.color,
        soft: palette.soft
      }
    })

    const requested = courses.requested.map((c, i) => {
      const palette =
        REQUESTED_COURSE_PALETTE[i % REQUESTED_COURSE_PALETTE.length]

      return {
        id: `requested-${c.id}`,
        content_id: c.id,
        type: 'requested',
        title: c.title,
        instructor: c.instructor_name,
        status: 'Awaiting approval',
        icon: IconClock,
        color: palette.color,
        soft: palette.soft
      }
    })

    return [...active, ...requested]
  }, [courses])

  // Real job status rows for the right-panel widget — most recent
  // applications first, each coloured by its actual status.
  const jobStatusNotifications = useMemo(() => {
    return myApplications.slice(0, 4).map((a) => {
      const style = JOB_STATUS_STYLE[a.status] || JOB_STATUS_STYLE.Pending

      return {
        id: a.id,
        company: a.company_name,
        role: a.job_title,
        status: a.status,
        color: style.color
      }
    })
  }, [myApplications])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // ── Sidebar nav items — grouped into two sections so we can add
  //    visual gaps between them, and Help added at the end. ──
  const navItems = [
    { id: 'home', icon: IconHome, label: 'Dashboard' },
    { id: 'profile', icon: IconUser, label: 'Profile' },
    { id: 'ai-jobs', icon: IconBot, label: 'AI Job Match' },
    { id: 'jobs', icon: IconBriefcase, label: 'Job Vacancy' },
    { id: 'roadmap', icon: IconMap, label: 'Career Roadmap' },
    { id: 'learning', icon: IconBook, label: 'Learning Hub' },
    { id: 'challenges', icon: IconTrophy, label: 'Skill Challenges' }
  ]

  const secondaryNavItems = [
    { id: 'help', icon: IconHelp, label: 'Help' }
  ]

  const allNavItems = [...navItems, ...secondaryNavItems]

  const filteredNavItems = useMemo(() => {
    if (!searchQuery.trim()) return []

    return allNavItems.filter((n) =>
      n.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const unreadCount = notifications.filter((n) => n.unread).length

  const courseTabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active Courses' },
    { id: 'requested', label: 'Requested Courses' }
  ]

  const visibleCourses =
    courseFilter === 'all'
      ? myCourses
      : myCourses.filter((c) => c.type === courseFilter)

  const stats = [
    {
      id: 'jobs',
      label: 'Available Jobs',
      value: jobsCountLoading ? '—' : availableJobsCount,
      icon: IconBriefcase,
      color: C.blue,
      soft: C.blueSoft,
      onClick: () => setActiveTab('jobs')
    },
    {
      id: 'learning',
      label: 'My Courses',
      value: myCourses.length,
      icon: IconBook,
      color: C.green,
      soft: C.greenSoft,
      onClick: () => setActiveTab('learning')
    },
    {
      id: 'challenges',
      label: 'Badges Earned',
      value: earnedBadges.length,
      icon: IconMedal,
      color: C.purple,
      soft: C.purpleSoft,
      onClick: () => setActiveTab('challenges')
    }
  ]

  const today = new Date()

  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const eventDays = [18, 19, 20, 21]

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay()
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()

    const cells = []

    for (let i = 0; i < firstDay; i++) {
      cells.push(null)
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d)
    }

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
    d === today.getDate() &&
    calMonth === today.getMonth() &&
    calYear === today.getFullYear()

  const navBtnClass = (id) =>
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
      activeTab === id
        ? 'font-semibold'
        : 'hover:bg-white/10'
    }`

  /* ── Search + Notification Row ── */
  const SearchAndBell = () => (
    <div className="flex items-center justify-center gap-3 mb-8 relative">
      <div className="w-full max-w-sm relative">
        <div
          className="absolute left-5 top-1/2 -translate-y-1/2"
          style={{ color: C.sub }}
        >
          <IconSearch size={16} />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for anything..."
          className="w-full pl-12 pr-5 py-3 rounded-full border text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: C.border,
            background: C.card,
            color: C.ink,
            boxShadow: cardShadow,
            '--tw-ring-color': C.accent
          }}
        />

        {filteredNavItems.length > 0 && (
          <div
            className="absolute left-0 right-0 top-14 rounded-2xl shadow-lg border z-50 overflow-hidden"
            style={{
              background: C.card,
              borderColor: C.border
            }}
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
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-purple-50"
                  style={{ color: C.ink }}
                >
                  <IconComp size={16} color={C.accent} />
                  {item.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="relative flex-shrink-0">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-12 h-12 rounded-full border flex items-center justify-center"
          style={{
            background: C.card,
            borderColor: C.border,
            boxShadow: cardShadow
          }}
        >
          <IconBell size={18} color={C.accent} />

          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
              style={{ background: C.pink }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div
            className="absolute right-0 top-14 w-80 rounded-2xl shadow-xl border z-50"
            style={{
              background: C.card,
              borderColor: C.border
            }}
          >
            <div
              className="p-4 border-b flex justify-between items-center"
              style={{ borderColor: C.border }}
            >
              <h3
                className="font-semibold"
                style={{ color: C.ink }}
              >
                Notifications
              </h3>

              <span
                className="text-xs font-medium cursor-pointer"
                style={{ color: C.accent }}
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, unread: false }))
                  )
                }
              >
                Mark all read
              </span>
            </div>

            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <p
                  className="text-sm text-center py-6"
                  style={{ color: C.sub }}
                >
                  No notifications yet.
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.type === 'reaccess') setActiveTab('learning')
                      if (n.type === 'job_application') setActiveTab('jobs')
                    }}
                    className="px-4 py-3 flex gap-3 items-start cursor-pointer"
                    style={{
                      background: n.unread
                        ? C.accentSoft
                        : 'transparent'
                    }}
                  >
                    <div className="flex-1">
                      <p
                        className="text-sm"
                        style={{ color: C.ink }}
                      >
                        {n.text}
                      </p>

                      <p
                        className="text-xs mt-0.5"
                        style={{ color: C.sub }}
                      >
                        {n.time}
                      </p>
                    </div>

                    {n.unread && (
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: C.accent }}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div
      className="min-h-screen flex"
      style={{ background: C.bg }}
    >
      <style>{`
        /* Hide scrollbars while keeping scrolling enabled */
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        *::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
      `}</style>

      {/* ── LEFT SIDEBAR ── */}
      <div
        className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40"
        style={{
          background: C.sidebar
        }}
      >
        {/* Logo — bigger icon box + icon + text, extra bottom padding
            kept for the gap before "Dashboard" below it */}
        <div className="px-6 pt-6 pb-10 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.18)'
            }}
          >
            <IconSparkle size={24} color="#ffffff" />
          </div>

          <p
            className="font-bold text-xl"
            style={{ color: '#ffffff' }}
          >
            Career Pilot
          </p>
        </div>

        {/* Navigation — primary items, with breathing room between rows */}
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
                    ? {
                        background: 'rgba(255,255,255,0.18)',
                        color: '#ffffff'
                      }
                    : {
                        color: C.sidebarText
                      }
                }
              >
                <IconComp
                  size={18}
                  color={
                    active
                      ? '#ffffff'
                      : C.sidebarMuted
                  }
                  strokeWidth={2}
                />

                <span>{item.label}</span>
              </button>
            )
          })}

          {/* Divider before secondary items (Help) for clear separation */}
          <div
            className="mx-1 my-4 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.14)' }}
          />

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
                    ? {
                        background: 'rgba(255,255,255,0.18)',
                        color: '#ffffff'
                      }
                    : {
                        color: C.sidebarText
                      }
                }
              >
                <IconComp
                  size={18}
                  color={
                    active
                      ? '#ffffff'
                      : C.sidebarMuted
                  }
                  strokeWidth={2}
                />

                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User section */}
        <div
          className="px-4 py-4 border-t"
          style={{
            borderColor: 'rgba(255,255,255,0.16)'
          }}
        >
          <div className="flex items-center gap-3 px-2 py-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.20)'
              }}
            >
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 overflow-hidden">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: '#ffffff' }}
              >
                {user?.full_name}
              </p>

              <p
                className="text-[11px]"
                style={{ color: '#43ba84' }}
              >
                ● Active
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-white/10"
              title="Log out"
            >
              <IconLogout
                size={16}
                color={C.sidebarMuted}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 lg:ml-64 xl:mr-80">
        <div className="p-6">

          {/* HOME */}
          {activeTab === 'home' && (
            <div>

              {/* Welcome */}
              <div className="mb-6 text-center">
                <h1
                  className="text-2xl font-bold"
                  style={{ color: C.ink }}
                >
                  Welcome, {user?.username} 👋
                </h1>
              </div>

              {/* Search + Notification */}
              <SearchAndBell />

              {/* Stat Cards — each now links to its own tab */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((s) => {
                  const IconComp = s.icon

                  return (
                    <button
                      key={s.id}
                      onClick={s.onClick}
                      className="text-left rounded-2xl p-5 flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        background: C.card,
                        boxShadow: cardShadow
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: s.soft
                        }}
                      >
                        <IconComp
                          size={20}
                          color={s.color}
                        />
                      </div>

                      <div>
                        <p
                          className="text-xl font-bold leading-none"
                          style={{ color: C.ink }}
                        >
                          {s.value}
                        </p>

                        <p
                          className="text-xs mt-1"
                          style={{ color: C.sub }}
                        >
                          {s.label}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* My Courses — backed by /learning/my-courses,
                  each row links into the real Learning Hub */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: C.card,
                  boxShadow: cardShadow
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className="font-bold text-lg"
                    style={{ color: C.ink }}
                  >
                    My Courses
                  </h2>

                  <button
                    onClick={() => setActiveTab('learning')}
                    className="text-sm font-medium hover:underline"
                    style={{ color: C.accent }}
                  >
                    View all
                  </button>
                </div>

                <div
                  className="flex items-center gap-2 mb-5 border-b"
                  style={{
                    borderColor: C.border
                  }}
                >
                  {courseTabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setCourseFilter(t.id)}
                      className="text-sm font-medium px-3 py-2 -mb-px border-b-2"
                      style={{
                        color:
                          courseFilter === t.id
                            ? C.accent
                            : C.sub,

                        borderColor:
                          courseFilter === t.id
                            ? C.accent
                            : 'transparent'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {coursesLoading ? (
                    <div className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
                          style={{ background: C.softPanel }}
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex-shrink-0"
                            style={{ background: C.border }}
                          />
                          <div className="flex-1 space-y-1.5">
                            <div
                              className="h-3 w-1/3 rounded"
                              style={{ background: C.border }}
                            />
                            <div
                              className="h-2.5 w-1/4 rounded"
                              style={{ background: C.border }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {visibleCourses.map((c) => {
                        const IconComp = c.icon

                        return (
                          <div
                            key={c.id}
                            onClick={() => setActiveTab('learning')}
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition hover:opacity-80"
                            style={{
                              background: C.softPanel
                            }}
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                background: c.soft
                              }}
                            >
                              <IconComp
                                size={16}
                                color={c.color}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-medium truncate"
                                style={{ color: C.ink }}
                              >
                                {c.title}
                              </p>

                              <p
                                className="text-xs truncate"
                                style={{ color: C.sub }}
                              >
                                {c.instructor}
                              </p>
                            </div>

                            <span
                              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full"
                              style={{
                                background: c.soft,
                                color: c.color
                              }}
                            >
                              {c.status}
                            </span>
                          </div>
                        )
                      })}

                      {visibleCourses.length === 0 && (
                        <p
                          className="text-sm text-center py-8"
                          style={{ color: C.sub }}
                        >
                          No courses here yet.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI JOBS */}
          {activeTab === 'ai-jobs' && (
            <div>
              

              <JobPortal />
            </div>
          )}

          {/* ROADMAP */}
          {activeTab === 'roadmap' && <CareerRoadmap />}

          {/* LEARNING */}
          {activeTab === 'learning' && (
            <div>
              

              <LearningHub />
            </div>
          )}

          {activeTab === 'jobs' && <JobVacancy />}

          {/* CHALLENGES */}
          {activeTab === 'challenges' && <SkillChallenge />}

          {/* PROFILE */}
          {activeTab === 'profile' && <Profile />}

          {/* HELP */}
          {activeTab === 'help' && <Help />}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="hidden xl:flex flex-col w-80 h-screen fixed right-0 top-0 z-30 border-l overflow-hidden p-5"
        style={{
          background: C.panel,
          borderColor: C.border
        }}
      >

        {/* Calendar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2
              className="text-sm font-bold flex items-center gap-2"
              style={{ color: C.ink }}
            >
              <IconCalendar
                size={15}
                color={C.accent}
              />

              {monthNames[calMonth]} {calYear}
            </h2>

            <div className="flex items-center gap-1">
              <button
                onClick={goPrevMonth}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-purple-50"
              >
                <IconChevronLeft
                  size={14}
                  color={C.sub}
                />
              </button>

              <button
                onClick={goNextMonth}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-purple-50"
              >
                <IconChevronRight
                  size={14}
                  color={C.sub}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {[
              'Su',
              'Mo',
              'Tu',
              'We',
              'Th',
              'Fr',
              'Sa'
            ].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-semibold py-0.5"
                style={{ color: C.sub }}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => (
              <div
                key={i}
                className="aspect-square flex flex-col items-center justify-center rounded-full relative text-[11px]"
                style={{
                  background:
                    d && isToday(d)
                      ? C.accent
                      : 'transparent',

                  color:
                    d && isToday(d)
                      ? '#ffffff'
                      : d
                      ? C.ink
                      : 'transparent',

                  fontWeight:
                    d && isToday(d)
                      ? 700
                      : 500
                }}
              >
                {d || ''}

                {d &&
                  eventDays.includes(d) &&
                  !isToday(d) && (
                    <span
                      className="absolute bottom-0.5 w-1 h-1 rounded-full"
                      style={{
                        background: C.orange
                      }}
                    />
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Job Status Notifications — backed by /jobs/my-applications */}
        <div className="mb-5 flex flex-col">
          <div className="flex justify-between items-center mb-2.5 flex-shrink-0">
            <p
              className="text-xs font-semibold flex items-center gap-2"
              style={{ color: C.ink }}
            >
              <IconBriefcase
                size={14}
                color={C.accent}
              />

              Job Status Notifications
            </p>

            <button
              onClick={() => setActiveTab('jobs')}
              className="text-[11px] font-medium"
              style={{ color: C.accent }}
            >
              View all
            </button>
          </div>

          <div className="space-y-2 overflow-hidden">
            {applicationsLoading ? (
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl p-2.5 pl-3 animate-pulse"
                  style={{ background: C.softPanel }}
                >
                  <div
                    className="h-2.5 w-2/3 rounded mb-1.5"
                    style={{ background: C.border }}
                  />
                  <div
                    className="h-2 w-1/3 rounded"
                    style={{ background: C.border }}
                  />
                </div>
              ))
            ) : jobStatusNotifications.length === 0 ? (
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: C.softPanel }}
              >
                <p className="text-[11px]" style={{ color: C.sub }}>
                  No applications yet — send a CV from Job Vacancy to see status here.
                </p>
              </div>
            ) : (
              jobStatusNotifications.map((j) => (
                <div
                  key={j.id}
                  onClick={() => setActiveTab('jobs')}
                  className="rounded-xl p-2.5 pl-3 border-l-4 cursor-pointer transition hover:opacity-80"
                  style={{
                    background: C.softPanel,
                    borderColor: j.color
                  }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p
                        className="text-[11px] font-semibold truncate"
                        style={{ color: C.ink }}
                      >
                        {j.role}
                      </p>

                      <p
                        className="text-[10px] mt-0.5 truncate"
                        style={{ color: C.sub }}
                      >
                        {j.company}
                      </p>
                    </div>

                    <span
                      className="text-[9px] font-semibold whitespace-nowrap flex-shrink-0"
                      style={{ color: j.color }}
                    >
                      {j.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Achievement Badges — live from /challenge/badges */}
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center mb-2.5">
            <p
              className="text-xs font-semibold flex items-center gap-2"
              style={{ color: C.ink }}
            >
              <IconMedal
                size={14}
                color={C.accent}
              />

              Achievement Badges
            </p>

            <button
              onClick={() =>
                setActiveTab('challenges')
              }
              className="text-[11px] font-medium"
              style={{ color: C.accent }}
            >
              View all
            </button>
          </div>

          {badgesLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl p-2.5 flex flex-col items-center text-center animate-pulse"
                  style={{ background: C.softPanel }}
                >
                  <div
                    className="w-7 h-7 rounded-full mb-1"
                    style={{ background: C.border }}
                  />
                  <div
                    className="h-2 w-10 rounded"
                    style={{ background: C.border }}
                  />
                </div>
              ))}
            </div>
          ) : earnedBadges.length === 0 ? (
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: C.softPanel }}
            >
              <p className="text-[11px]" style={{ color: C.sub }}>
                No badges earned yet — complete a Skill Challenge to earn your first one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {earnedBadges.slice(0, 3).map((b, i) => {
                const palette = BADGE_PALETTE[i % BADGE_PALETTE.length]

                return (
                  <div
                    key={b.id || i}
                    className="rounded-xl p-2.5 flex flex-col items-center text-center"
                    style={{
                      background: C.softPanel
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center mb-1 text-sm"
                      style={{
                        background: palette.soft
                      }}
                    >
                      {b.badge_icon}
                    </div>

                    <p
                      className="text-[10px] font-semibold leading-tight"
                      style={{ color: C.ink }}
                    >
                      {b.badge_name}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}