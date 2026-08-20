import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

// ============================================================
// COLOR TOKENS
// ============================================================
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

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile Development',
  'Software Engineering',
  'Data Science & AI',
  'Machine Learning & AI',
  'Database & SQL',
  'UI/UX Design',
  'Graphic Design',
  'DevOps & Cloud',
  'Cybersecurity',
  'Networking',
  'Programming Fundamentals',
  'Python',
  'Java',
  'JavaScript',
  'React & Frontend',
  'Node.js & Backend',
  'Flutter & Dart',
  'Project Management',
  'Business Analysis',
  'Quality Assurance',
  'Other',
]

const TYPES = ['All', 'Video', 'PDF', 'Notes']

// ============================================================
// ICONS
// ============================================================

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const VideoIcon = ({ size = 5, color }) => (
  <svg
    className={`w-${size} h-${size}`}
    fill="none"
    stroke={color || 'currentColor'}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z
      M15.91 11.672a.375.375 0 010 .656l-5.603 3.113
      a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.328l5.603 3.113z"
    />
  </svg>
)

const PDFIcon = ({ size = 5, color }) => (
  <svg
    className={`w-${size} h-${size}`}
    fill="none"
    stroke={color || 'currentColor'}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5
      A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25
      m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25
      c0 .621.504 1.125 1.125 1.125h12.75
      c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
)

const NoteIcon = ({ size = 5, color }) => (
  <svg
    className={`w-${size} h-${size}`}
    fill="none"
    stroke={color || 'currentColor'}
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652
      L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685
      a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125
      M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25
      A2.25 2.25 0 015.25 6H10"
    />
  </svg>
)

