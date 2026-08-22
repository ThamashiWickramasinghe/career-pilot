import { useState, useEffect } from 'react'
import API from '../../utils/api'

/* ============================================================
   COLOUR THEME (matches InstructorDashboard.jsx)
   ============================================================ */
const C = {
  bg: '#F7F9FC',

  panel: '#FFFFFF',
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
  <Icon
    {...p}
    path={
      <>
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
        <path d="M9 10h6M9 13.5h6M9 17h3.5" />
      </>
    }
  />
)

const IconRefreshCcw = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M3 12a9 9 0 0115-6.7L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 01-15 6.7L3 16" />
        <path d="M3 21v-5h5" />
      </>
    }
  />
)

const IconMessageCircle = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </>
    }
  />
)

const IconVideo = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="M16 10l6-3.2v10.4L16 14" />
      </>
    }
  />
)

const IconFileText = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M6 2h9l5 5v15H6z" />
        <path d="M15 2v5h5" />
        <path d="M9 13h6M9 17h6M9 9.5h2" />
      </>
    }
  />
)

const IconNotes = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    }
  />
)

const IconCheckCircle = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.7 2.7L16 9.5" />
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
        <path d="M12 7v5l3.5 2" />
      </>
    }
  />
)

const IconEdit = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
      </>
    }
  />
)

const IconTrash = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
      </>
    }
  />
)

const IconArrowLeft = (p) => (
  <Icon {...p} path={<><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></>} />
)

const IconX = (p) => (
  <Icon {...p} path={<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>} />
)

const IconAlertCircle = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </>
    }
  />
)

const IconInbox = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M4 12h4l2 3h4l2-3h4" />
        <path d="M5.5 5h13l2.5 7v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z" />
      </>
    }
  />
)

const IconLoader = (p) => (
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" className="animate-spin flex-shrink-0">
    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
    <path d="M21 12a9 9 0 00-9-9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const TYPE_META = {
  video_link: { label: 'Video', icon: IconVideo, color: '#1769E0', soft: '#E8F1FF' },
  pdf: { label: 'PDF', icon: IconFileText, color: '#2FB171', soft: '#E7F8EF' },
  note: { label: 'Notes', icon: IconNotes, color: '#8067D9', soft: '#F0ECFF' }
}

const EDIT_CATEGORIES = [
  'Web Development', 'Mobile Development', 'Software Engineering', 'Data Science',
  'Machine Learning & AI', 'Database & SQL', 'UI/UX Design', 'Graphic Design',
  'DevOps & Cloud', 'Cybersecurity', 'Networking', 'Programming Fundamentals',
  'Python', 'Java', 'JavaScript', 'React & Frontend', 'Node.js & Backend',
  'Flutter & Dart', 'Project Management', 'Business Analysis', 'Quality Assurance', 'Other'
]

/* ============================================================
   MANAGE CONTENT
   ============================================================ */

