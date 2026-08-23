import { useState, useEffect } from 'react'
import API from '../../utils/api'

// PASTEL PURPLE THEME — primary soft color: #DBBCD4

export default function AIResults({ quizData, onBack }) {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('careers')
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (quizData) {
      fetchAnalysis()
    }
  }, [quizData])

  // ============================================================
  // BACKEND CODE - UNCHANGED
  // ============================================================
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

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#F8F3F7' }}
      >
        <div
          className="w-full max-w-md rounded-3xl p-10 text-center"
          style={{
            background: '#ffffff',
            border: '1px solid #E5D8E4',
            boxShadow: '0 10px 35px rgba(155,127,160,0.10)'
          }}
        >
          <div className="relative mx-auto mb-6 w-20 h-20">

            <div
              className="w-20 h-20 rounded-full border-4 animate-spin"
              style={{
                borderColor: '#DBBCD4',
                borderTopColor: '#9B7FA0'
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8"
                style={{ color: '#9B7FA0' }}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>

          </div>

          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: '#9B7FA0' }}
          >
            AI Career Analysis
          </p>

          <h3
            className="text-xl font-bold mb-2"
            style={{ color: '#2E2730' }}
          >
            Analyzing your results
          </h3>

          <p
            className="text-sm mb-6"
            style={{ color: '#857A87' }}
          >
            Our AI is working to predict your career path
          </p>

          <div className="space-y-2">

            {[
              'Predicting career paths',
              'Analyzing skill gaps',
              'Finding courses',
              'Matching jobs'
            ].map((step, i) => (

              <div
                key={i}
                className="flex items-center gap-3 text-sm rounded-xl p-3"
                style={{
                  background: '#F5EFF5',
                  color: '#857A87'
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 animate-spin flex-shrink-0"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    borderColor: '#DBBCD4',
                    borderTopColor: '#9B7FA0'
                  }}
                />

                {step}
              </div>

            ))}

          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // ERROR
  // ============================================================
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#F8F3F7' }}
      >
        <div
          className="rounded-3xl p-10 text-center max-w-md w-full"
          style={{
            background: '#ffffff',
            border: '1px solid #E5D8E4',
            boxShadow: '0 10px 35px rgba(155,127,160,0.10)'
          }}
        >

          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: '#F7EBDD'
            }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: '#B88655' }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          <h3
            className="text-xl font-bold mb-2"
            style={{ color: '#2E2730' }}
          >
            Analysis Failed
          </h3>

          <p
            className="text-sm mb-6"
            style={{ color: '#857A87' }}
          >
            {error}
          </p>

          <button
            onClick={fetchAnalysis}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: '#9B7FA0'
            }}
          >
            Try Again
          </button>

        </div>
      </div>
    )
  }

  if (!results) return null

  const {
    predictions,
    top_career,
    skill_gap,
    recommended_courses,
    recommended_jobs
  } = results

  const tabs = [
    {
      id: 'careers',
      label: 'Career Paths',
      count: predictions?.length || 0
    },
    {
      id: 'skills',
      label: 'Skill Gap'
    },
    {
      id: 'courses',
      label: 'Courses',
      count: recommended_courses?.length || 0
    },
    {
      id: 'jobs',
      label: 'Matched Jobs',
      count: recommended_jobs?.length || 0
    }
  ]

  const filteredPredictions =
    predictions?.filter(pred =>
      pred.career
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || []

  const filteredCourses =
    recommended_courses?.filter(course =>
      `${course.title} ${course.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || []

  const filteredJobs =
    recommended_jobs?.filter(job =>
      `${job.title} ${job.company_name} ${job.location}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) || []

  // Derived stats for the prediction summary card (frontend-only, no backend changes)
  const topConfidence = Math.round(
    Number(predictions?.[0]?.confidence || 0)
  )

  const categoriesAnalyzed = Object.keys(
    quizData?.categoryScores || {}
  ).length

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#F8F3F7'
      }}
    >

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">

        {/* ======================================================
            SMALL BACK BUTTON
        ======================================================= */}
        <div className="mb-3">



        </div>


        {/* ======================================================
            PROFESSIONAL PREDICTION RESULT CARD
        ======================================================= */}
        <div
          className="relative overflow-hidden rounded-2xl mb-5"
          style={{
            background: '#ffffff',
            border: '1px solid #E5D8E4',
            boxShadow: '0 8px 28px rgba(155,127,160,0.10)'
          }}
        >

          {/* Gradient header strip */}
          <div
            className="h-1.5 w-full"
            style={{
              background:
                'linear-gradient(90deg, #9B7FA0 0%, #7D89B8 55%, #B88655 100%)'
            }}
          />

          <div className="p-6 md:p-7">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

              {/* Left: identity */}
              <div className="flex items-start gap-4 flex-1 min-w-0">

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      'linear-gradient(135deg, #9B7FA0 0%, #7D89B8 100%)',
                    boxShadow: '0 6px 16px rgba(155,127,160,0.30)'
                  }}
                >
                  <svg
                    className="w-7 h-7"
                    style={{ color: '#ffffff' }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">

                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        background: '#DBBCD4',
                        color: '#9B7FA0'
                      }}
                    >
                      AI Career Match
                    </span>

                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: '#E3F1E9',
                        color: '#6E9B86'
                      }}
                    >
                      Top Recommendation
                    </span>

                  </div>

                  <h1
                    className="text-2xl md:text-3xl font-bold truncate"
                    style={{
                      color: '#2E2730'
                    }}
                  >
                    {top_career}
                  </h1>

                  

                </div>

              </div>


              {/* Right: confidence gauge */}
              

              

            </div>


            {/* Bottom stat strip */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6"
              style={{
                borderTop: '1px solid #E5D8E4'
              }}
            >

              <StatPill
                label="Career Paths"
                value={predictions?.length || 0}
              />

              <StatPill
                label="Overall Readiness"
                value={
                  skill_gap?.overall_readiness !== undefined
                    ? `${skill_gap.overall_readiness}%`
                    : '—'
                }
              />

              <StatPill
                label="Courses Found"
                value={recommended_courses?.length || 0}
              />

              <StatPill
                label="Jobs Matched"
                value={recommended_jobs?.length || 0}
              />

            </div>

          </div>

        </div>


        {/* ======================================================
            TABS
        ======================================================= */}
        <div
          className="rounded-2xl p-1.5 mb-5 flex gap-1 overflow-x-auto"
          style={{
            background: '#ffffff',
            border: '1px solid #E5D8E4'
          }}
        >

          {tabs.map(tab => (

            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSearchTerm('')
              }}
              className="flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
              style={
                activeTab === tab.id
                  ? {
                      background: '#9B7FA0',
                      color: '#ffffff'
                    }
                  : {
                      background: 'transparent',
                      color: '#857A87'
                    }
              }
            >

              {tab.label}

              {tab.count !== undefined && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[9px]"
                  style={{
                    background:
                      activeTab === tab.id
                        ? 'rgba(255,255,255,0.18)'
                        : '#F5EFF5',
                    color:
                      activeTab === tab.id
                        ? '#ffffff'
                        : '#857A87'
                  }}
                >
                  {tab.count}
                </span>
              )}

            </button>

          ))}

        </div>


        {/* ======================================================
            CAREER PATHS
        ======================================================= */}
        {activeTab === 'careers' && (
          <CareerPaths
            predictions={filteredPredictions}
          />
        )}


        {/* ======================================================
            SKILL GAP
        ======================================================= */}
        {activeTab === 'skills' && skill_gap && (
          <SkillGap
            skill_gap={skill_gap}
            top_career={top_career}
            setActiveTab={setActiveTab}
          />
        )}


        {/* ======================================================
            COURSES
        ======================================================= */}
        {activeTab === 'courses' && (
          <Courses
            courses={filteredCourses}
          />
        )}


        {/* ======================================================
            JOBS
        ======================================================= */}
        {activeTab === 'jobs' && (
          <Jobs
            jobs={filteredJobs}
          />
        )}

      </div>
    </div>
  )
}




