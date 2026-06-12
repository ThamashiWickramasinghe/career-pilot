import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'UI/UX Design', 'DevOps', 'Cybersecurity', 'Mobile Development']

export default function LearningHub() {
  const { user } = useAuth()
  const [contents, setContents] = useState([])
  const [filteredContents, setFilteredContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [contentType, setContentType] = useState('All')
  const [selectedContent, setSelectedContent] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [hasAccess, setHasAccess] = useState(true)
  const [accessInfo, setAccessInfo] = useState(null)
  const [reAccessMsg, setReAccessMsg] = useState('')
  const [showReAccess, setShowReAccess] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchContent()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [contents, selectedCategory, searchQuery, contentType])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await API.get('/learning/content')
      setContents(res.data.content)
    } catch (err) {
      setError('Failed to load content')
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...contents]

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }

    // Content type filter
    if (contentType !== 'All') {
      filtered = filtered.filter(c => {
        if (contentType === 'Video') return c.content_type === 'video_link'
        if (contentType === 'PDF') return c.content_type === 'pdf'
        if (contentType === 'Notes') return c.content_type === 'note'
        return true
      })
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        c.instructor_name?.toLowerCase().includes(query) ||
        c.category?.toLowerCase().includes(query)
      )
    }

    setFilteredContents(filtered)
  }

  const openContent = async (content) => {
    try {
      const res = await API.get(`/learning/content/${content.id}`)
      setSelectedContent(res.data.content)
      setComments(res.data.comments)
      setHasAccess(res.data.has_access)
      setAccessInfo(res.data.access_info)
    } catch (err) {
      setError('Failed to load content details')
    }
  }

  const submitComment = async () => {
    if (!newComment.trim()) return
    try {
      const res = await API.post(`/learning/content/${selectedContent.id}/comment`, {
        comment: newComment
      })
      setComments([res.data.comment, ...comments])
      setNewComment('')
    } catch (err) {
      setError('Failed to add comment')
    }
  }

  const requestReAccess = async () => {
    try {
      await API.post('/learning/reaccess', {
        content_id: selectedContent.id,
        message: reAccessMsg
      })
      setSuccess('Re-access request sent to instructor!')
      setShowReAccess(false)
      setReAccessMsg('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request')
    }
  }

  const getDaysRemaining = (expiresAt) => {
    if (!expiresAt) return 0
    const diff = new Date(expiresAt) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setContentType('All')
  }

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || contentType !== 'All'

  // ── CONTENT DETAIL VIEW ──
  if (selectedContent) {
    const daysLeft = accessInfo ? getDaysRemaining(accessInfo.expires_at) : 0

    return (
      <div className="min-h-screen" style={{background: '#f0fdf4'}}>
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shadow-sm">
          <button onClick={() => setSelectedContent(null)}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm">
            ← Back to Learning Hub
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-sm">
              {success}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="relative w-full h-64 flex items-center justify-center"
              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
              {selectedContent.thumbnail ? (
                <img src={`http://localhost:5000/${selectedContent.thumbnail}`}
                  alt={selectedContent.title}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="text-7xl mb-3">
                    {selectedContent.content_type === 'video_link' ? '🎥' :
                     selectedContent.content_type === 'pdf' ? '📄' : '📝'}
                  </div>
                  <p className="text-white font-medium">{selectedContent.title}</p>
                </div>
              )}
              {selectedContent.content_type === 'video_link' && (
                <div className="absolute top-4 right-4">
                  {hasAccess ? (
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      ✅ {daysLeft} days left
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      ❌ Access Expired
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedContent.title}</h1>
                  <p className="text-gray-500 text-sm">{selectedContent.description}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-medium flex-shrink-0"
                  style={{background: '#d1fae5', color: '#065f46'}}>
                  {selectedContent.category}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>👨‍🏫 {selectedContent.instructor_name}</span>
                <span>📅 {new Date(selectedContent.created_at).toLocaleDateString()}</span>
                <span>
                  {selectedContent.content_type === 'video_link' ? '🎥 Video' :
                   selectedContent.content_type === 'pdf' ? '📄 PDF' : '📝 Notes'}
                </span>
              </div>

              {hasAccess ? (
                <div>
                  {selectedContent.content_type === 'video_link' && selectedContent.drive_link && (
                    <div className="p-4 rounded-xl border-2 border-teal-200 mb-4"
                      style={{background: '#f0fdf4'}}>
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        🎥 Click below to watch on Google Drive
                      </p>
                      <a href={selectedContent.drive_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
                        style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                        ▶ Watch Video on Google Drive
                      </a>
                      {accessInfo && (
                        <p className="text-xs text-gray-500 mt-2">
                          Access expires: {new Date(accessInfo.expires_at).toLocaleDateString()}
                          ({daysLeft} days remaining)
                        </p>
                      )}
                    </div>
                  )}
                  {selectedContent.content_type === 'pdf' && selectedContent.file_path && (
                    <div className="p-4 rounded-xl border-2 border-teal-200 mb-4"
                      style={{background: '#f0fdf4'}}>
                      <p className="text-sm font-medium text-gray-700 mb-3">📄 PDF Document</p>
                      <a href={`http://localhost:5000/${selectedContent.file_path}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
                        style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                        📖 Open PDF
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 mb-4">
                  <p className="text-sm font-medium text-red-700 mb-3">
                    ❌ Your 30-day access has expired
                  </p>
                  {!showReAccess ? (
                    <button onClick={() => setShowReAccess(true)}
                      className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
                      style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                      🔄 Request Re-Access
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={reAccessMsg}
                        onChange={(e) => setReAccessMsg(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Why do you need re-access? (optional)" />
                      <div className="flex gap-2">
                        <button onClick={requestReAccess}
                          className="px-5 py-2 rounded-xl text-white font-semibold text-sm"
                          style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                          Send Request
                        </button>
                        <button onClick={() => setShowReAccess(false)}
                          className="px-5 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5">
              💬 Comments ({comments.length})
            </h2>
            <div className="flex gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Write a comment..." />
                <button onClick={submitComment}
                  className="mt-2 px-5 py-2 rounded-xl text-white font-semibold text-sm"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  Post Comment
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                      {c.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800">{c.user_name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{c.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── MAIN LIST VIEW ──
  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Search + Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">

        {/* Search Input */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            placeholder="Search by title, description, instructor or category..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
              ✕
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Content Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Type:</span>
            <div className="flex gap-1.5">
              {['All', 'Video', 'PDF', 'Notes'].map(type => (
                <button key={type}
                  onClick={() => setContentType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    contentType === type ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={contentType === type ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
                  {type === 'Video' ? '🎥' : type === 'PDF' ? '📄' : type === 'Notes' ? '📝' : ''} {type}
                </button>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-3">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={selectedCategory === cat ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? 'Loading...' : `${filteredContents.length} result${filteredContents.length !== 1 ? 's' : ''} found`}
          {hasActiveFilters && (
            <span className="ml-2 text-teal-600 font-medium">
              (filtered)
            </span>
          )}
        </p>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {selectedCategory !== 'All' && (
              <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">
                📁 {selectedCategory}
              </span>
            )}
            {contentType !== 'All' && (
              <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">
                {contentType === 'Video' ? '🎥' : contentType === 'PDF' ? '📄' : '📝'} {contentType}
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">
                🔍 "{searchQuery}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 animate-pulse">📚</div>
          <p className="text-gray-500">Loading content...</p>
        </div>
      ) : filteredContents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">
            {hasActiveFilters ? '🔍' : '📭'}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {hasActiveFilters ? 'No results found' : 'No content yet'}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {hasActiveFilters
              ? 'Try changing your search or filters'
              : 'Check back later for new learning materials'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContents.map(content => (
            <div key={content.id}
              onClick={() => openContent(content)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition hover:-translate-y-0.5">

              {/* Thumbnail */}
              <div className="relative h-44 flex items-center justify-center"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                {content.thumbnail ? (
                  <img src={`http://localhost:5000/${content.thumbnail}`}
                    alt={content.title}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl">
                    {content.content_type === 'video_link' ? '🎥' :
                     content.content_type === 'pdf' ? '📄' : '📝'}
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-white bg-opacity-90 text-teal-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    {content.content_type === 'video_link' ? '🎥 Video' :
                     content.content_type === 'pdf' ? '📄 PDF' : '📝 Notes'}
                  </span>
                </div>
                {content.content_type === 'video_link' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-2 border-white border-opacity-50">
                      <span className="text-white text-2xl ml-1">▶</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight">{content.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{background: '#d1fae5', color: '#065f46'}}>
                    {content.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{content.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">👨‍🏫 {content.instructor_name}</span>
                  {content.content_type === 'video_link' && (
                    <span className="text-xs text-teal-600 font-medium">30 days access</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}