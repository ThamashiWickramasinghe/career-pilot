import { useState, useEffect } from 'react'
import API from '../../utils/api'

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

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setActiveSection('content')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeSection === 'content' ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
          style={activeSection === 'content' ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
          📚 My Content ({contents.length})
        </button>
        <button onClick={() => setActiveSection('requests')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeSection === 'requests' ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
          style={activeSection === 'requests' ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
          🔄 Re-Access Requests ({reAccessRequests.length})
        </button>
        {activeSection === 'comments' && selectedContent && (
          <button
            className="px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
            💬 Comments — {selectedContent.title}
          </button>
        )}
      </div>

      {/* My Content */}
      {activeSection === 'content' && (
        <div>
          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4 animate-pulse">📚</div>
              <p className="text-gray-500">Loading your content...</p>
            </div>
          ) : contents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No content yet</h3>
              <p className="text-gray-500 text-sm">Go to Post Content to upload your first material</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead style={{background: '#f0fdf4'}}>
                  <tr>
                    {['Content', 'Type', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contents.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                            style={{background: '#d1fae5'}}>
                            {item.content_type === 'video_link' ? '🎥' :
                             item.content_type === 'pdf' ? '📄' : '📝'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{item.title}</p>
                            <p className="text-xs text-gray-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.content_type === 'video_link' ? '🎥 Video' :
                         item.content_type === 'pdf' ? '📄 PDF' : '📝 Notes'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full"
                          style={{background: '#d1fae5', color: '#065f46'}}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          item.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.is_approved ? '✅ Approved' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewComments(item)}
                            className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                            💬 Comments
                          </button>
                          <button
                            onClick={() => startEdit(item)}
                            className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                            style={{background: '#0891b2'}}>
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteContent(item.id)}
                            className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                            style={{background: '#ef4444'}}>
                            🗑️ Delete
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
      )}

      {/* Comments View */}
      {activeSection === 'comments' && selectedContent && (
        <div>
          <button
            onClick={() => setActiveSection('content')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm mb-5">
            ← Back to My Content
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{background: '#d1fae5'}}>
                {selectedContent.content_type === 'video_link' ? '🎥' :
                 selectedContent.content_type === 'pdf' ? '📄' : '📝'}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{selectedContent.title}</h3>
                <p className="text-sm text-gray-500">{selectedContent.category} · {selectedContent.content_type === 'video_link' ? 'Video' : selectedContent.content_type === 'pdf' ? 'PDF' : 'Notes'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-5">
              💬 Student Comments ({comments.length})
            </h3>

            {commentsLoading ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3 animate-pulse">💬</div>
                <p className="text-gray-500">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-gray-500">No comments yet on this content</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
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
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Re-Access Requests */}
      {activeSection === 'requests' && (
        <div>
          {reAccessRequests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No pending requests</h3>
              <p className="text-gray-500 text-sm">All re-access requests have been handled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reAccessRequests.map(req => (
                <div key={req.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                      {req.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{req.user_name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(req.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl mb-3" style={{background: '#f0fdf4'}}>
                    <p className="text-xs text-gray-500 mb-1">Requesting access to:</p>
                    <p className="text-sm font-semibold text-gray-800">📚 {req.content_title}</p>
                  </div>
                  {req.message && (
                    <p className="text-xs text-gray-600 mb-3 italic">"{req.message}"</p>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => respondToRequest(req.id, 'approved')}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                      ✅ Approve
                    </button>
                    <button onClick={() => respondToRequest(req.id, 'denied')}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{background: 'linear-gradient(135deg, #dc2626, #ef4444)'}}>
                      ❌ Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">✏️ Edit Content</h3>
              <button onClick={() => setEditItem(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input type="text" value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  {['Web Development','Mobile Development','Software Engineering','Data Science','Machine Learning & AI','Database & SQL','UI/UX Design','Graphic Design','DevOps & Cloud','Cybersecurity','Networking','Programming Fundamentals','Python','Java','JavaScript','React & Frontend','Node.js & Backend','Flutter & Dart','Project Management','Business Analysis','Quality Assurance','Other'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {editItem.content_type === 'video_link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Drive Link</label>
                  <input type="url" value={editForm.drive_link}
                    onChange={(e) => setEditForm({...editForm, drive_link: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://drive.google.com/file/d/..." />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={saveEdit} disabled={editLoading}
                  className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditItem(null)}
                  className="px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
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