// ==================================================================
// STAT PILL (new — used in the prediction summary card)
// ==================================================================
function StatPill({ label, value }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: '#F5EFF5'
      }}
    >
      <p
        className="text-lg font-bold leading-none"
        style={{ color: '#2E2730' }}
      >
        {value}
      </p>
      <p
        className="text-[10px] mt-1.5 uppercase tracking-wide font-semibold"
        style={{ color: '#857A87' }}
      >
        {label}
      </p>
    </div>
  )
}


// ==================================================================
// RESULT INFO
// ==================================================================
function ResultInfo({
  label,
  value
}) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: '#F5EFF5'
      }}
    >

      <p
        className="text-[10px] mb-1"
        style={{
          color: '#857A87'
        }}
      >
        {label}
      </p>

      <p
        className="text-xs font-bold truncate"
        style={{
          color: '#2E2730'
        }}
      >
        {value}
      </p>

    </div>
  )
}


// ==================================================================
// CAREER PATHS — UNCHANGED
// ==================================================================
function CareerPaths({
  predictions
}) {

  const chartData =
    predictions?.slice(0, 3) || []

  const chartColors = [
    '#9B7FA0',
    '#7D89B8',
    '#B88655'
  ]

  const total = chartData.reduce(
    (sum, item) =>
      sum + Number(item.confidence || 0),
    0
  )

  let currentAngle = 180

  const slices = chartData.map(
    (item, index) => {

      const value =
        Number(item.confidence || 0)

      const angle =
        total > 0
          ? (value / total) * 180
          : 60

      const startAngle =
        currentAngle

      const endAngle =
        currentAngle + angle

      currentAngle =
        endAngle

      return {
        ...item,
        color: chartColors[index],
        startAngle,
        endAngle
      }
    }
  )

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#ffffff',
        border: '1px solid #E5D8E4',
        boxShadow:
          '0 3px 15px rgba(155,127,160,0.06)'
      }}
    >

      {/* Header */}
      <div className="p-5">

        <div className="flex items-center justify-between">

          <div>

            <h2
              className="text-lg font-bold"
              style={{
                color: '#2E2730'
              }}
            >
              Career Paths
            </h2>

            <p
              className="text-xs mt-1"
              style={{
                color: '#857A87'
              }}
            >
              Your strongest predicted career directions
            </p>

          </div>

          <span
            className="text-[10px] px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: '#DBBCD4',
              color: '#9B7FA0'
            }}
          >
            AI Prediction
          </span>

        </div>

      </div>


      {/* Half Pie */}
      <div className="px-5 pb-6">

        <div className="flex flex-col md:flex-row items-center gap-7">

          <div className="w-full md:w-1/2">

            <HalfPieChart
              slices={slices}
            />

          </div>


          {/* Career legend */}
          <div className="w-full md:w-1/2 space-y-3">

            {slices.map(
              (item, index) => (

                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background:
                      index === 0
                        ? '#F5EFF5'
                        : '#fafafa',

                    border:
                      index === 0
                        ? '1px solid #DBBCD4'
                        : '1px solid #EEE5ED'
                  }}
                >

                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      background:
                        item.color
                    }}
                  />

                  <div className="flex-1">

                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: '#2E2730'
                      }}
                    >
                      {item.career}
                    </p>

                    <p
                      className="text-[10px] mt-0.5"
                      style={{
                        color: '#857A87'
                      }}
                    >
                      {index === 0
                        ? 'Primary recommendation'
                        : 'Alternative career path'}
                    </p>

                  </div>

                  {index === 0 && (
                    <span
                      className="text-[9px] px-2 py-1 rounded-full font-semibold"
                      style={{
                        background:
                          '#DBBCD4',
                        color:
                          '#9B7FA0'
                      }}
                    >
                      Best Match
                    </span>
                  )}

                </div>

              )
            )}

          </div>

        </div>

      </div>


      {/* Career list */}
      <div
        className="border-t"
        style={{
          borderColor: '#E5D8E4'
        }}
      >

        <div
          className="hidden md:grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-wide font-semibold"
          style={{
            background: '#F5EFF5',
            color: '#857A87'
          }}
        >

          <div className="col-span-1">
            #
          </div>

          <div className="col-span-8">
            Career Path
          </div>

          <div className="col-span-3 text-right">
            Recommendation
          </div>

        </div>


        {predictions?.map(
          (pred, i) => (

            <div
              key={i}
              className="px-5 py-4 border-t"
              style={{
                borderColor:
                  '#E5D8E4'
              }}
            >

              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">

                <div className="md:col-span-1">

                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      background:
                        i === 0
                          ? '#DBBCD4'
                          : '#F5EFF5',

                      color:
                        i === 0
                          ? '#9B7FA0'
                          : '#857A87'
                    }}
                  >
                    {i + 1}
                  </div>

                </div>


                <div className="md:col-span-8">

                  <p
                    className="text-sm font-bold"
                    style={{
                      color: '#2E2730'
                    }}
                  >
                    {pred.career}
                  </p>

                  <p
                    className="text-[10px] mt-0.5"
                    style={{
                      color: '#857A87'
                    }}
                  >
                    AI recommended career path
                  </p>

                </div>


                <div className="md:col-span-3 md:text-right">

                  <span
                    className="inline-flex text-[10px] px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background:
                        i === 0
                          ? '#DBBCD4'
                          : '#F5EFF5',

                      color:
                        i === 0
                          ? '#9B7FA0'
                          : '#857A87'
                    }}
                  >
                    {i === 0
                      ? 'Best Match'
                      : 'Recommended'}
                  </span>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  )
}