export default function ManageContent() {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [reAccessRequests, setReAccessRequests] = useState([])
  const [activeSection, setActiveSection] = useState('content')
  const [selectedContent, setSelectedContent] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editItem, setEditItem] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    fetchMyContent()
    fetchReAccessRequests()
  }, [])

  const fetchMyContent = async () => {
    try {
      const res = await API.get('/learning/my-content')
      setContents(res.data.content)
    } catch (err) {
      setError('Failed to load content')
    }
    setLoading(false)
  }

  const fetchReAccessRequests = async () => {
    try {
      const res = await API.get('/learning/reaccess/requests')
      setReAccessRequests(res.data.requests)
    } catch (err) {
      console.error('Failed to load requests')
    }
  }

  const fetchComments = async (contentId) => {
    setCommentsLoading(true)
    try {
      const res = await API.get(`/learning/content/${contentId}/comments`)
      setComments(res.data.comments)
    } catch (err) {
      setError('Failed to load comments')
    }
    setCommentsLoading(false)
  }

  const viewComments = (content) => {
    setSelectedContent(content)
    fetchComments(content.id)
    setActiveSection('comments')
  }

  const respondToRequest = async (requestId, action) => {
    try {
      await API.post(`/learning/reaccess/${requestId}/respond`, { action })
      setSuccess(`Request ${action} successfully!`)
      fetchReAccessRequests()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to respond to request')
    }
  }

  const startEdit = (item) => {
    setEditItem(item)
    setEditForm({
      title: item.title,
      description: item.description || '',
      category: item.category,
      drive_link: item.drive_link || '',
    })
  }

  const saveEdit = async () => {
    setEditLoading(true)
    try {
      await API.put(`/learning/content/${editItem.id}`, editForm)
      setSuccess('Content updated successfully!')
      setEditItem(null)
      fetchMyContent()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update content')
    }
    setEditLoading(false)
  }

  const deleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return
    setDeleteLoading(contentId)
    try {
      await API.delete(`/learning/content/${contentId}`)
      setSuccess('Content deleted successfully!')
      fetchMyContent()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete content')
    }
    setDeleteLoading(null)
  }

  const inputStyle = {
    background: C.softPanel,
    border: `1px solid ${C.border}`,
    color: C.ink,
    '--tw-ring-color': C.accent,
  }

  return (
    <div>
      {/* ALERTS */}
      {error && (
        <div
          className="mb-4 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5"
          style={{ background: C.redSoft, color: C.red }}
        >
          <IconAlertCircle size={16} color={C.red} />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} style={{ color: C.red }}>
            <IconX size={14} color={C.red} />
          </button>
        </div>
      )}
      {success && (
        <div
          className="mb-4 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5"
          style={{ background: C.greenSoft, color: C.green }}
        >
          <IconCheckCircle size={16} color={C.green} />
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess('')} style={{ color: C.green }}>
            <IconX size={14} color={C.green} />
          </button>
        </div>
      )}

      {/* SECTION TABS */}
      {activeSection !== 'comments' && (
        <div className="flex gap-2.5 mb-6">
          <button
            onClick={() => setActiveSection('content')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition"
            style={
              activeSection === 'content'
                ? { background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`, color: '#ffffff' }
                : { background: C.card, color: C.sub, border: `1px solid ${C.border}` }
            }
          >
            <IconClipboardList size={15} color={activeSection === 'content' ? '#ffffff' : C.sub} />
            My Content ({contents.length})
          </button>

          <button
            onClick={() => setActiveSection('requests')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition"
            style={
              activeSection === 'requests'
                ? { background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`, color: '#ffffff' }
                : { background: C.card, color: C.sub, border: `1px solid ${C.border}` }
            }
          >
            <IconRefreshCcw size={15} color={activeSection === 'requests' ? '#ffffff' : C.sub} />
            Re-Access Requests ({reAccessRequests.length})
          </button>
        </div>
      )}

      {/* MY CONTENT */}
      {activeSection === 'content' && (
        <div>
          {loading ? (
            <div
              className="text-center py-20 rounded-2xl"
              style={{ background: C.card, boxShadow: cardShadow }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse"
                style={{ background: C.accentSoft }}
              >
                <IconClipboardList size={24} color={C.accent} />
              </div>
              <p className="text-sm" style={{ color: C.sub }}>Loading your content...</p>
            </div>
          ) : contents.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl"
              style={{ background: C.card, boxShadow: cardShadow }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: C.softPanel }}
              >
                <IconInbox size={24} color={C.sub} />
              </div>
              <h3 className="text-base font-bold mb-1.5" style={{ color: C.ink }}>No content yet</h3>
              <p className="text-sm" style={{ color: C.sub }}>Go to Post Content to upload your first material</p>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: C.card, boxShadow: cardShadow }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: C.softPanel }}>
                      {['Content', 'Type', 'Category', 'Status', 'Date', 'Actions'].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold" style={{ color: C.sub }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: C.border }}>
                    {contents.map((item) => {
                      const meta = TYPE_META[item.content_type] || TYPE_META.note
                      const TypeIcon = meta.icon
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: meta.soft }}
                              >
                                <TypeIcon size={16} color={meta.color} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate max-w-[220px]" style={{ color: C.ink }}>{item.title}</p>
                                <p className="text-xs truncate max-w-[220px]" style={{ color: C.sub }}>{item.description}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <TypeIcon size={13} color={C.sub} />
                              <span className="text-xs font-medium" style={{ color: C.sub }}>{meta.label}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                              style={{ background: C.accentSoft, color: C.accentDark }}
                            >
                              {item.category}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                              style={
                                item.is_approved
                                  ? { background: C.greenSoft, color: C.green }
                                  : { background: C.orangeSoft, color: C.orange }
                              }
                            >
                              {item.is_approved
                                ? <IconCheckCircle size={11} color={C.green} />
                                : <IconClock size={11} color={C.orange} />}
                              {item.is_approved ? 'Approved' : 'Pending'}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs" style={{ color: C.sub }}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => viewComments(item)}
                                title="Comments"
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-80"
                                style={{ background: C.accentSoft }}
                              >
                                <IconMessageCircle size={14} color={C.accentDark} />
                              </button>
                              <button
                                onClick={() => startEdit(item)}
                                title="Edit"
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-80"
                                style={{ background: C.tealSoft }}
                              >
                                <IconEdit size={14} color={C.teal} />
                              </button>
                              <button
                                onClick={() => deleteContent(item.id)}
                                disabled={deleteLoading === item.id}
                                title="Delete"
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:opacity-80 disabled:opacity-50"
                                style={{ background: C.redSoft }}
                              >
                                {deleteLoading === item.id
                                  ? <IconLoader size={13} color={C.red} />
                                  : <IconTrash size={14} color={C.red} />}
                              </button>
                            </div>
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

      {/* COMMENTS VIEW */}
      {activeSection === 'comments' && selectedContent && (
        <div>
          <button
            onClick={() => setActiveSection('content')}
            className="flex items-center gap-1.5 font-medium text-sm mb-5 hover:opacity-75 transition"
            style={{ color: C.accent }}
          >
            <IconArrowLeft size={15} color={C.accent} />
            Back to My Content
          </button>

          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: C.card, boxShadow: cardShadow }}
          >
            <div className="flex items-center gap-4">
              {(() => {
                const meta = TYPE_META[selectedContent.content_type] || TYPE_META.note
                const TypeIcon = meta.icon
                return (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: meta.soft }}
                  >
                    <TypeIcon size={20} color={meta.color} />
                  </div>
                )
              })()}
              <div>
                <h3 className="font-bold text-sm" style={{ color: C.ink }}>{selectedContent.title}</h3>
                <p className="text-xs mt-0.5" style={{ color: C.sub }}>
                  {selectedContent.category} · {TYPE_META[selectedContent.content_type]?.label || 'Notes'}
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{ background: C.card, boxShadow: cardShadow }}
          >
            <h3 className="font-bold text-base mb-5 flex items-center gap-2" style={{ color: C.ink }}>
              <IconMessageCircle size={17} color={C.accent} />
              Student Comments ({comments.length})
            </h3>

            {commentsLoading ? (
              <div className="text-center py-10">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse"
                  style={{ background: C.accentSoft }}
                >
                  <IconMessageCircle size={18} color={C.accent} />
                </div>
                <p className="text-sm" style={{ color: C.sub }}>Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-10">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: C.softPanel }}
                >
                  <IconMessageCircle size={18} color={C.sub} />
                </div>
                <p className="text-sm" style={{ color: C.sub }}>No comments yet on this content</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})` }}
                    >
                      {c.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 p-3.5 rounded-xl" style={{ background: C.softPanel }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold" style={{ color: C.ink }}>{c.user_name}</span>
                        <span className="text-[11px]" style={{ color: C.sub }}>
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: C.ink }}>{c.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RE-ACCESS REQUESTS */}
      {activeSection === 'requests' && (
        <div>
          {reAccessRequests.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl"
              style={{ background: C.card, boxShadow: cardShadow }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: C.greenSoft }}
              >
                <IconCheckCircle size={24} color={C.green} />
              </div>
              <h3 className="text-base font-bold mb-1.5" style={{ color: C.ink }}>No pending requests</h3>
              <p className="text-sm" style={{ color: C.sub }}>All re-access requests have been handled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reAccessRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl p-5"
                  style={{ background: C.card, boxShadow: cardShadow }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})` }}
                    >
                      {req.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: C.ink }}>{req.user_name}</p>
                      <p className="text-[11px]" style={{ color: C.sub }}>
                        {new Date(req.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl mb-3" style={{ background: C.softPanel }}>
                    <p className="text-[11px] mb-1" style={{ color: C.sub }}>Requesting access to:</p>
                    <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: C.ink }}>
                      <IconClipboardList size={13} color={C.accent} />
                      {req.content_title}
                    </p>
                  </div>

                  {req.message && (
                    <p className="text-xs mb-3 italic" style={{ color: C.sub }}>"{req.message}"</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => respondToRequest(req.id, 'approved')}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                      style={{ background: C.green }}
                    >
                      <IconCheckCircle size={13} color="#ffffff" />
                      Approve
                    </button>
                    <button
                      onClick={() => respondToRequest(req.id, 'denied')}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                      style={{ background: C.red }}
                    >
                      <IconX size={13} color="#ffffff" />
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl p-6 w-full max-w-lg"
            style={{ background: C.card, boxShadow: '0 20px 50px rgba(16,42,67,0.25)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base flex items-center gap-2" style={{ color: C.ink }}>
                <IconEdit size={17} color={C.accent} />
                Edit Content
              </h3>
              <button
                onClick={() => setEditItem(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100"
              >
                <IconX size={16} color={C.sub} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition resize-none"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                  style={inputStyle}
                >
                  {EDIT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {editItem.content_type === 'video_link' && (
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>Google Drive Link</label>
                  <input
                    type="url"
                    value={editForm.drive_link}
                    onChange={(e) => setEditForm({ ...editForm, drive_link: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                    style={inputStyle}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={saveEdit}
                  disabled={editLoading}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60 flex items-center justify-center gap-2 hover:shadow-md transition"
                  style={{ background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})` }}
                >
                  {editLoading ? <IconLoader size={15} /> : null}
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditItem(null)}
                  className="px-6 py-3 rounded-xl font-semibold text-sm transition hover:bg-gray-50"
                  style={{ border: `1px solid ${C.border}`, color: C.sub, background: C.card }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
