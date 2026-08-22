import { useState, useEffect } from 'react'
import API from '../../utils/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

/* ============================================================
   COLOUR THEME (matches InstructorDashboard.jsx)
   ============================================================ */
const C = {
  bg: '#F7F9FC',

  card: '#FFFFFF',
  border: '#E6EAF0',

  ink: '#243B53',
  sub: '#829AB1',

  accent: '#394d5e',
  accentDark: '#102A43',
  accentSoft: '#E8F1FF',

  teal: '#20A39E',
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

const IconClipboardList = (p) => (
  <Icon {...p} path={<><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" /><path d="M9 10h6M9 13.5h6M9 17h3.5" /></>} />
)

const IconCheckCircle = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.7 2.7L16 9.5" /></>} />
)

const IconClock = (p) => (
  <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>} />
)

const IconUsers = (p) => (
  <Icon {...p} path={<><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.4 2.9-6 6.5-6s6.5 2.6 6.5 6" /><circle cx="17.5" cy="8.8" r="2.4" /><path d="M15.8 14.3c2.7.5 4.7 2.5 4.7 5.7" /></>} />
)

const IconMessageCircle = (p) => (
  <Icon {...p} path={<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />} />
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

const IconBarChart = (p) => (
  <Icon {...p} path={<><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></>} />
)

const IconPieChart = (p) => (
  <Icon {...p} path={<><path d="M21.2 15.3A10 10 0 1112 2v10z" /><path d="M22 12A10 10 0 0012 2v10z" /></>} />
)

const IconTag = (p) => (
  <Icon {...p} path={<><path d="M3 12.5V5a2 2 0 012-2h7.5L21 11.5 12.5 20 3 12.5z" /><circle cx="8.3" cy="8.3" r="1.4" /></>} />
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

/* ============================================================
   STATIC LOOKUPS
   ============================================================ */

const TYPE_META = {
  video_link: { label: 'Video', icon: IconVideo, color: '#1769E0', soft: '#E8F1FF' },
  pdf: { label: 'PDF', icon: IconFileText, color: '#2FB171', soft: '#E7F8EF' },
  note: { label: 'Notes', icon: IconNotes, color: '#8067D9', soft: '#F0ECFF' }
}

const PIE_COLORS = ['#1769E0', '#2FB171', '#8067D9', '#F4A340', '#EF625C', '#20A39E']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs font-medium"
      style={{ background: C.accentDark, color: '#ffffff', boxShadow: '0 6px 16px rgba(16,42,67,0.25)' }}
    >
      {label && <p className="mb-0.5 opacity-80">{label}</p>}
      {payload.map((p, i) => (
        <p key={i}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

/* ============================================================
   ANALYTICS PAGE
   ============================================================ */

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await API.get('/learning/analytics')
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics')
    }
    setLoading(false)
  }

  /* ---------------------------------------------------------- */

  if (loading) {
    return (
      <div className="text-center py-24 rounded-2xl" style={{ background: C.card, boxShadow: cardShadow }}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse"
          style={{ background: C.accentSoft }}
        >
          <IconBarChart size={24} color={C.accent} />
        </div>
        <p className="text-sm" style={{ color: C.sub }}>Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="p-4 rounded-xl text-sm font-medium flex items-center gap-2.5"
        style={{ background: C.redSoft, color: C.red }}
      >
        <IconAlertCircle size={17} color={C.red} />
        <span className="flex-1">{error}</span>
        <button onClick={fetchAnalytics} style={{ color: C.red }}>
          <IconX size={15} color={C.red} />
        </button>
      </div>
    )
  }

  if (!data || data.total_content === 0) {
    return (
      <div className="text-center py-24 rounded-2xl" style={{ background: C.card, boxShadow: cardShadow }}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: C.softPanel }}
        >
          <IconInbox size={24} color={C.sub} />
        </div>
        <h3 className="text-base font-bold mb-1.5" style={{ color: C.ink }}>No analytics yet</h3>
        <p className="text-sm" style={{ color: C.sub }}>Post your first piece of content to start seeing insights here</p>
      </div>
    )
  }

  const {
    total_content, approved_count, pending_count, rejected_count,
    content_type_breakdown, category_breakdown, monthly_uploads,
    students_reached, total_comments, top_content, reaccess_stats
  } = data

  const typeChartData = content_type_breakdown.map((t) => ({
    name: TYPE_META[t.type]?.label || t.type,
    value: t.count
  }))

  const categoryChartData = category_breakdown.slice(0, 6).map((c) => ({
    category: c.category,
    count: c.count
  }))

  const stats = [
    { id: 'total', label: 'Total Content', value: total_content, icon: IconClipboardList, color: C.accent, soft: C.accentSoft },
    { id: 'approved', label: 'Approved', value: approved_count, icon: IconCheckCircle, color: C.green, soft: C.greenSoft },
    { id: 'pending', label: 'Pending Review', value: pending_count, icon: IconClock, color: C.orange, soft: C.orangeSoft },
    { id: 'students', label: 'Students Reached', value: students_reached, icon: IconUsers, color: C.teal, soft: C.tealSoft },
    { id: 'comments', label: 'Total Comments', value: total_comments, icon: IconMessageCircle, color: C.purple, soft: C.purpleSoft }
  ]

  const reaccessCards = [
    { id: 'approved', label: 'Approved', value: reaccess_stats.approved, color: C.green, soft: C.greenSoft, icon: IconCheckCircle },
    { id: 'denied', label: 'Denied', value: reaccess_stats.denied, color: C.red, soft: C.redSoft, icon: IconX },
    { id: 'pending', label: 'Pending', value: reaccess_stats.pending, color: C.orange, soft: C.orangeSoft, icon: IconClock }
  ]

  return (
    <div>
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {stats.map((s) => {
          const IconComp = s.icon
          return (
            <div key={s.id} className="rounded-2xl overflow-hidden" style={{ background: C.card, boxShadow: cardShadow }}>
              <div className="h-1.5 w-full" style={{ background: s.color }} />
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.soft }}>
                  <IconComp size={18} color={s.color} />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold leading-none" style={{ color: C.ink }}>{s.value}</p>
                  <p className="text-[11px] mt-1 truncate" style={{ color: C.sub }}>{s.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* BAR CHART + PIE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* MONTHLY UPLOADS — BAR CHART */}
        <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
          <div className="flex items-center gap-2 mb-1">
            <IconBarChart size={16} color={C.accent} />
            <h2 className="font-bold text-base" style={{ color: C.ink }}>Uploads Over Time</h2>
          </div>
          <p className="text-xs mb-4" style={{ color: C.sub }}>Content posted per month, last 6 months</p>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthly_uploads} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.sub }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.sub }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: C.softPanel }} />
                <Bar dataKey="count" name="Uploads" fill={C.accent} radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CONTENT TYPE — PIE CHART */}
        <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
          <div className="flex items-center gap-2 mb-1">
            <IconPieChart size={16} color={C.accent} />
            <h2 className="font-bold text-base" style={{ color: C.ink }}>Content Type Mix</h2>
          </div>
          <p className="text-xs mb-4" style={{ color: C.sub }}>Breakdown of your uploads by format</p>

          {typeChartData.length === 0 ? (
            <p className="text-sm py-16 text-center" style={{ color: C.sub }}>No content to display yet</p>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={typeChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {typeChartData.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={30}
                    formatter={(value) => <span style={{ color: C.ink, fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* CATEGORY BREAKDOWN — HORIZONTAL BAR CHART */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: C.card, boxShadow: cardShadow }}>
        <div className="flex items-center gap-2 mb-1">
          <IconTag size={16} color={C.accent} />
          <h2 className="font-bold text-base" style={{ color: C.ink }}>Content by Category</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: C.sub }}>Your top categories by number of uploads</p>

        {categoryChartData.length === 0 ? (
          <p className="text-sm py-10 text-center" style={{ color: C.sub }}>No categories to display yet</p>
        ) : (
          <div style={{ width: '100%', height: Math.max(180, categoryChartData.length * 46) }}>
            <ResponsiveContainer>
              <BarChart
                data={categoryChartData}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: C.sub }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={150}
                  tick={{ fontSize: 12, fill: C.ink }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: C.softPanel }} />
                <Bar dataKey="count" name="Content" fill={C.teal} radius={[0, 6, 6, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* TOP PERFORMING CONTENT — TABLE */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: C.card, boxShadow: cardShadow }}>
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <IconUsers size={16} color={C.accent} />
            <h2 className="font-bold text-base" style={{ color: C.ink }}>Top Performing Content</h2>
          </div>
          <p className="text-xs" style={{ color: C.sub }}>Ranked by number of students with access</p>
        </div>

        {(!top_content || top_content.length === 0) ? (
          <p className="text-sm text-center pb-8" style={{ color: C.sub }}>No content to rank yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: C.softPanel }}>
                  {['Content', 'Type', 'Category', 'Students', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold" style={{ color: C.sub }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: C.border }}>
                {top_content.map((item) => {
                  const meta = TYPE_META[item.content_type] || TYPE_META.note
                  const TypeIcon = meta.icon
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.soft }}>
                            <TypeIcon size={15} color={meta.color} />
                          </div>
                          <p className="text-sm font-medium truncate max-w-[220px]" style={{ color: C.ink }}>{item.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-xs font-medium" style={{ color: C.sub }}>{meta.label}</td>
                      <td className="px-6 py-3.5">
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: C.accentSoft, color: C.accentDark }}>
                          {item.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: C.ink }}>{item.students}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                          style={
                            item.is_approved
                              ? { background: C.greenSoft, color: C.green }
                              : item.is_rejected
                              ? { background: C.redSoft, color: C.red }
                              : { background: C.orangeSoft, color: C.orange }
                          }
                        >
                          {item.is_approved ? 'Approved' : item.is_rejected ? 'Rejected' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RE-ACCESS REQUEST OUTCOMES */}
      <div className="rounded-2xl p-6" style={{ background: C.card, boxShadow: cardShadow }}>
        <div className="flex items-center gap-2 mb-1">
          <IconClock size={16} color={C.accent} />
          <h2 className="font-bold text-base" style={{ color: C.ink }}>Re-Access Request Outcomes</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: C.sub }}>How you've responded to student re-access requests</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {reaccessCards.map((r) => {
            const IconComp = r.icon
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ background: r.soft }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#ffffff' }}>
                  <IconComp size={16} color={r.color} />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none" style={{ color: r.color }}>{r.value}</p>
                  <p className="text-[11px] mt-1" style={{ color: C.ink }}>{r.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