// ==================================================================
// HALF PIE CHART — UNCHANGED
// ==================================================================
function HalfPieChart({
  slices
}) {

  const polarToCartesian = (
    cx,
    cy,
    radius,
    angle
  ) => {

    const angleInRadians =
      ((angle - 90) * Math.PI) / 180

    return {
      x:
        cx +
        radius *
          Math.cos(angleInRadians),

      y:
        cy +
        radius *
          Math.sin(angleInRadians)
    }
  }


  const createArc = (
    startAngle,
    endAngle,
    radius
  ) => {

    const start =
      polarToCartesian(
        100,
        100,
        radius,
        startAngle
      )

    const end =
      polarToCartesian(
        100,
        100,
        radius,
        endAngle
      )

    const largeArcFlag =
      endAngle - startAngle <= 180
        ? 0
        : 1

    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
    ].join(' ')
  }


  return (
    <div className="relative">

      <svg
        viewBox="0 0 200 115"
        className="w-full max-w-sm mx-auto"
      >

        {/* Background */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#F5EFF5"
          strokeWidth="24"
          strokeLinecap="round"
        />


        {/* Career slices */}
        {slices.map(
          (slice, index) => {

            const path =
              createArc(
                slice.startAngle,
                slice.endAngle,
                80
              )

            return (
              <path
                key={index}
                d={path}
                fill="none"
                stroke={slice.color}
                strokeWidth="24"
                strokeLinecap="butt"
              />
            )
          }
        )}

      </svg>


      <div
        className="absolute left-0 right-0 bottom-1 text-center"
      >

        <p
          className="text-xs font-medium"
          style={{
            color: '#857A87'
          }}
        >
          Career Distribution
        </p>

      </div>

    </div>
  )
}


