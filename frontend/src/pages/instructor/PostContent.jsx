import { useState } from 'react'
import API from '../../utils/api'

const CATEGORIES = [
  'Web Development', 'Data Science', 'UI/UX Design',
  'DevOps', 'Cybersecurity', 'Mobile Development'
]

export default function PostContent({ onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    content_type: 'video_link',
    drive_link: '',
  })
  const [thumbnail, setThumbnail] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.content_type === 'video_link' && !form.drive_link) {
      setError('Google Drive link is required for video content')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('content_type', form.content_type)
      formData.append('drive_link', form.drive_link)
      if (thumbnail) formData.append('thumbnail', thumbnail)
      if (pdfFile) formData.append('pdf_file', pdfFile)

      await API.post('/learning/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccess('Content submitted for admin approval!')
      setForm({
        title: '', description: '', category: 'Web Development',
        content_type: 'video_link', drive_link: ''
      })
      setThumbnail(null)
      setPdfFile(null)
      setThumbnailPreview(null)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-5 text-sm flex items-center gap-2">
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Content Title *</label>
          <input type="text" required value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            placeholder="e.g. React.js for Beginners" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea rows={3} value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            placeholder="Describe what students will learn..." />
        </div>

        {/* Category + Content Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content Type *</label>
            <select value={form.content_type}
              onChange={(e) => setForm({...form, content_type: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
              <option value="video_link">🎥 Video (Google Drive)</option>
              <option value="pdf">📄 PDF Document</option>
              <option value="note">📝 Notes</option>
            </select>
          </div>
        </div>

        {/* Google Drive Link — only for video */}
        {form.content_type === 'video_link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Google Drive Link *
            </label>
            <input type="url" value={form.drive_link}
              onChange={(e) => setForm({...form, drive_link: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              placeholder="https://drive.google.com/file/d/..." />
            <p className="text-xs text-gray-400 mt-1">
              Share your Google Drive video link — make sure sharing is set to "Anyone with the link"
            </p>
          </div>
        )}

        {/* PDF Upload — only for pdf */}
        {form.content_type === 'pdf' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Upload PDF *
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-teal-400 transition cursor-pointer"
              style={{background: '#f0fdf4'}}
              onClick={() => document.getElementById('pdf-upload').click()}>
              <input id="pdf-upload" type="file" accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="hidden" />
              <div className="text-4xl mb-2">📄</div>
              {pdfFile ? (
                <p className="text-sm font-medium text-teal-700">✅ {pdfFile.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-600">Click to upload PDF</p>
                  <p className="text-xs text-gray-400 mt-1">PDF files only</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Thumbnail Image (optional)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-teal-400 transition cursor-pointer"
            style={{background: '#f0fdf4'}}
            onClick={() => document.getElementById('thumb-upload').click()}>
            <input id="thumb-upload" type="file" accept="image/*"
              onChange={handleThumbnail}
              className="hidden" />
            {thumbnailPreview ? (
              <div className="flex items-center gap-4">
                <img src={thumbnailPreview} alt="preview"
                  className="w-20 h-14 object-cover rounded-lg" />
                <div>
                  <p className="text-sm font-medium text-teal-700">✅ Thumbnail selected</p>
                  <p className="text-xs text-gray-400">{thumbnail?.name}</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-3xl mb-2">🖼️</div>
                <p className="text-sm font-medium text-gray-600">Click to upload thumbnail</p>
                <p className="text-xs text-gray-400">PNG, JPG, JPEG, WEBP</p>
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
          style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
          {loading ? 'Submitting...' : 'Submit for Admin Approval →'}
        </button>
      </form>
    </div>
  )
}