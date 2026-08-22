import { useState } from 'react'
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

const IconX = (p) => (
  <Icon {...p} path={<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>} />
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

const IconLink = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M9 15l6-6" />
        <path d="M10.5 6.5l1-1a3.5 3.5 0 015 5l-1 1" />
        <path d="M13.5 17.5l-1 1a3.5 3.5 0 01-5-5l1-1" />
      </>
    }
  />
)

const IconUploadCloud = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M7 18a4.5 4.5 0 01-.6-8.96A5.5 5.5 0 0117 8a4 4 0 011 7.87" />
        <path d="M12 12v8" />
        <path d="M9 15l3-3 3 3" />
      </>
    }
  />
)

const IconImage = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="M21 16l-5.5-5.5a2 2 0 00-2.8 0L4 19" />
      </>
    }
  />
)

const IconLoader = (p) => (
  <svg
    width={p.size || 16}
    height={p.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    className="animate-spin flex-shrink-0"
  >
    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
    <path d="M21 12a9 9 0 00-9-9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

/* ============================================================
   FORM DATA
   ============================================================ */

const CATEGORIES = [
  'Web Development', 'Data Science', 'UI/UX Design',
  'DevOps', 'Cybersecurity', 'Mobile Development',
  'Software Engineering', 'Database & SQL', 'Other'
]

const CONTENT_TYPES = [
  { id: 'video_link', label: 'Video', sub: 'Google Drive link', icon: IconVideo, color: '#1769E0', soft: '#E8F1FF' },
  { id: 'pdf', label: 'PDF Document', sub: 'Upload a file', icon: IconFileText, color: '#2FB171', soft: '#E7F8EF' },
  { id: 'note', label: 'Notes', sub: 'Written material', icon: IconNotes, color: '#8067D9', soft: '#F0ECFF' }
]

/* ============================================================
   POST CONTENT
   ============================================================ */

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
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('content_type', form.content_type)
      if (form.drive_link) formData.append('drive_link', form.drive_link)
      if (thumbnail) formData.append('thumbnail', thumbnail)
      if (pdfFile) formData.append('pdf_file', pdfFile)

      const response = await fetch('http://localhost:5000/api/learning/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed')
      }

      setSuccess('Content submitted for admin approval.')
      setForm({
        title: '', description: '', category: 'Web Development',
        content_type: 'video_link', drive_link: ''
      })
      setThumbnail(null)
      setPdfFile(null)
      setThumbnailPreview(null)
      if (onSuccess) onSuccess()

    } catch (err) {
      setError(err.message || 'Upload failed')
    }
    setLoading(false)
  }

  const inputStyle = {
    background: C.softPanel,
    border: `1px solid ${C.border}`,
    color: C.ink,
    '--tw-ring-color': C.accent,
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* ALERTS */}
      {error && (
        <div
          className="mb-5 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5"
          style={{ background: C.redSoft, color: C.red }}
        >
          <IconAlertCircle size={17} color={C.red} />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} style={{ color: C.red }}>
            <IconX size={15} color={C.red} />
          </button>
        </div>
      )}

      {success && (
        <div
          className="mb-5 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5"
          style={{ background: C.greenSoft, color: C.green }}
        >
          <IconCheckCircle size={17} color={C.green} />
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess('')} style={{ color: C.green }}>
            <IconX size={15} color={C.green} />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-6"
        style={{ background: C.card, boxShadow: cardShadow }}
      >
        {/* SECTION: BASIC INFO */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: C.sub }}>
            Basic Information
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>
                Content Title <span style={{ color: C.red }}>*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                style={inputStyle}
                placeholder="e.g. React.js for Beginners"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition resize-none"
                style={inputStyle}
                placeholder="Describe what students will learn..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>
                Category <span style={{ color: C.red }}>*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                style={inputStyle}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION: CONTENT TYPE */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: C.sub }}>
            Content Type
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CONTENT_TYPES.map((t) => {
              const TypeIcon = t.icon
              const active = form.content_type === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm({ ...form, content_type: t.id })}
                  className="flex flex-col items-start gap-2.5 p-3.5 rounded-xl text-left transition"
                  style={{
                    background: active ? t.soft : C.softPanel,
                    border: `1.5px solid ${active ? t.color : C.border}`
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: active ? '#ffffff' : C.card }}
                  >
                    <TypeIcon size={17} color={active ? t.color : C.sub} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: active ? t.color : C.ink }}>
                      {t.label}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: C.sub }}>{t.sub}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* GOOGLE DRIVE LINK — only for video */}
        {form.content_type === 'video_link' && (
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>
              Google Drive Link <span style={{ color: C.red }}>*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconLink size={15} color={C.sub} />
              </div>
              <input
                type="url"
                value={form.drive_link}
                onChange={(e) => setForm({ ...form, drive_link: e.target.value })}
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                style={inputStyle}
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
            <p className="text-[11px] mt-1.5" style={{ color: C.sub }}>
              Make sure link sharing is set to "Anyone with the link"
            </p>
          </div>
        )}

        {/* PDF UPLOAD — only for pdf */}
        {form.content_type === 'pdf' && (
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>
              Upload PDF <span style={{ color: C.red }}>*</span>
            </label>
            <div
              onClick={() => document.getElementById('pdf-upload').click()}
              className="rounded-xl p-6 text-center cursor-pointer transition hover:opacity-90"
              style={{
                background: pdfFile ? C.greenSoft : C.softPanel,
                border: `1.5px dashed ${pdfFile ? C.green : C.border}`
              }}
            >
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="hidden"
              />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5"
                style={{ background: pdfFile ? '#ffffff' : C.card }}
              >
                {pdfFile
                  ? <IconCheckCircle size={20} color={C.green} />
                  : <IconFileText size={20} color={C.sub} />}
              </div>
              {pdfFile ? (
                <p className="text-sm font-medium" style={{ color: C.green }}>{pdfFile.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium" style={{ color: C.ink }}>Click to upload PDF</p>
                  <p className="text-[11px] mt-1" style={{ color: C.sub }}>PDF files only</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* THUMBNAIL UPLOAD */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: C.ink }}>
            Thumbnail Image <span style={{ color: C.sub, fontWeight: 400 }}>(optional)</span>
          </label>
          <div
            onClick={() => document.getElementById('thumb-upload').click()}
            className="rounded-xl p-4 cursor-pointer transition hover:opacity-90"
            style={{
              background: thumbnailPreview ? C.accentSoft : C.softPanel,
              border: `1.5px dashed ${thumbnailPreview ? C.accent : C.border}`
            }}
          >
            <input
              id="thumb-upload"
              type="file"
              accept="image/*"
              onChange={handleThumbnail}
              className="hidden"
            />
            {thumbnailPreview ? (
              <div className="flex items-center gap-4">
                <img
                  src={thumbnailPreview}
                  alt="preview"
                  className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                  style={{ border: `1px solid ${C.border}` }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium flex items-center gap-1.5" style={{ color: C.accentDark }}>
                    <IconCheckCircle size={14} color={C.accentDark} />
                    Thumbnail selected
                  </p>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: C.sub }}>{thumbnail?.name}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.card }}>
                  <IconImage size={19} color={C.sub} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: C.ink }}>Click to upload thumbnail</p>
                  <p className="text-[11px] mt-0.5" style={{ color: C.sub }}>PNG, JPG, JPEG or WEBP</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition disabled:opacity-60 flex items-center justify-center gap-2 hover:shadow-lg"
          style={{ background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})` }}
        >
          {loading ? (
            <>
              <IconLoader size={16} />
              Submitting...
            </>
          ) : (
            <>
              <IconUploadCloud size={16} color="#ffffff" />
              Submit for Admin Approval
            </>
          )}
        </button>
      </form>
    </div>
  )
}