// ==================================================================
// SKILL GAP — REDESIGNED
// ==================================================================
function SkillGap({
  skill_gap,
  top_career,
  setActiveTab
}) {

  const readinessColor =
    skill_gap.overall_readiness >= 70
      ? '#6E9B86'
      : skill_gap.overall_readiness >= 40
      ? '#B88655'
      : '#dc4c4c'

  const readinessLabel =
    skill_gap.overall_readiness >= 70
      ? 'Well Prepared'
      : skill_gap.overall_readiness >= 40
      ? 'Getting There'
      : 'Needs Work'

  return (
    <div className="space-y-4">

      {/* Header + overall readiness combined */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: '#ffffff',
          border: '1px solid #E5D8E4',
          boxShadow: '0 3px 15px rgba(155,127,160,0.06)'
        }}
      >

        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="flex items-start gap-4">

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: '#DBBCD4',
                color: '#9B7FA0'
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                />
              </svg>
            </div>

            <div>

              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: '#9B7FA0' }}
              >
                Skill Gap Analysis
              </p>

              <h2
                className="text-xl font-bold"
                style={{ color: '#2E2730' }}
              >
                {top_career}
              </h2>

              <p
                className="text-xs mt-1"
                style={{ color: '#857A87' }}
              >
                How your current skills compare with what this role requires
              </p>

            </div>

          </div>

          {/* Readiness ring */}
          <div className="flex items-center gap-4 flex-shrink-0">

            <div className="relative w-28 h-28">

              <svg
                className="w-28 h-28 -rotate-90"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#F5EFF5"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke={readinessColor}
                  strokeWidth="3.5"
                  strokeDasharray={`${(skill_gap.overall_readiness / 100) * 97} 97`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-2xl font-bold"
                  style={{ color: '#2E2730' }}
                >
                  {skill_gap.overall_readiness}%
                </span>
                <span
                  className="text-[9px] uppercase tracking-wide"
                  style={{ color: '#857A87' }}
                >
                  Readiness
                </span>
              </div>

            </div>

            <span
              className="text-[10px] px-3 py-1.5 rounded-full font-semibold whitespace-nowrap"
              style={{
                background: `${readinessColor}1a`,
                color: readinessColor
              }}
            >
              {readinessLabel}
            </span>

          </div>

        </div>

      </div>


      {/* Strengths + Needs Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <SkillGroup
          title="Strengths"
          subtitle="Skills already meeting the bar"
          items={skill_gap.strengths || []}
          color="#6E9B86"
          bg="#E3F1E9"
          icon="check"
        />

        <SkillGroup
          title="Needs Improvement"
          subtitle="Skills below the required level"
          items={skill_gap.weaknesses || []}
          color="#B88655"
          bg="#F7EBDD"
          icon="alert"
        />

      </div>


      {/* Missing skills */}
      {skill_gap.missing_skills?.length > 0 && (

        <SkillGroup
          title="Missing Skills"
          subtitle="Not yet covered by your quiz results"
          items={skill_gap.missing_skills}
          color="#dc4c4c"
          bg="#FDE8E8"
          icon="x"
        />

      )}


      {/* CTA */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, #9B7FA0 0%, #7D89B8 100%)',
          boxShadow: '0 10px 25px rgba(155,127,160,0.25)'
        }}
      >

        <div className="text-center sm:text-left">

          <p
            className="text-sm font-bold"
            style={{ color: '#ffffff' }}
          >
            Close the gap faster
          </p>

          <p
            className="text-xs mt-1"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            We've matched courses to the skills you need most
          </p>

        </div>

        <button
          onClick={() => setActiveTab('courses')}
          className="px-6 py-3 rounded-xl font-semibold text-sm transition hover:opacity-90 whitespace-nowrap"
          style={{
            background: '#ffffff',
            color: '#9B7FA0'
          }}
        >
          View Recommended Courses →
        </button>

      </div>

    </div>
  )
}


