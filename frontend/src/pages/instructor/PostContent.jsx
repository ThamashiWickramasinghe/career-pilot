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

    setSuccess('Content submitted for admin approval! ✅')
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