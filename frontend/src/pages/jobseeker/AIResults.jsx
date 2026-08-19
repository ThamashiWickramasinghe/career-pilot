import { useState, useEffect } from 'react'
import API from '../../utils/api'

export default function AIResults({ quizData, onBack }) {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('careers')
  const [error, setError] = useState('')

  useEffect(() => {
    if (quizData) fetchAnalysis()
  }, [quizData])

  const fetchAnalysis = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/ai/full-analysis', {
        category_scores: quizData.categoryScores,
        attempt_id: quizData.attemptId
      })
      setResults(res.data)
    } catch (err) {
      setError('Failed to load AI analysis. Please try again.')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-7xl mb-6 animate-pulse">🤖</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">AI is analyzing your results...</h3>
        <p className="text-gray-500 text-sm mb-6">Predicting careers · Analyzing skill gaps · Finding courses & jobs</p>
        <div className="flex gap-2">
          {['🎯 Career Prediction', '📊 Skill Gap', '📚 Courses', '💼 Jobs'].map((step, i) => (
            <div key={i} className="px-3 py-1.5 rounded-full text-xs font-medium text-white animate-pulse"
              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)', animationDelay: `${i * 0.3}s`}}>
              {step}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Analysis Failed</h3>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button onClick={fetchAnalysis}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
          style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
          Try Again
        </button>
      </div>
    )
  }

  if (!results) return null

  const { predictions, top_career, skill_gap, recommended_courses, recommended_jobs } = results

  return (
    <div className="max-w-5xl mx-auto">

      {/* Back button */}
      <button onClick={onBack}
        className="flex items-center gap-2 text-teal-600 font-medium text-sm mb-5">
        ← Back to Job Portal
      </button>

      {/* Hero Banner */}
      <div className="rounded-2xl p-8 mb-6 text-white relative overflow-hidden"
        style={{background: 'linear-gradient(135deg, #0f4c35 0%, #1a7a5e 40%, #10b981 80%, #06b6d4 100%)'}}>
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full opacity-10"
          style={{background: 'radial-gradient(circle, #ffffff, transparent)'}}></div>
        <div className="relative z-10">
          <p className="text-green-200 text-sm mb-1">🤖 AI Career Analysis Complete</p>
          <h1 className="text-3xl font-bold mb-2">
            Your Best Career Match: {top_career}
          </h1>
          <p className="text-green-100 text-sm">
            Based on your quiz performance across 14 IT categories
          </p>
          <div className="flex gap-4 mt-5">
            <div className="text-center">
              <p className="text-2xl font-bold">{predictions?.length || 0}</p>
              <p className="text-green-200 text-xs">Career Paths</p>
            </div>
            <div className="w-px bg-white bg-opacity-30"></div>
            <div className="text-center">
              <p className="text-2xl font-bold">{skill_gap?.overall_readiness || 0}%</p>
              <p className="text-green-200 text-xs">Career Readiness</p>
            </div>
            <div className="w-px bg-white bg-opacity-30"></div>
            <div className="text-center">
              <p className="text-2xl font-bold">{recommended_courses?.length || 0}</p>
              <p className="text-green-200 text-xs">Courses Found</p>
            </div>
            <div className="w-px bg-white bg-opacity-30"></div>
            <div className="text-center">
              <p className="text-2xl font-bold">{recommended_jobs?.length || 0}</p>
              <p className="text-green-200 text-xs">Jobs Matched</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'careers', label: '🎯 Career Predictions', count: predictions?.length },
          { id: 'skills', label: '📊 Skill Gap Analysis' },
          { id: 'courses', label: '📚 Recommended Courses', count: recommended_courses?.length },
          { id: 'jobs', label: '💼 Matched Jobs', count: recommended_jobs?.length },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === tab.id ? 'text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-400'
            }`}
            style={activeTab === tab.id ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white bg-opacity-30' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── CAREER PREDICTIONS ── */}
      {activeTab === 'careers' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🎯 Your Top 3 Predicted Career Paths
          </h2>
          {predictions?.map((pred, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                    style={{
                      background: i === 0
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : i === 1
                        ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                        : 'linear-gradient(135deg, #b45309, #92400e)'
                    }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-800">{pred.career}</h3>
                      {i === 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                          Best Match
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Rank #{pred.rank} · AI Confidence Score</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold"
                    style={{color: pred.confidence >= 70 ? '#10b981' : pred.confidence >= 40 ? '#f59e0b' : '#6b7280'}}>
                    {pred.confidence.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400">Confidence</p>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="h-2.5 rounded-full transition-all"
                  style={{
                    width: `${pred.confidence}%`,
                    background: i === 0
                      ? 'linear-gradient(90deg, #0f4c35, #10b981)'
                      : i === 1
                      ? 'linear-gradient(90deg, #374151, #6b7280)'
                      : 'linear-gradient(90deg, #92400e, #b45309)'
                  }}>
                </div>
              </div>

              {i === 0 && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setActiveTab('skills')}
                    className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                    style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                    📊 View Skill Gap
                  </button>
                  <button onClick={() => setActiveTab('courses')}
                    className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                    style={{background: '#0891b2'}}>
                    📚 Recommended Courses
                  </button>
                  <button onClick={() => setActiveTab('jobs')}
                    className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                    style={{background: '#7c3aed'}}>
                    💼 Matched Jobs
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── SKILL GAP ANALYSIS ── */}
      {activeTab === 'skills' && skill_gap && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-800">
              📊 Skill Gap Analysis for <span style={{color: '#10b981'}}>{top_career}</span>
            </h2>
          </div>

          {/* Readiness Gauge */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none"
                    stroke={skill_gap.overall_readiness >= 70 ? '#10b981' : skill_gap.overall_readiness >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${(skill_gap.overall_readiness / 100) * 94} 94`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-gray-800">{skill_gap.overall_readiness}%</span>
                  <span className="text-xs text-gray-400">Ready</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-1">Overall Career Readiness</h3>
                <p className="text-gray-500 text-sm mb-3">
                  {skill_gap.overall_readiness >= 70
                    ? '🌟 You are highly ready for this career path!'
                    : skill_gap.overall_readiness >= 40
                    ? '📈 You have good foundations. Focus on the skill gaps below.'
                    : '📚 You need significant skill development for this career.'}
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                    <span className="text-gray-600">Strengths: {skill_gap.strengths?.length || 0}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                    <span className="text-gray-600">Weak: {skill_gap.weaknesses?.length || 0}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                    <span className="text-gray-600">Missing: {skill_gap.missing_skills?.length || 0}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {skill_gap.strengths?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
              <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                ✅ Strengths ({skill_gap.strengths.length})
              </h3>
              <div className="space-y-3">
                {skill_gap.strengths.map((item, i) => (
                  <SkillBar key={i} item={item} color="#10b981" bgColor="#d1fae5" />
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {skill_gap.weaknesses?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
              <h3 className="font-bold text-yellow-700 mb-4 flex items-center gap-2">
                ⚠️ Needs Improvement ({skill_gap.weaknesses.length})
              </h3>
              <div className="space-y-3">
                {skill_gap.weaknesses.map((item, i) => (
                  <SkillBar key={i} item={item} color="#f59e0b" bgColor="#fef3c7" />
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {skill_gap.missing_skills?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
              <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                ❌ Missing Skills ({skill_gap.missing_skills.length})
              </h3>
              <div className="space-y-3">
                {skill_gap.missing_skills.map((item, i) => (
                  <SkillBar key={i} item={item} color="#ef4444" bgColor="#fee2e2" />
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setActiveTab('courses')}
            className="w-full py-3 rounded-xl font-bold text-white mt-2"
            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
            📚 View Recommended Courses to Fill Gaps →
          </button>
        </div>
      )}

      {/* ── RECOMMENDED COURSES ── */}
      {activeTab === 'courses' && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            📚 Personalized Course Recommendations
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Selected using TF-IDF + Cosine Similarity based on your skill gaps
          </p>

          {recommended_courses?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="font-bold text-gray-800 mb-2">No courses available yet</h3>
              <p className="text-gray-500 text-sm">
                Instructors haven't uploaded relevant courses yet. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommended_courses.map((course, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{background: '#d1fae5'}}>
                      {course.content_type === 'video_link' ? '🎥' :
                       course.content_type === 'pdf' ? '📄' : '📝'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-gray-800 text-sm">{course.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium ml-2 flex-shrink-0">
                          {course.relevance_score}% match
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{course.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">👨‍🏫 {course.instructor_name}</span>
                    {course.drive_link && (
                      <a href={course.drive_link} target="_blank" rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                        style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                        ▶ Access Course
                      </a>
                    )}
                  </div>

                  {/* Relevance bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-100 rounded-full h-1">
                      <div className="h-1 rounded-full"
                        style={{
                          width: `${course.relevance_score}%`,
                          background: 'linear-gradient(90deg, #0f4c35, #10b981)'
                        }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MATCHED JOBS ── */}
      {activeTab === 'jobs' && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            💼 AI-Matched Job Recommendations
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Ranked using Sentence Transformer + Cosine Similarity based on your career profile
          </p>

          {recommended_jobs?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="font-bold text-gray-800 mb-2">No matching jobs yet</h3>
              <p className="text-gray-500 text-sm">
                No active job posts match your profile yet. Check back later!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommended_jobs.map((job, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                        style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                        {job.company_name?.charAt(0).toUpperCase()}
                      </div>
                      {i < 3 && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : '#b45309'}}>
                          {i + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800">{job.title}</h3>
                            {i === 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                                🏆 Best Match
                              </span>
                            )}
                          </div>
                          <p className="text-teal-600 text-sm font-medium">{job.company_name}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold"
                            style={{color: job.match_score >= 70 ? '#10b981' : job.match_score >= 40 ? '#f59e0b' : '#6b7280'}}>
                            {job.match_score}%
                          </p>
                          <p className="text-xs text-gray-400">AI Match</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">{job.job_type}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">📍 {job.location}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">📁 {job.category}</span>
                        {job.salary_range && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">💰 {job.salary_range}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.required_skills?.split(',').slice(0, 4).map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                            style={{background: '#d1fae5', color: '#065f46'}}>
                            {s.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Match bar */}
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                        <div className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${job.match_score}%`,
                            background: job.match_score >= 70
                              ? 'linear-gradient(90deg, #0f4c35, #10b981)'
                              : job.match_score >= 40
                              ? 'linear-gradient(90deg, #d97706, #f59e0b)'
                              : 'linear-gradient(90deg, #6b7280, #9ca3af)'
                          }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Skill Bar Component ──
function SkillBar({ item, color, bgColor }) {
  return (
    <div className="p-3 rounded-xl border border-gray-100" style={{background: bgColor + '40'}}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-800">{item.category_name}</p>
          <p className="text-xs text-gray-500">
            Your score: {item.your_score}/100 · Required: {item.required_score}/100
          </p>
        </div>
        <span className="text-sm font-bold flex-shrink-0" style={{color}}>
          {item.percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full transition-all"
          style={{
            width: `${Math.min(item.percentage, 100)}%`,
            background: color
          }}></div>
      </div>
      {item.gap > 0 && (
        <p className="text-xs mt-1" style={{color}}>
          Gap: {item.gap} marks needed
        </p>
      )}
    </div>
  )
}