// ==================================================================
// SKILL GROUP — REDESIGNED
// ==================================================================
function SkillGroup({
  title,
  subtitle,
  items,
  color,
  bg,
  icon
}) {

  const icons = {
    check: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    ),
    alert: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    x: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    )
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: '#ffffff',
        border: '1px solid #E5D8E4',
        boxShadow:
          '0 3px 15px rgba(155,127,160,0.06)'
      }}
    >

      <div className="flex items-center justify-between mb-4 gap-3">

        <div className="flex items-center gap-3 min-w-0">

          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: bg, color }}
          >
            <svg
              className="w-4.5 h-4.5"
              style={{ width: '18px', height: '18px' }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {icons[icon]}
            </svg>
          </div>

          <div className="min-w-0">

            <h3
              className="text-sm font-bold truncate"
              style={{ color: '#2E2730' }}
            >
              {title}
            </h3>

            {subtitle && (
              <p
                className="text-[10px] truncate"
                style={{ color: '#857A87' }}
              >
                {subtitle}
              </p>
            )}

          </div>

        </div>

        <span
          className="text-[10px] px-2.5 py-1 rounded-full font-semibold flex-shrink-0"
          style={{
            background: bg,
            color
          }}
        >
          {items.length}
        </span>

      </div>


      {items.length === 0 ? (

        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: '#F5EFF5'
          }}
        >

          <p
            className="text-xs"
            style={{
              color: '#857A87'
            }}
          >
            No items in this category
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {items.map(
            (item, i) => (

              <SkillBar
                key={i}
                item={item}
                color={color}
                bg={bg}
              />

            )
          )}

        </div>

      )}

    </div>
  )
}


// ==================================================================
// SKILL BAR — REFINED
// ==================================================================
function SkillBar({
  item,
  color,
  bg
}) {

  return (
    <div
      className="p-3.5 rounded-xl"
      style={{
        background: bg
      }}
    >

      <div className="flex items-center justify-between mb-2 gap-2">

        <div className="min-w-0">

          <p
            className="text-xs font-semibold truncate"
            style={{
              color: '#2E2730'
            }}
          >
            {item.category_name}
          </p>

          <p
            className="text-[10px] mt-0.5"
            style={{
              color: '#857A87'
            }}
          >
            Your score: {item.your_score}/100
            {' · '}
            Required: {item.required_score}/100
          </p>

        </div>

        <span
          className="text-sm font-bold flex-shrink-0"
          style={{
            color
          }}
        >
          {item.percentage}%
        </span>

      </div>


      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.7)'
        }}
      >

        <div
          className="h-2 rounded-full transition-all"
          style={{
            width: `${Math.min(
              item.percentage,
              100
            )}%`,
            background: color
          }}
        />

      </div>


      {item.gap > 0 && (
        <p
          className="text-[10px] mt-1.5 font-semibold"
          style={{
            color
          }}
        >
          Gap: {item.gap} marks to close
        </p>
      )}

    </div>
  )
}


