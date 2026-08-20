import { useState } from 'react'
import Quiz from './Quiz'
import AIResults from './AIResults'

// ============================================================
// COLOR TOKENS
// ============================================================
const COLORS = {
  bg: '#f6f3ff',
  primary: '#5b56b5',
  primaryDark: '#4d48a3',
  softPurple: '#e9e7f8',
  panel: '#ffffff',
  softPanel: '#f3f0fa',
  border: '#e6e3f2',
  text: '#25243a',
  textSecondary: '#85839a',
  green: '#5db192',
  softGreen: '#dffff0',
  blue: '#6f8fd4',
  softBlue: '#e3eafb',
  orange: '#e5a26d',
  softOrange: '#ffefe0'
}

const PRIMARY_GRADIENT = `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`

// ============================================================
// ICONS — small outline set, no emoji
// ============================================================
const ICON_PATHS = {
  academicCap: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443',
  sparkles: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
  play: 'M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z',
  refresh: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
  checkCircle: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  arrowLeft: 'M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
}

function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.8 }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

export default function JobPortal() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [showAIResults, setShowAIResults] = useState(false)
  const [quizResult, setQuizResult] = useState(null)

  const handleQuizComplete = (result) => {
    setQuizResult(result)
    setShowQuiz(false)
    setShowAIResults(true)
  }

  // ── AI RESULTS VIEW ──
  if (showAIResults && quizResult) {
    return (
      <AIResults
        quizData={quizResult}
        onBack={() => setShowAIResults(false)}
      />
    )
  }

  // ── QUIZ VIEW ──
  if (showQuiz) {
    return (
      <div className="min-h-screen" style={{ background: COLORS.bg }}>
        <div className="max-w-2xl mx-auto pt-6 px-4">
          <button onClick={() => setShowQuiz(false)}
            className="flex items-center gap-2 font-medium text-sm mb-2"
            style={{ color: COLORS.primary }}>
            <Icon name="arrowLeft" className="w-4 h-4" strokeWidth={2.2} />
            Back
          </button>
        </div>
        <Quiz onComplete={handleQuizComplete} />
      </div>
    )
  }

  // ── MAIN VIEW — quiz entry point only ──
  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4" style={{ background: COLORS.bg }}>
      <div className="max-w-xl w-full">

        <div className="rounded-3xl overflow-hidden shadow-sm" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>

          {/* Header */}
          <div className="relative p-10 text-center text-white overflow-hidden" style={{ background: PRIMARY_GRADIENT }}>
            <div
              className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }}
            />
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center relative z-10"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <Icon name="academicCap" className="w-8 h-8" strokeWidth={1.6} />
            </div>
            <h1 className="text-2xl font-bold mb-2 relative z-10">Career Assessment Quiz</h1>
            <p className="text-sm relative z-10" style={{ color: COLORS.softPurple }}>
              Answer questions across 14 IT categories and let AI predict your ideal career path
            </p>
          </div>

          {/* Body */}
          <div className="p-8">

            {quizResult ? (
              <>
                <div className="flex items-center gap-3 mb-5 p-4 rounded-xl" style={{ background: COLORS.softGreen }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#ffffff', color: COLORS.green }}>
                    <Icon name="checkCircle" className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: COLORS.text }}>Quiz Completed</p>
                    <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                      Your AI career analysis is ready to view
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowAIResults(true)}
                    className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: PRIMARY_GRADIENT }}
                  >
                    <Icon name="sparkles" className="w-4 h-4" strokeWidth={1.8} />
                    View AI Analysis
                  </button>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="flex-1 py-3 rounded-xl font-semibold border-2 flex items-center justify-center gap-2 transition"
                    style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.softPanel }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Icon name="refresh" className="w-4 h-4" strokeWidth={2} />
                    Retake Quiz
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                  <div className="p-3 rounded-xl" style={{ background: COLORS.softPanel }}>
                    <p className="text-lg font-bold" style={{ color: COLORS.primary }}>14</p>
                    <p className="text-[10px]" style={{ color: COLORS.textSecondary }}>Categories</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: COLORS.softPanel }}>
                    <p className="text-lg font-bold" style={{ color: COLORS.primary }}>140</p>
                    <p className="text-[10px]" style={{ color: COLORS.textSecondary }}>Questions</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: COLORS.softPanel }}>
                    <p className="text-lg font-bold" style={{ color: COLORS.primary }}>~30m</p>
                    <p className="text-[10px]" style={{ color: COLORS.textSecondary }}>Duration</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2"
                  style={{ background: PRIMARY_GRADIENT }}
                >
                  <Icon name="play" className="w-5 h-5" strokeWidth={0} />
                  Start Quiz Now
                </button>
                <p className="text-center text-xs mt-3" style={{ color: COLORS.textSecondary }}>
                  Optional · Skip any category you're unsure of
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