const BookIcon = ({ size = 5 }) => (
  <svg
    className={`w-${size} h-${size}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25
      A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292
      m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25
      A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292
      m0-14.25v14.25"
    />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
)

const ArrowRightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
)

const ClockIcon = ({ size = 4 }) => (
  <svg
    className={`w-${size} h-${size}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const UserIcon = ({ size = 4 }) => (
  <svg
    className={`w-${size} h-${size}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z
      M4.501 20.118a7.5 7.5 0 0114.998 0
      A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5
      A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5
      m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
)

const SendIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12
      59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
    />
  </svg>
)

const XIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

// ============================================================
// TYPE STYLE
// ============================================================

function getTypeStyle(type) {
  switch (type) {
    case 'video_link':
      return {
        bg: theme.softBlue,
        color: theme.blue,
        icon: <VideoIcon size={4} color={theme.blue} />,
      }

    case 'pdf':
      return {
        bg: theme.softOrange,
        color: theme.orange,
        icon: <PDFIcon size={4} color={theme.orange} />,
      }

    default:
      return {
        bg: theme.softGreen,
        color: theme.green,
        icon: <NoteIcon size={4} color={theme.green} />,
      }
  }
}

// ============================================================
// CONTENT TYPE LABEL
// ============================================================

function getContentTypeLabel(type) {
  if (type === 'video_link') return 'Video'
  if (type === 'pdf') return 'PDF'
  return 'Notes'
}

// ============================================================
// MAIN LEARNING HUB
// ============================================================

export default function LearningHub() {
  const { user } = useAuth()

  const [contents, setContents] = useState([])
  const [filteredContents, setFilteredContents] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedContent, setSelectedContent] = useState(null)

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const [hasAccess, setHasAccess] = useState(true)
  const [accessInfo, setAccessInfo] = useState(null)

  const [reAccessMsg, setReAccessMsg] = useState('')
  const [showReAccess, setShowReAccess] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ============================================================
  // LOAD CONTENT
  // ============================================================

  useEffect(() => {
    fetchContent()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [contents, selectedCategory, selectedType, searchQuery])

  // ============================================================
  // FETCH CONTENT
  // ============================================================

  const fetchContent = async () => {
    setLoading(true)

    try {
      const res = await API.get('/learning/content')

      const loadedContent = Array.isArray(res.data.content)
        ? res.data.content
        : []

      setContents(loadedContent)
    } catch (err) {
      setError('Failed to load content')
    }

    setLoading(false)
  }

  // ============================================================
  // FILTER + SORT CONTENT
  // ============================================================

  const applyFilters = () => {
    let filtered = [...contents]

    // Category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        c => c.category === selectedCategory
      )
    }

    // Content type
    if (selectedType !== 'All') {
      filtered = filtered.filter(c => {
        if (selectedType === 'Video') {
          return c.content_type === 'video_link'
        }

        if (selectedType === 'PDF') {
          return c.content_type === 'pdf'
        }

        if (selectedType === 'Notes') {
          return c.content_type === 'note'
        }

        return true
      })
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()

      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.instructor_name?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      )
    }

    // ========================================================
    // PROFESSIONAL CONTENT ORDER
    // Category order follows the Learning Hub structure.
    // Newest content appears first inside each category.
    // ========================================================

    filtered.sort((a, b) => {
      const categoryA = CATEGORIES.indexOf(a.category)
      const categoryB = CATEGORIES.indexOf(b.category)

      if (categoryA !== categoryB) {
        return categoryA - categoryB
      }

      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()

      return dateB - dateA
    })

    setFilteredContents(filtered)
  }

  // ============================================================
  // OPEN CONTENT
  // ============================================================

  const openContent = async content => {
    try {
      const res = await API.get(
        `/learning/content/${content.id}`
      )

      setSelectedContent(res.data.content)
      setComments(res.data.comments || [])
      setHasAccess(res.data.has_access)
      setAccessInfo(res.data.access_info)
    } catch (err) {
      setError('Failed to load content details')
    }
  }

  // ============================================================
  // COMMENT
  // ============================================================

  const submitComment = async () => {
    if (!newComment.trim()) return

    try {
      const res = await API.post(
        `/learning/content/${selectedContent.id}/comment`,
        {
          comment: newComment,
        }
      )

      setComments([res.data.comment, ...comments])
      setNewComment('')
    } catch (err) {
      setError('Failed to add comment')
    }
  }

  // ============================================================
  // REQUEST RE-ACCESS
  // ============================================================

  const requestReAccess = async () => {
    try {
      await API.post('/learning/reaccess', {
        content_id: selectedContent.id,
        message: reAccessMsg,
      })

      setSuccess('Re-access request sent!')
      setShowReAccess(false)
      setReAccessMsg('')

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to send request'
      )
    }
  }

  // ============================================================
  // DAYS REMAINING
  // ============================================================

  const getDaysRemaining = expiresAt => {
    if (!expiresAt) return 0

    const diff =
      new Date(expiresAt).getTime() -
      new Date().getTime()

    return Math.max(
      0,
      Math.ceil(diff / (1000 * 60 * 60 * 24))
    )
  }

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedType('All')
  }

  // ============================================================
  // CONTENT DETAIL VIEW
  // ============================================================

  if (selectedContent) {
    const daysLeft = accessInfo
      ? getDaysRemaining(accessInfo.expires_at)
      : 0

    const typeStyle = getTypeStyle(
      selectedContent.content_type
    )

    return (
      <div
        className="min-h-screen"
        style={{ background: theme.bg }}
      >
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Back */}
          <button
            onClick={() => setSelectedContent(null)}
            className="flex items-center gap-2 text-sm font-semibold mb-6 transition hover:opacity-70"
            style={{ color: theme.primary }}
          >
            <ArrowLeftIcon />
            Back to My Courses
          </button>

          {/* Alerts */}
          {error && (
            <div
              className="mb-4 p-3 rounded-xl text-sm flex items-center justify-between"
              style={{
                background: '#fee2e2',
                color: '#dc2626',
              }}
            >
              {error}

              <button onClick={() => setError('')}>
                <XIcon />
              </button>
            </div>
          )}

          {success && (
            <div
              className="mb-4 p-3 rounded-xl text-sm font-medium"
              style={{
                background: theme.softGreen,
                color: theme.green,
              }}
            >
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <div className="lg:col-span-2 space-y-6">

              {/* Course Header */}
              <div
                className="rounded-3xl overflow-hidden shadow-sm"
                style={{
                  background: theme.white,
                  border: `1px solid ${theme.border}`,
                }}
              >

                {/* Thumbnail */}
                <div
                  className="relative h-60 flex items-center justify-center"
                  style={{
                    background:
                      `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`,
                  }}
                >

                  {selectedContent.thumbnail ? (
                    <img
                      src={`http://localhost:5000/${selectedContent.thumbnail}`}
                      alt={selectedContent.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-white">

                      <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                        style={{
                          background:
                            'rgba(255,255,255,0.2)',
                        }}
                      >
                        {selectedContent.content_type ===
                        'video_link' ? (
                          <VideoIcon
                            size={8}
                            color="white"
                          />
                        ) : selectedContent.content_type ===
                          'pdf' ? (
                          <PDFIcon
                            size={8}
                            color="white"
                          />
                        ) : (
                          <NoteIcon
                            size={8}
                            color="white"
                          />
                        )}
                      </div>

                      <p className="font-semibold text-lg">
                        {selectedContent.title}
                      </p>
                    </div>
                  )}

                  {/* Access Badge */}
                  {selectedContent.content_type ===
                    'video_link' && (
                    <div className="absolute top-4 right-4">
                      {hasAccess ? (
                        <span
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold text-white"
                          style={{
                            background: theme.green,
                          }}
                        >
                          <ClockIcon size={3} />
                          {daysLeft} days left
                        </span>
                      ) : (
                        <span
                          className="text-xs px-3 py-1.5 rounded-full font-semibold"
                          style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                          }}
                        >
                          Access Expired
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Course Information */}
                <div className="p-6">

                  <div className="flex items-start justify-between gap-4 mb-4">

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2 mb-3">

                        <span
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: typeStyle.bg,
                            color: typeStyle.color,
                          }}
                        >
                          {typeStyle.icon}

                          {getContentTypeLabel(
                            selectedContent.content_type
                          )}
                        </span>

                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: theme.softPurple,
                            color: theme.primary,
                          }}
                        >
                          {selectedContent.category}
                        </span>

                      </div>

                      <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                          color: theme.mainText,
                        }}
                      >
                        {selectedContent.title}
                      </h1>

                      <p
                        className="text-sm leading-6"
                        style={{
                          color: theme.secondaryText,
                        }}
                      >
                        {selectedContent.description}
                      </p>

                    </div>
                  </div>

                  {/* Metadata */}
                  <div
                    className="flex flex-wrap items-center gap-5 text-sm mb-6"
                    style={{
                      color: theme.secondaryText,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <UserIcon />
                      <span>
                        {selectedContent.instructor_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ClockIcon />
                      <span>
                        {new Date(
                          selectedContent.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Access */}
                  {hasAccess ? (
                    <div
                      className="p-4 rounded-2xl"
                      style={{
                        background: theme.softGreen,
                        border:
                          `1px solid ${theme.green}30`,
                      }}
                    >

                      {selectedContent.content_type ===
                        'video_link' &&
                        selectedContent.drive_link && (
                          <div>

                            <p
                              className="text-sm font-semibold mb-3 flex items-center gap-2"
                              style={{
                                color: theme.green,
                              }}
                            >
                              <VideoIcon
                                size={4}
                                color={theme.green}
                              />
                              Watch Course Video
                            </p>

                            <a
                              href={
                                selectedContent.drive_link
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition hover:opacity-90"
                              style={{
                                background:
                                  theme.primary,
                              }}
                            >
                              <ExternalLinkIcon />
                              Open Video
                            </a>

                            {accessInfo && (
                              <p
                                className="text-xs mt-2"
                                style={{
                                  color: theme.green,
                                }}
                              >
                                Access expires:{' '}
                                {new Date(
                                  accessInfo.expires_at
                                ).toLocaleDateString()}
                                {' · '}
                                {daysLeft} days remaining
                              </p>
                            )}

                          </div>
                        )}

                      {selectedContent.content_type ===
                        'pdf' &&
                        selectedContent.file_path && (
                          <div>

                            <p
                              className="text-sm font-semibold mb-3 flex items-center gap-2"
                              style={{
                                color: theme.green,
                              }}
                            >
                              <PDFIcon
                                size={4}
                                color={theme.green}
                              />
                              PDF Learning Material
                            </p>

                            <a
                              href={`http://localhost:5000/${selectedContent.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
                              style={{
                                background:
                                  theme.primary,
                              }}
                            >
                              <ExternalLinkIcon />
                              Open PDF
                            </a>

                          </div>
                        )}

                    </div>
                  ) : (
                    <div
                      className="p-4 rounded-2xl"
                      style={{
                        background: '#fee2e2',
                        border:
                          '1px solid #fca5a530',
                      }}
                    >

                      <p
                        className="text-sm font-semibold mb-3"
                        style={{
                          color: '#dc2626',
                        }}
                      >
                        Your 30-day access has expired
                      </p>

                      {!showReAccess ? (
                        <button
                          onClick={() =>
                            setShowReAccess(true)
                          }
                          className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                          style={{
                            background:
                              theme.primary,
                          }}
                        >
                          Request Re-Access
                        </button>
                      ) : (
                        <div className="space-y-3">

                          <textarea
                            value={reAccessMsg}
                            onChange={e =>
                              setReAccessMsg(
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                            style={{
                              background:
                                theme.white,
                              border:
                                `1px solid ${theme.border}`,
                              color:
                                theme.mainText,
                            }}
                            placeholder="Why do you need re-access? (optional)"
                          />

                          <div className="flex gap-2">

                            <button
                              onClick={requestReAccess}
                              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                              style={{
                                background:
                                  theme.primary,
                              }}
                            >
                              Send Request
                            </button>

                            <button
                              onClick={() =>
                                setShowReAccess(false)
                              }
                              className="px-4 py-2 rounded-xl text-sm font-medium border"
                              style={{
                                color:
                                  theme.secondaryText,
                                borderColor:
                                  theme.border,
                              }}
                            >
                              Cancel
                            </button>

                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>

              {/* ==================================================
                  COMMENTS
              ================================================== */}

              <div
                className="rounded-3xl p-6 shadow-sm"
                style={{
                  background: theme.white,
                  border: `1px solid ${theme.border}`,
                }}
              >

                <h3
                  className="font-bold mb-5 flex items-center gap-2"
                  style={{
                    color: theme.mainText,
                  }}
                >

                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: theme.softPurple,
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      style={{
                        color: theme.primary,
                      }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 9.75a.375.375 0 11-.75 0
                        .375.375 0 01.75 0zm0 0H8.25
                        m4.125 0a.375.375 0 11-.75 0
                        .375.375 0 01.75 0zm0 0H12
                        m4.125 0a.375.375 0 11-.75 0
                        .375.375 0 01.75 0zm0 0h-.375
                        m-13.5 3.01c0 1.6 1.123 2.994
                        2.707 3.227 1.087.16 2.185.283
                        3.293.369V21l4.184-4.183
                        a1.14 1.14 0 01.778-.332
                        48.294 48.294 0 005.83-.498
                        c1.585-.233 2.708-1.626
                        2.708-3.228V6.741
                        c0-1.602-1.123-2.995-2.707-3.228
                        A48.394 48.394 0 0012 3
                        c-2.392 0-4.744.175-7.043.513
                        C3.373 3.746 2.25 5.14
                        2.25 6.741v6.018z"
                      />
                    </svg>
                  </div>

                  Comments ({comments.length})
                </h3>

                {/* Add Comment */}
                <div className="flex gap-3 mb-5">

                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{
                      background:
                        `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`,
                    }}
                  >
                    {user?.full_name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="flex-1 flex gap-2">

                    <input
                      type="text"
                      value={newComment}
                      onChange={e =>
                        setNewComment(e.target.value)
                      }
                      onKeyDown={e =>
                        e.key === 'Enter' &&
                        submitComment()
                      }
                      className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      style={{
                        background:
                          theme.softPanel,
                        border:
                          `1px solid ${theme.border}`,
                        color:
                          theme.mainText,
                      }}
                      placeholder="Share your thoughts..."
                    />

                    <button
                      onClick={submitComment}
                      disabled={!newComment.trim()}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-50"
                      style={{
                        background:
                          theme.primary,
                      }}
                    >
                      <SendIcon />
                    </button>

                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-3">

                  {comments.length === 0 ? (
                    <div
                      className="text-center py-8 rounded-xl"
                      style={{
                        background:
                          theme.softPanel,
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{
                          color:
                            theme.secondaryText,
                        }}
                      >
                        No comments yet. Be the first!
                      </p>
                    </div>
                  ) : (
                    comments.map(c => (
                      <div
                        key={c.id}
                        className="flex gap-3"
                      >

                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{
                            background:
                              `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`,
                          }}
                        >
                          {c.user_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div
                          className="flex-1 p-3 rounded-xl"
                          style={{
                            background:
                              theme.softPanel,
                          }}
                        >

                          <div className="flex items-center gap-2 mb-1">

                            <span
                              className="text-sm font-semibold"
                              style={{
                                color:
                                  theme.mainText,
                              }}
                            >
                              {c.user_name}
                            </span>

                            <span
                              className="text-xs"
                              style={{
                                color:
                                  theme.secondaryText,
                              }}
                            >
                              {new Date(
                                c.created_at
                              ).toLocaleDateString()}
                            </span>

                          </div>

                          <p
                            className="text-sm"
                            style={{
                              color:
                                theme.mainText,
                            }}
                          >
                            {c.comment}
                          </p>

                        </div>
                      </div>
                    ))
                  )}

                </div>
              </div>

            </div>

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <div className="space-y-5">

              <div
                className="rounded-3xl p-5 shadow-sm"
                style={{
                  background: theme.white,
                  border: `1px solid ${theme.border}`,
                }}
              >

                <h3
                  className="font-bold mb-4"
                  style={{
                    color: theme.mainText,
                  }}
                >
                  About Instructor
                </h3>

                <div className="flex items-center gap-3 mb-4">

                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{
                      background:
                        `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`,
                    }}
                  >
                    {selectedContent.instructor_name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{
                        color:
                          theme.mainText,
                      }}
                    >
                      {selectedContent.instructor_name}
                    </p>

                    <p
                      className="text-xs"
                      style={{
                        color:
                          theme.secondaryText,
                      }}
                    >
                      Course Instructor
                    </p>
                  </div>

                </div>

                <div
                  className="space-y-3 text-xs"
                  style={{
                    color:
                      theme.secondaryText,
                  }}
                >

                  <div className="flex items-center gap-2">
                    <BookIcon size={3} />
                    <span>
                      Category: {selectedContent.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ClockIcon size={3} />
                    <span>
                      Posted:{' '}
                      {new Date(
                        selectedContent.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {selectedContent.content_type ===
                    'video_link' && (
                    <div className="flex items-center gap-2">
                      <ClockIcon size={3} />
                      <span>
                        30-day access policy
                      </span>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // MAIN LEARNING HUB
  // ============================================================

  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.bg,
      }}
    >

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ======================================================
    PROFESSIONAL HEADER
====================================================== */}

<div className="mb-5">

  {/* HEADER — LEFT ALIGNED */}
  <div className="flex items-center justify-start">
    <div>
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{
          color: theme.mainText,
        }}
      >
        My Courses
      </h1>

      
    </div>
  </div>

</div>


{/* ======================================================
    SEARCH + CONTENT TYPES
    SEARCH LEFT / CONTENT TYPES RIGHT
====================================================== */}

<div className="flex items-center gap-5 mb-8">

  {/* SEARCH — SMALLER WIDTH */}
  <div className="w-full max-w-[620px]">

    <div className="relative">

      <div
        className="absolute left-4 top-1/2 -translate-y-1/2"
        style={{
          color: theme.secondaryText,
        }}
      >
        <SearchIcon />
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={e =>
          setSearchQuery(e.target.value)
        }
        className="w-full pl-12 pr-12 py-3.5 text-sm focus:outline-none transition-all"
        style={{
          background: theme.white,
          border: `1px solid ${theme.border}`,
          color: theme.mainText,
          borderRadius: '16px',
          boxShadow:
            '0 3px 12px rgba(91, 86, 181, 0.05)',
        }}
        placeholder="Search courses, instructors, or categories..."
      />

      {searchQuery && (
        <button
          onClick={() =>
            setSearchQuery('')
          }
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center hover:opacity-70 transition"
          style={{
            background: theme.softPanel,
            color: theme.secondaryText,
          }}
        >
          <XIcon />
        </button>
      )}

    </div>

  </div>


  {/* CONTENT TYPES — ONE LINE */}
  <div className="flex-shrink-0">

    <div
      className="flex items-center gap-1.5 p-1.5 rounded-2xl whitespace-nowrap"
      style={{
        background: theme.white,
        border: `1px solid ${theme.border}`,
        boxShadow:
          '0 3px 12px rgba(91, 86, 181, 0.04)',
      }}
    >

      {TYPES.map(type => {

        const isActive =
          selectedType === type

        return (
          <button
            key={type}
            onClick={() =>
              setSelectedType(type)
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
            style={{
              background: isActive
                ? theme.primary
                : 'transparent',

              color: isActive
                ? theme.white
                : theme.secondaryText,

              boxShadow: isActive
                ? '0 3px 8px rgba(91, 86, 181, 0.18)'
                : 'none',
            }}
          >

            {type === 'All' && (
              <BookIcon size={4} />
            )}

            {type === 'Video' && (
              <VideoIcon
                size={4}
                color={
                  isActive
                    ? 'white'
                    : theme.secondaryText
                }
              />
            )}

            {type === 'PDF' && (
              <PDFIcon
                size={4}
                color={
                  isActive
                    ? 'white'
                    : theme.secondaryText
                }
              />
            )}

            {type === 'Notes' && (
              <NoteIcon
                size={4}
                color={
                  isActive
                    ? 'white'
                    : theme.secondaryText
                }
              />
            )}

            {type}

          </button>
        )
      })}

    </div>

  </div>

</div>
        {/* ======================================================
            ACTIVE SEARCH / FILTER STATUS
        ====================================================== */}

        {(searchQuery ||
          selectedCategory !== 'All' ||
          selectedType !== 'All') && (
          <div
            className="flex flex-wrap items-center justify-between gap-3 mb-6 px-4 py-3 rounded-2xl"
            style={{
              background: theme.softPurple,
              border:
                `1px solid ${theme.border}`,
            }}
          >

            <div className="flex flex-wrap items-center gap-2">

              <span
                className="text-xs font-semibold"
                style={{
                  color:
                    theme.secondaryText,
                }}
              >
                Showing:
              </span>

              {searchQuery && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: theme.white,
                    color: theme.primary,
                  }}
                >
                  "{searchQuery}"
                </span>
              )}

              {selectedType !== 'All' && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: theme.white,
                    color: theme.primary,
                  }}
                >
                  {selectedType}
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: theme.white,
                    color: theme.primary,
                  }}
                >
                  {selectedCategory}
                </span>
              )}

            </div>

            <button
              onClick={clearFilters}
              className="text-xs font-semibold hover:opacity-70 transition"
              style={{
                color: theme.primary,
              }}
            >
              Clear filters
            </button>

          </div>
        )}

        {/* ======================================================
            LEARNING CONTENT
        ====================================================== */}

        {loading ? (

          <div className="text-center py-24">

            <div
              className="w-12 h-12 rounded-full border-4 animate-spin mx-auto mb-4"
              style={{
                borderColor:
                  theme.softPurple,
                borderTopColor:
                  theme.primary,
              }}
            />

            <p
              className="text-sm"
              style={{
                color:
                  theme.secondaryText,
              }}
            >
              Loading your learning content...
            </p>

          </div>

        ) : filteredContents.length === 0 ? (

          <div
            className="text-center py-20 rounded-3xl"
            style={{
              background: theme.white,
              border:
                `1px solid ${theme.border}`,
            }}
          >

            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{
                background:
                  theme.softPurple,
                color: theme.primary,
              }}
            >
              <BookIcon size={7} />
            </div>

            <h3
              className="font-bold text-lg mb-2"
              style={{
                color: theme.mainText,
              }}
            >
              {searchQuery ||
              selectedCategory !== 'All' ||
              selectedType !== 'All'
                ? 'No learning content found'
                : 'No courses available'}
            </h3>

            <p
              className="text-sm mb-5"
              style={{
                color:
                  theme.secondaryText,
              }}
            >
              {searchQuery ||
              selectedCategory !== 'All' ||
              selectedType !== 'All'
                ? 'Try changing your search or filters.'
                : 'Learning materials will appear here once they are uploaded.'}
            </p>

            {(searchQuery ||
              selectedCategory !== 'All' ||
              selectedType !== 'All') && (
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{
                  background:
                    theme.primary,
                }}
              >
                Clear Filters
              </button>
            )}

          </div>

        ) : selectedCategory !== 'All' ? (

          /* ====================================================
             SELECTED CATEGORY
          ==================================================== */

          <div>

            <div className="flex items-center gap-3 mb-5">

              <div
                className="w-1 h-7 rounded-full"
                style={{
                  background:
                    theme.primary,
                }}
              />

              <div>
                <h2
                  className="font-bold text-lg"
                  style={{
                    color:
                      theme.mainText,
                  }}
                >
                  {selectedCategory}
                </h2>

                <p
                  className="text-xs mt-0.5"
                  style={{
                    color:
                      theme.secondaryText,
                  }}
                >
                  {filteredContents.length}{' '}
                  learning resource
                  {filteredContents.length !== 1
                    ? 's'
                    : ''}
                </p>
              </div>

            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredContents.map(content => (
                <CourseCard
                  key={content.id}
                  content={content}
                  onClick={() =>
                    openContent(content)
                  }
                />
              ))}
            </div>

          </div>

        ) : (

          /* ====================================================
             ALL COURSES — ORDERED BY CATEGORY
          ==================================================== */

          <div className="space-y-10">

            {CATEGORIES
              .filter(cat => cat !== 'All')
              .map(cat => {

                const catContents =
                  filteredContents
                    .filter(
                      c => c.category === cat
                    )
                    .sort((a, b) => {
                      const dateA =
                        new Date(
                          a.created_at || 0
                        ).getTime()

                      const dateB =
                        new Date(
                          b.created_at || 0
                        ).getTime()

                      return dateB - dateA
                    })

                if (catContents.length === 0) {
                  return null
                }

                return (
                  <section key={cat}>

                    {/* CATEGORY HEADER */}

                    <div className="flex items-center justify-between mb-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="w-1 h-7 rounded-full"
                          style={{
                            background:
                              theme.primary,
                          }}
                        />

                        <div>

                          <div className="flex items-center gap-2">

                            <h2
                              className="font-bold text-lg"
                              style={{
                                color:
                                  theme.mainText,
                              }}
                            >
                              {cat}
                            </h2>

                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{
                                background:
                                  theme.softPurple,
                                color:
                                  theme.primary,
                              }}
                            >
                              {catContents.length}
                            </span>

                          </div>

                          <p
                            className="text-xs mt-0.5"
                            style={{
                              color:
                                theme.secondaryText,
                            }}
                          >
                            Learning resources
                            in {cat}
                          </p>

                        </div>

                      </div>

                      {catContents.length > 3 && (
                        <button
                          onClick={() =>
                            setSelectedCategory(
                              cat
                            )
                          }
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition hover:opacity-80"
                          style={{
                            color:
                              theme.primary,
                            background:
                              theme.softPurple,
                          }}
                        >
                          View all
                          <ArrowRightIcon />
                        </button>
                      )}

                    </div>

                    {/* COURSE CARDS */}

                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                      {catContents
                        .slice(0, 3)
                        .map(content => (
                          <CourseCard
                            key={content.id}
                            content={content}
                            onClick={() =>
                              openContent(
                                content
                              )
                            }
                          />
                        ))}
                    </div>

                  </section>
                )
              })}

          </div>
        )}

      </div>
    </div>
  )
}

// ============================================================
// COURSE CARD
// ============================================================

function CourseCard({
  content,
  onClick,
}) {
  const typeStyle =
    getTypeStyle(
      content.content_type
    )

  return (
    <div
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: theme.white,
        border:
          `1px solid ${theme.border}`,
      }}
    >

      {/* ======================================================
          THUMBNAIL
      ====================================================== */}

      <div
        className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{
          background:
            `linear-gradient(135deg, ${theme.primary}ee, ${theme.blue}ee)`,
        }}
      >

        {content.thumbnail ? (
          <img
            src={`http://localhost:5000/${content.thumbnail}`}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-center text-white">

            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-2 flex items-center justify-center"
              style={{
                background:
                  'rgba(255,255,255,0.2)',
                backdropFilter:
                  'blur(4px)',
              }}
            >

              {content.content_type ===
              'video_link' ? (
                <VideoIcon
                  size={6}
                  color="white"
                />
              ) : content.content_type ===
                'pdf' ? (
                <PDFIcon
                  size={6}
                  color="white"
                />
              ) : (
                <NoteIcon
                  size={6}
                  color="white"
                />
              )}

            </div>

          </div>
        )}

        {/* TYPE BADGE */}

        <div className="absolute top-3 left-3">

          <span
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{
              background:
                typeStyle.bg,
              color:
                typeStyle.color,
            }}
          >
            {typeStyle.icon}

            {getContentTypeLabel(
              content.content_type
            )}
          </span>

        </div>

        {/* PLAY BUTTON */}

        {content.content_type ===
          'video_link' && (
          <div className="absolute inset-0 flex items-center justify-center">

            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                background:
                  'rgba(255,255,255,0.25)',
                backdropFilter:
                  'blur(5px)',
              }}
            >

              <svg
                className="w-5 h-5 text-white ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>

            </div>

          </div>
        )}

        {/* VIDEO ACCESS */}

        {content.content_type ===
          'video_link' && (
          <div className="absolute top-3 right-3">

            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium text-white"
              style={{
                background:
                  'rgba(0,0,0,0.4)',
                backdropFilter:
                  'blur(4px)',
              }}
            >
              30 days
            </span>

          </div>
        )}

      </div>

      {/* ======================================================
          COURSE INFORMATION
      ====================================================== */}

      <div className="p-5">

        {/* Category */}

        <div className="mb-2">

          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium inline-block"
            style={{
              background:
                theme.softPurple,
              color:
                theme.primary,
            }}
          >
            {content.category}
          </span>

        </div>

        {/* Title */}

        <h3
          className="font-bold text-sm mb-1.5 leading-tight line-clamp-2"
          style={{
            color:
              theme.mainText,
          }}
        >
          {content.title}
        </h3>

        {/* Description */}

        <p
          className="text-xs mb-4 line-clamp-2 leading-5"
          style={{
            color:
              theme.secondaryText,
          }}
        >
          {content.description}
        </p>

        {/* Footer */}

        <div className="flex items-center justify-between">

          <div
            className="flex items-center gap-1.5 min-w-0"
            style={{
              color:
                theme.secondaryText,
            }}
          >

            <UserIcon />

            <span className="text-xs truncate">
              {content.instructor_name}
            </span>

          </div>

          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition group-hover:translate-x-0.5"
            style={{
              background:
                theme.softPurple,
              color:
                theme.primary,
            }}
          >
            <ArrowRightIcon />
          </div>

        </div>

      </div>

    </div>
  )
}