// ==================================================================
// COURSES — REDESIGNED (professional card grid)
// ==================================================================
function Courses({
  courses
}) {

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#ffffff',
        border: '1px solid #E5D8E4',
        boxShadow:
          '0 3px 15px rgba(155,127,160,0.06)'
      }}
    >

      {/* Header */}
      <div className="p-5">

        <div className="flex items-center justify-between">

          <div>

            <h2
              className="text-lg font-bold"
              style={{
                color: '#2E2730'
              }}
            >
              Recommended Courses
            </h2>

            <p
              className="text-xs mt-1"
              style={{
                color: '#857A87'
              }}
            >
              Courses selected to help improve your career skills
            </p>

          </div>

          <span
            className="text-[10px] px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: '#DBBCD4',
              color: '#9B7FA0'
            }}
          >
            {courses?.length || 0} Courses
          </span>

        </div>

      </div>


      {courses?.length === 0 ? (

        <EmptyState
          icon="📚"
          title="No courses available yet"
          description="Instructors haven't uploaded relevant courses yet."
        />

      ) : (

        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-5 pt-0"
        >

          {courses.map(
            (course, i) => (

              <div
                key={i}
                className="rounded-2xl p-5 flex flex-col transition hover:-translate-y-0.5"
                style={{
                  background: '#FCF9FC',
                  border: '1px solid #E5D8E4',
                  boxShadow: '0 2px 10px rgba(155,127,160,0.04)'
                }}
              >

                <div className="flex items-center justify-between mb-4">

                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: '#DBBCD4',
                      color: '#9B7FA0'
                    }}
                  >

                    {course.content_type ===
                    'video_link'
                      ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )
                      : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                          />

                          <path
                            strokeLinecap="round"
                            d="M8 7h8M8 11h8M8 15h5"
                          />
                        </svg>
                      )}

                  </div>

                  <span
                    className="text-[9px] px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: '#F5EFF5',
                      color: '#9B7FA0'
                    }}
                  >
                    {course.category}
                  </span>

                </div>


                <h3
                  className="text-sm font-bold mb-1.5"
                  style={{
                    color: '#2E2730'
                  }}
                >
                  {course.title}
                </h3>

                <p
                  className="text-[11px] leading-relaxed line-clamp-3 flex-1"
                  style={{
                    color: '#857A87'
                  }}
                >
                  {course.description}
                </p>


                <div
                  className="flex items-center justify-between mt-4 pt-4"
                  style={{
                    borderTop: '1px solid #EEE5ED'
                  }}
                >

                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: '#857A87'
                    }}
                  >
                    {course.content_type === 'video_link'
                      ? 'Video Lesson'
                      : 'Course Material'}
                  </span>

                  {course.drive_link ? (
                    <a
                      href={course.drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold transition hover:opacity-90"
                      style={{
                        background: '#9B7FA0',
                        color: '#ffffff'
                      }}
                    >
                      View Course
                      <span>→</span>
                    </a>
                  ) : (
                    <span
                      className="text-[10px] italic"
                      style={{ color: '#857A87' }}
                    >
                      Link unavailable
                    </span>
                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  )
}


// ==================================================================
// JOBS — REDESIGNED (professional job cards)
// ==================================================================
function Jobs({
  jobs
}) {

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#ffffff',
        border: '1px solid #E5D8E4',
        boxShadow:
          '0 3px 15px rgba(155,127,160,0.06)'
      }}
    >

      <div className="p-5">

        <div className="flex items-center justify-between">

          <div>

            <h2
              className="text-lg font-bold"
              style={{
                color: '#2E2730'
              }}
            >
              Matched Job Opportunities
            </h2>

            <p
              className="text-xs mt-1"
              style={{
                color: '#857A87'
              }}
            >
              Job opportunities matched with your career profile
            </p>

          </div>

          <span
            className="text-[10px] px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: '#E3F1E9',
              color: '#6E9B86'
            }}
          >
            {jobs?.length || 0} Jobs
          </span>

        </div>

      </div>


      {jobs?.length === 0 ? (

        <EmptyState
          icon="💼"
          title="No matching jobs yet"
          description="No active job posts match your profile yet."
        />

      ) : (

        <div className="p-5 pt-0 space-y-3">

          {jobs.map(
            (job, i) => {

              const matchColor =
                job.match_score >= 70
                  ? '#6E9B86'
                  : job.match_score >= 40
                  ? '#B88655'
                  : '#857A87'

              const matchBg =
                job.match_score >= 70
                  ? '#E3F1E9'
                  : job.match_score >= 40
                  ? '#F7EBDD'
                  : '#F5EFF5'

              const matchLabel =
                job.match_score >= 70
                  ? 'Strong Match'
                  : job.match_score >= 40
                  ? 'Potential'
                  : 'Low Match'

              return (

                <div
                  key={i}
                  className="rounded-2xl p-5 transition hover:shadow-md"
                  style={{
                    background: '#FCF9FC',
                    border: '1px solid #E5D8E4'
                  }}
                >

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                    {/* Company + role */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">

                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{
                          background:
                            'linear-gradient(135deg, #9B7FA0 0%, #7D89B8 100%)'
                        }}
                      >
                        {job.company_name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p
                          className="text-sm font-bold truncate"
                          style={{
                            color: '#2E2730'
                          }}
                        >
                          {job.title}
                        </p>

                        <p
                          className="text-xs font-medium mt-0.5"
                          style={{
                            color: '#9B7FA0'
                          }}
                        >
                          {job.company_name}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2.5">

                          <span
                            className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-medium"
                            style={{
                              background: '#DBBCD4',
                              color: '#9B7FA0'
                            }}
                          >
                            {job.job_type}
                          </span>

                          <span
                            className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-medium"
                            style={{
                              background: '#F5EFF5',
                              color: '#857A87'
                            }}
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                              />
                            </svg>
                            {job.location}
                          </span>

                          <span
                            className="text-[10px] font-medium"
                            style={{ color: '#857A87' }}
                          >
                            {job.category}
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* Match score + status */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:gap-2 flex-shrink-0 md:w-40">

                      <span
                        className="inline-flex px-3 py-1.5 rounded-full text-[10px] font-semibold"
                        style={{
                          background: matchBg,
                          color: matchColor
                        }}
                      >
                        {matchLabel}
                      </span>

                      <div className="flex items-center gap-2 w-full max-w-[140px]">

                        <div
                          className="flex-1 h-1.5 rounded-full"
                          style={{
                            background: '#DBBCD4'
                          }}
                        >
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${job.match_score}%`,
                              background: matchColor
                            }}
                          />
                        </div>

                        <span
                          className="text-xs font-bold flex-shrink-0"
                          style={{ color: matchColor }}
                        >
                          {job.match_score}%
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Skills */}
                  {job.required_skills && (
                    <div
                      className="mt-4 pt-4 flex flex-wrap gap-1.5"
                      style={{
                        borderTop: '1px solid #EEE5ED'
                      }}
                    >

                      {job.required_skills
                        .split(',')
                        .slice(0, 5)
                        .map(skill => (

                          <span
                            key={skill}
                            className="text-[10px] px-2.5 py-1 rounded-md font-medium"
                            style={{
                              background: '#DBBCD4',
                              color: '#9B7FA0'
                            }}
                          >
                            {skill.trim()}
                          </span>

                        ))}

                    </div>
                  )}

                </div>

              )
            }
          )}

        </div>

      )}

    </div>
  )
}


// ==================================================================
// EMPTY STATE
// ==================================================================
function EmptyState({
  icon,
  title,
  description
}) {

  return (
    <div className="p-12 text-center">

      <div
        className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
        style={{
          background:
            '#DBBCD4'
        }}
      >
        {icon}
      </div>

      <h3
        className="font-bold mb-2"
        style={{
          color: '#2E2730'
        }}
      >
        {title}
      </h3>

      <p
        className="text-sm"
        style={{
          color: '#857A87'
        }}
      >
        {description}
      </p>

    </div>
  )
}