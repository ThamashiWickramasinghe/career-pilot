import { useState, useEffect, useRef } from 'react'
import API from '../../utils/api'

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
  softOrange: '#ffefe0',
  red: '#dc4c4c',
  softRed: '#fde8e8'
}

const PRIMARY_GRADIENT = `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`
const PRIMARY_GRADIENT_H = `linear-gradient(90deg, ${COLORS.primaryDark}, ${COLORS.primary})`

// ============================================================
// ICONS — outline style, replaces emoji usage across the file
// ============================================================
const ICON_PATHS = {
  academicCap: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443',
  clock: 'M12 6.75V12l3.75 2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  shuffle: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
  skip: 'M5.25 4.5l7.5 7.5-7.5 7.5M12.75 4.5l7.5 7.5-7.5 7.5',
  shield: 'M9 12.75l2 2 4-4.5M12 2.75c-3.5 1.4-7 1.9-7 1.9v6.6c0 5.1 3 8.4 7 10.5 4-2.1 7-5.4 7-10.5v-6.6s-3.5-.5-7-1.9z',
  warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  play: 'M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z',
  star: 'M11.48 3.5a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0l-4.725 2.885a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557L2.08 10.386a.562.562 0 01.322-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  thumbsUp: 'M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.5H5.904m.729 0v9m-.729-9H4.5A1.5 1.5 0 003 12v6a1.5 1.5 0 001.5 1.5h1.275',
  book: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  sparkles: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
  trophy: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0',
  chartBar: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  flag: 'M3 3v17.25m0-17.25c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0v9.75c-1.5-1-3.5-1-5 0s-3.5 1-5 0-3.5-1-5 0'
}

function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.8 }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

// ============================================================
// OVERALL PROGRESS — ring + stat summary card (new pattern)
// ============================================================
function OverallProgressCard({ categories, currentCatIndex, skippedCategories, progress }) {
  const total = categories.length
  const skippedCount = skippedCategories.length
  const completedCount = Math.max(currentCatIndex - skippedCount, 0)
  const remaining = total - currentCatIndex

  const ringSize = 84
  const ringRadius = 36
  const circumference = 2 * Math.PI * ringRadius

  return (
    <div className="rounded-2xl p-5 shadow-sm mb-4" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
      <div className="flex items-center gap-5">

        {/* Progress ring */}
        <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} className="-rotate-90">
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringRadius}
              fill="none"
              stroke={COLORS.softPurple}
              strokeWidth="7"
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringRadius}
              fill="none"
              stroke={COLORS.primary}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold" style={{ color: COLORS.text }}>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Summary */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: COLORS.text }}>Overall Progress</p>
          <p className="text-xs mb-3" style={{ color: COLORS.textSecondary }}>
            {currentCatIndex} of {total} categories completed
          </p>

          <div className="flex gap-5">
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: COLORS.green }}>{completedCount}</p>
              <p className="text-[10px] mt-1" style={{ color: COLORS.textSecondary }}>Completed</p>
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: COLORS.orange }}>{skippedCount}</p>
              <p className="text-[10px] mt-1" style={{ color: COLORS.textSecondary }}>Skipped</p>
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: COLORS.primary }}>{remaining}</p>
              <p className="text-[10px] mt-1" style={{ color: COLORS.textSecondary }}>Remaining</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function Quiz({ onComplete }) {
  const [phase, setPhase] = useState('intro')
  const [categories, setCategories] = useState([])
  const [currentCatIndex, setCurrentCatIndex] = useState(0)
  const [currentQuestions, setCurrentQuestions] = useState([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [attemptId, setAttemptId] = useState(null)
  const [categoryScores, setCategoryScores] = useState({})
  const [skippedCategories, setSkippedCategories] = useState([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [totalTime, setTotalTime] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [catTabSwitches, setCatTabSwitches] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showWarning, setShowWarning] = useState(false)

  // Refs to avoid stale closures
  const selectedAnswerRef = useRef(null)
  const currentQIndexRef = useRef(0)
  const currentQuestionsRef = useRef([])
  const answersRef = useRef({})
  const categoriesRef = useRef([])
  const currentCatIndexRef = useRef(0)
  const categoryScoresRef = useRef({})
  const skippedCategoriesRef = useRef([])
  const attemptIdRef = useRef(null)
  const catTabSwitchesRef = useRef(0)
  const timerRef = useRef(null)
  const totalTimerRef = useRef(null)
  const phaseRef = useRef('intro')

  // Keep refs in sync
  useEffect(() => { selectedAnswerRef.current = selectedAnswer }, [selectedAnswer])
  useEffect(() => { currentQIndexRef.current = currentQIndex }, [currentQIndex])
  useEffect(() => { currentQuestionsRef.current = currentQuestions }, [currentQuestions])
  useEffect(() => { answersRef.current = answers }, [answers])
  useEffect(() => { categoriesRef.current = categories }, [categories])
  useEffect(() => { currentCatIndexRef.current = currentCatIndex }, [currentCatIndex])
  useEffect(() => { categoryScoresRef.current = categoryScores }, [categoryScores])
  useEffect(() => { skippedCategoriesRef.current = skippedCategories }, [skippedCategories])
  useEffect(() => { attemptIdRef.current = attemptId }, [attemptId])
  useEffect(() => { catTabSwitchesRef.current = catTabSwitches }, [catTabSwitches])
  useEffect(() => { phaseRef.current = phase }, [phase])

  // ── Anti-cheat: tab switch ──
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && phaseRef.current === 'quiz') {
        setTabSwitches(prev => prev + 1)
        setCatTabSwitches(prev => {
          catTabSwitchesRef.current = prev + 1
          return prev + 1
        })
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 3000)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // ── Anti-cheat: disable right click ──
  useEffect(() => {
    if (phase === 'quiz') {
      const prevent = e => e.preventDefault()
      document.addEventListener('contextmenu', prevent)
      return () => document.removeEventListener('contextmenu', prevent)
    }
  }, [phase])

  // ── Anti-cheat: disable copy/paste ──
  useEffect(() => {
    if (phase === 'quiz') {
      const prevent = e => e.preventDefault()
      document.addEventListener('copy', prevent)
      document.addEventListener('paste', prevent)
      document.addEventListener('cut', prevent)
      return () => {
        document.removeEventListener('copy', prevent)
        document.removeEventListener('paste', prevent)
        document.removeEventListener('cut', prevent)
      }
    }
  }, [phase])

  // ── Per-question timer ──
  useEffect(() => {
    if (phase !== 'quiz') return
    clearInterval(timerRef.current)
    setTimeLeft(30)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          // Auto-next using refs (no stale closure)
          autoNext()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentQIndex, phase])

  // ── Total time tracker ──
  useEffect(() => {
    if (phase === 'quiz') {
      totalTimerRef.current = setInterval(() => {
        setTotalTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(totalTimerRef.current)
    }
    return () => clearInterval(totalTimerRef.current)
  }, [phase])

  // ── Auto next using refs (no stale closure) ──
  const autoNext = () => {
    const questions = currentQuestionsRef.current
    const qIndex = currentQIndexRef.current
    const selected = selectedAnswerRef.current
    const currentAnswers = answersRef.current
    const currentQ = questions[qIndex]

    if (!currentQ) return

    const updatedAnswers = {
      ...currentAnswers,
      [currentQ.id]: selected !== null ? selected : -1
    }
    answersRef.current = updatedAnswers
    setAnswers(updatedAnswers)

    if (qIndex < questions.length - 1) {
      const nextIndex = qIndex + 1
      currentQIndexRef.current = nextIndex
      setCurrentQIndex(nextIndex)
      selectedAnswerRef.current = null
      setSelectedAnswer(null)
    } else {
      submitCategoryWithData(updatedAnswers, questions)
    }
  }

  // ── Manual next ──
  const goNextQuestion = () => {
    clearInterval(timerRef.current)
    const currentQ = currentQuestionsRef.current[currentQIndexRef.current]
    const selected = selectedAnswerRef.current
    const currentAnswers = answersRef.current

    const updatedAnswers = {
      ...currentAnswers,
      [currentQ?.id]: selected !== null ? selected : -1
    }
    answersRef.current = updatedAnswers
    setAnswers(updatedAnswers)
    selectedAnswerRef.current = null
    setSelectedAnswer(null)

    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1)
    } else {
      submitCategoryWithData(updatedAnswers, currentQuestions)
    }
  }

  // ── Submit category ──
  const submitCategoryWithData = async (finalAnswers, questions) => {
    const cats = categoriesRef.current
    const catIdx = currentCatIndexRef.current
    const cat = cats[catIdx]
    const aid = attemptIdRef.current
    const tabSw = catTabSwitchesRef.current

    setPhase('category-result')
    phaseRef.current = 'category-result'

    // ── Calculate score locally ──
    let score = 0
    questions.forEach(q => {
      const selected = finalAnswers[q.id]
      if (selected !== undefined && selected !== -1 && selected === q.correct_option) {
        score += q.marks
      }
    })

    setCategoryScores(prev => {
      const updated = { ...prev, [cat.code]: score }
      categoryScoresRef.current = updated
      return updated
    })

    try {
      await API.post('/quiz/submit-category', {
        attempt_id: aid,
        category_code: cat.code,
        answers: finalAnswers,
        skipped: false,
        tab_switches: tabSw,
        local_score: score
      })
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await API.get('/quiz/categories')
      setCategories(res.data.categories)
      categoriesRef.current = res.data.categories
    } catch (err) {
      setError('Failed to load categories')
    }
  }

  const startQuiz = async () => {
    setLoading(true)
    try {
      const res = await API.post('/quiz/start')
      setAttemptId(res.data.attempt_id)
      attemptIdRef.current = res.data.attempt_id
      await fetchCategories()
      setPhase('category-intro')
      phaseRef.current = 'category-intro'
      setCurrentCatIndex(0)
      currentCatIndexRef.current = 0
    } catch (err) {
      setError('Failed to start quiz')
    }
    setLoading(false)
  }

  const loadCategoryQuestions = async (catCode) => {
    setLoading(true)
    try {
      const res = await API.get(`/quiz/questions/${catCode}`)

      // ── Shuffle options on frontend + track correct answer ──
      const processed = res.data.questions.map(q => {
        const originalOptions = [...q.options]
        const correctText = originalOptions[q.correct_option]
        const shuffled = [...originalOptions].sort(() => Math.random() - 0.5)
        const newCorrectIndex = shuffled.indexOf(correctText)
        return { ...q, options: shuffled, correct_option: newCorrectIndex }
      })

      setCurrentQuestions(processed)
      currentQuestionsRef.current = processed
      setCurrentQIndex(0)
      currentQIndexRef.current = 0
      setAnswers({})
      answersRef.current = {}
      setSelectedAnswer(null)
      selectedAnswerRef.current = null
      setCatTabSwitches(0)
      catTabSwitchesRef.current = 0
      setPhase('quiz')
      phaseRef.current = 'quiz'
    } catch (err) {
      setError('Failed to load questions')
    }
    setLoading(false)
  }

  const skipCategory = async () => {
    const cat = categoriesRef.current[currentCatIndexRef.current]
    try {
      await API.post('/quiz/submit-category', {
        attempt_id: attemptIdRef.current,
        category_code: cat.code,
        answers: {},
        skipped: true,
        tab_switches: 0
      })
      setSkippedCategories(prev => {
        const updated = [...prev, cat.code]
        skippedCategoriesRef.current = updated
        return updated
      })
      setCategoryScores(prev => {
        const updated = { ...prev, [cat.code]: 0 }
        categoryScoresRef.current = updated
        return updated
      })
      goNextCategory()
    } catch (err) {
      setError('Failed to skip')
    }
  }

  const goNextCategory = () => {
    const cats = categoriesRef.current
    const catIdx = currentCatIndexRef.current

    if (catIdx < cats.length - 1) {
      const nextIdx = catIdx + 1
      setCurrentCatIndex(nextIdx)
      currentCatIndexRef.current = nextIdx
      setPhase('category-intro')
      phaseRef.current = 'category-intro'
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    setPhase('completing')
    phaseRef.current = 'completing'
    try {
      const res = await API.post('/quiz/complete', {
        attempt_id: attemptIdRef.current,
        time_taken_seconds: totalTime
      })
      setPhase('completed')
      phaseRef.current = 'completed'
      if (onComplete) onComplete({
        categoryScores: categoryScoresRef.current,
        skippedCategories: skippedCategoriesRef.current,
        attemptId: attemptIdRef.current,
        totalScore: res.data.attempt?.total_score || 0
      })
    } catch (err) {
      setPhase('completed')
      phaseRef.current = 'completed'
    }
  }

  const currentCat = categories[currentCatIndex]
  const currentQ = currentQuestions[currentQIndex]
  const progress = categories.length > 0 ? (currentCatIndex / categories.length) * 100 : 0
  const qProgress = currentQuestions.length > 0 ? (currentQIndex / currentQuestions.length) * 100 : 0
  const timerColor = timeLeft > 15 ? COLORS.green : timeLeft > 7 ? COLORS.orange : COLORS.red

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div className="min-h-screen py-8 px-4" style={{ background: COLORS.bg }}>
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
            <div className="p-8 text-center text-white" style={{ background: PRIMARY_GRADIENT }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Icon name="academicCap" className="w-8 h-8" strokeWidth={1.6} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Career Assessment Quiz</h2>
              <p className="text-sm" style={{ color: COLORS.softPurple }}>
                14 categories · 10 questions each · 30 seconds per question
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: 'clock', title: '30 seconds', desc: 'Per question timer' },
                  { icon: 'shuffle', title: 'Randomized', desc: 'Questions shuffle each attempt' },
                  { icon: 'skip', title: 'Skip allowed', desc: "Skip categories you don't know" },
                  { icon: 'shield', title: 'Anti-cheat', desc: 'Tab switches are recorded' },
                ].map(item => (
                  <div key={item.title} className="p-3 rounded-xl" style={{ background: COLORS.softPanel, border: `1px solid ${COLORS.border}` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: COLORS.softPurple, color: COLORS.primary }}>
                      <Icon name={item.icon} className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: COLORS.text }}>{item.title}</p>
                    <p className="text-xs" style={{ color: COLORS.textSecondary }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl mb-6 text-sm" style={{ background: COLORS.softOrange, border: `1px solid ${COLORS.orange}55`, color: COLORS.text }}>
                <div className="flex items-center gap-2 font-bold mb-1" style={{ color: COLORS.orange }}>
                  <Icon name="warning" className="w-4 h-4" strokeWidth={2} />
                  Rules
                </div>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Do not switch tabs during the quiz</li>
                  <li>Copy/paste and right-click are disabled</li>
                  <li>Each question auto-submits after 30 seconds</li>
                  <li>You can skip any category you're unfamiliar with</li>
                  <li>Each correct answer = 10 marks</li>
                </ul>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm mb-4" style={{ color: COLORS.red }}>
                  <Icon name="warning" className="w-4 h-4" strokeWidth={2} />
                  {error}
                </div>
              )}
              <button onClick={startQuiz} disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: PRIMARY_GRADIENT }}>
                <Icon name="play" className="w-5 h-5" strokeWidth={0} />
                {loading ? 'Starting...' : 'Start Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── CATEGORY INTRO ──
  if (phase === 'category-intro' && currentCat) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ background: COLORS.bg }}>
        <div className="max-w-2xl mx-auto">

          <OverallProgressCard
            categories={categories}
            currentCatIndex={currentCatIndex}
            skippedCategories={skippedCategories}
            progress={progress}
          />

          <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
            <div className="p-8 text-center text-white" style={{ background: PRIMARY_GRADIENT }}>
              <div className="text-5xl mb-3">{currentCat.icon}</div>
              <h2 className="text-2xl font-bold mb-1">{currentCat.name}</h2>
              <p className="text-sm" style={{ color: COLORS.softPurple }}>{currentCat.description}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="p-3 rounded-xl" style={{ background: COLORS.softPanel }}>
                  <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>10</p>
                  <p className="text-xs" style={{ color: COLORS.textSecondary }}>Questions</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: COLORS.softPanel }}>
                  <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>100</p>
                  <p className="text-xs" style={{ color: COLORS.textSecondary }}>Max Score</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: COLORS.softPanel }}>
                  <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                    {categories.length - currentCatIndex}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.textSecondary }}>Remaining</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => loadCategoryQuestions(currentCat.code)}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-50"
                  style={{ background: PRIMARY_GRADIENT }}>
                  {loading ? 'Loading...' : `Start ${currentCat.name}`}
                </button>
                <button onClick={skipCategory}
                  className="px-5 py-3 rounded-xl font-medium border-2 transition"
                  style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                  onMouseEnter={e => { e.currentTarget.style.background = COLORS.softPanel }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  Skip
                </button>
              </div>
              <p className="text-center text-xs mt-3" style={{ color: COLORS.textSecondary }}>
                Skipping gives 0 marks for this category
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ ──
  if (phase === 'quiz' && currentQ && currentCat) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ background: COLORS.bg }}>
        <div className="max-w-2xl mx-auto select-none"
          onCopy={e => e.preventDefault()}
          onCut={e => e.preventDefault()}
          onPaste={e => e.preventDefault()}>

          {showWarning && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 text-white px-6 py-3 rounded-xl shadow-xl font-medium text-sm flex items-center gap-2"
              style={{ background: COLORS.red }}>
              <Icon name="warning" className="w-4 h-4" strokeWidth={2} />
              Tab switch detected! This is recorded.
            </div>
          )}

          {/* Header */}
          <div className="rounded-2xl p-4 shadow-sm mb-4" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm" style={{ color: COLORS.text }}>
                {currentCat.icon} {currentCat.name}
              </span>
              <div className="flex items-center gap-3">
                {tabSwitches > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: COLORS.red }}>
                    <Icon name="warning" className="w-3.5 h-3.5" strokeWidth={2.2} />
                    {tabSwitches} tab switch{tabSwitches > 1 ? 'es' : ''}
                  </span>
                )}
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke={COLORS.softPurple} strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none"
                      stroke={timerColor} strokeWidth="3"
                      strokeDasharray={`${(timeLeft / 30) * 94} 94`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                    style={{ color: timerColor }}>
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs mb-1" style={{ color: COLORS.textSecondary }}>
              <span>Question {currentQIndex + 1} of {currentQuestions.length}</span>
              <span>{currentQ.question_code}</span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{ background: COLORS.softPurple }}>
              <div className="h-1.5 rounded-full transition-all"
                style={{ width: `${qProgress}%`, background: PRIMARY_GRADIENT_H }}>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="rounded-2xl shadow-sm p-6 mb-4" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
            <h3 className="text-lg font-semibold mb-6 leading-relaxed" style={{ color: COLORS.text }}>
              {currentQ.question_text}
            </h3>
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx
                return (
                  <button key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx)
                      selectedAnswerRef.current = idx
                    }}
                    className="w-full text-left p-4 rounded-xl border-2 transition font-medium text-sm"
                    style={
                      isSelected
                        ? { borderColor: COLORS.primary, color: COLORS.text, background: COLORS.softPurple }
                        : { borderColor: COLORS.border, color: COLORS.text, background: COLORS.panel }
                    }
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = COLORS.blue
                        e.currentTarget.style.background = COLORS.softBlue
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = COLORS.border
                        e.currentTarget.style.background = COLORS.panel
                      }
                    }}>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3"
                      style={{
                        background: isSelected ? COLORS.primary : COLORS.softPanel,
                        color: isSelected ? '#ffffff' : COLORS.textSecondary
                      }}>
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <button onClick={goNextQuestion}
            className="w-full py-3 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2"
            style={{ background: PRIMARY_GRADIENT }}>
            {currentQIndex < currentQuestions.length - 1
              ? selectedAnswer !== null ? 'Next Question' : 'Skip This Question'
              : selectedAnswer !== null ? 'Submit Category' : 'Skip & Submit'}
            <Icon
              name={
                currentQIndex >= currentQuestions.length - 1 && selectedAnswer !== null
                  ? 'check'
                  : 'skip'
              }
              className="w-4 h-4"
              strokeWidth={2.2}
            />
          </button>
          <p className="text-center text-xs mt-3" style={{ color: COLORS.textSecondary }}>
            Auto-submits in {timeLeft} seconds
          </p>
        </div>
      </div>
    )
  }

  // ── CATEGORY RESULT ──
  if (phase === 'category-result' && currentCat) {
    const score = categoryScores[currentCat.code] || 0
    const isLast = currentCatIndex === categories.length - 1
    const scoreColor = score >= 70 ? COLORS.green : score >= 40 ? COLORS.orange : COLORS.red
    const resultIcon = score >= 70 ? 'star' : score >= 40 ? 'thumbsUp' : 'book'
    const resultLabel = score >= 70 ? 'Excellent!' : score >= 40 ? 'Good effort!' : 'Keep learning!'

    return (
      <div className="min-h-screen py-8 px-4" style={{ background: COLORS.bg }}>
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
            <div className="p-6 text-center text-white" style={{ background: PRIMARY_GRADIENT }}>
              <div className="text-4xl mb-2">{currentCat.icon}</div>
              <h3 className="text-xl font-bold">{currentCat.name} Complete!</h3>
            </div>
            <div className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-5">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke={COLORS.softPurple} strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none"
                    stroke={scoreColor}
                    strokeWidth="3"
                    strokeDasharray={`${(score / 100) * 94} 94`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: COLORS.text }}>{score}</span>
                  <span className="text-xs" style={{ color: COLORS.textSecondary }}>/ 100</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon name={resultIcon} className="w-5 h-5" strokeWidth={1.8} />
                <p className="text-lg font-bold" style={{ color: scoreColor }}>
                  {resultLabel}
                </p>
              </div>
              <p className="text-sm mb-6" style={{ color: COLORS.textSecondary }}>
                You scored {score} out of 100 in {currentCat.name}
              </p>
              <button onClick={goNextCategory}
                className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                style={{ background: PRIMARY_GRADIENT }}>
                {isLast ? (
                  <>
                    <Icon name="flag" className="w-4 h-4" strokeWidth={2} />
                    Complete Quiz
                  </>
                ) : (
                  <>
                    {`Next: ${categories[currentCatIndex + 1]?.name || 'Continue'}`}
                    <Icon name="skip" className="w-4 h-4" strokeWidth={2.2} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── COMPLETING ──
  if (phase === 'completing') {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center" style={{ background: COLORS.bg }}>
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 animate-spin" style={{ borderColor: COLORS.softPurple, borderTopColor: COLORS.primary }} />
            <div className="absolute inset-0 flex items-center justify-center" style={{ color: COLORS.primary }}>
              <Icon name="sparkles" className="w-6 h-6" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.text }}>Analyzing your results...</h3>
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>AI is predicting your career path</p>
        </div>
      </div>
    )
  }

  // ── COMPLETED ──
  if (phase === 'completed') {
    const answeredCats = Object.keys(categoryScores).filter(c => !skippedCategories.includes(c))
    const avgScore = answeredCats.length > 0
      ? answeredCats.reduce((sum, c) => sum + categoryScores[c], 0) / answeredCats.length
      : 0

    return (
      <div className="min-h-screen py-8 px-4" style={{ background: COLORS.bg }}>
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}` }}>
            <div className="p-6 text-center text-white" style={{ background: PRIMARY_GRADIENT }}>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Icon name="trophy" className="w-7 h-7" strokeWidth={1.6} />
              </div>
              <h2 className="text-2xl font-bold mb-1">Quiz Completed!</h2>
              <p className="text-sm" style={{ color: COLORS.softPurple }}>
                Time: {Math.floor(totalTime / 60)}m {totalTime % 60}s · Tab switches: {tabSwitches}
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="p-3 rounded-xl" style={{ background: COLORS.softPanel }}>
                  <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>{answeredCats.length}</p>
                  <p className="text-xs" style={{ color: COLORS.textSecondary }}>Answered</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: COLORS.softPanel }}>
                  <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>{skippedCategories.length}</p>
                  <p className="text-xs" style={{ color: COLORS.textSecondary }}>Skipped</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: COLORS.softPanel }}>
                  <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>{avgScore.toFixed(0)}</p>
                  <p className="text-xs" style={{ color: COLORS.textSecondary }}>Avg Score</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-bold mb-3" style={{ color: COLORS.text }}>
                <Icon name="chartBar" className="w-4 h-4" strokeWidth={1.8} />
                Score Breakdown
              </div>
              <div className="space-y-2 mb-6">
                {categories.map(cat => {
                  const score = categoryScores[cat.code] || 0
                  const skipped = skippedCategories.includes(cat.code)
                  const barColor = skipped ? COLORS.border : score >= 70 ? COLORS.green : score >= 40 ? COLORS.orange : COLORS.red
                  const labelColor = skipped ? COLORS.textSecondary : score >= 70 ? COLORS.green : score >= 40 ? COLORS.orange : COLORS.red
                  return (
                    <div key={cat.code} className="flex items-center gap-3">
                      <span className="text-sm w-5">{cat.icon}</span>
                      <span className="text-xs w-36 truncate" style={{ color: COLORS.textSecondary }}>{cat.name}</span>
                      <div className="flex-1 rounded-full h-2" style={{ background: COLORS.softPanel }}>
                        <div className="h-2 rounded-full" style={{ width: `${score}%`, background: barColor }}></div>
                      </div>
                      <span className="text-xs font-semibold w-16 text-right" style={{ color: labelColor }}>
                        {skipped ? 'Skipped' : `${score}/100`}
                      </span>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => onComplete && onComplete({
                  categoryScores,
                  skippedCategories,
                  attemptId,
                  totalScore: avgScore
                })}
                className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                style={{ background: PRIMARY_GRADIENT }}>
                <Icon name="sparkles" className="w-4 h-4" strokeWidth={1.8} />
                Get AI Career Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bg }}>
      <div className="text-center py-20">
        <div className="w-12 h-12 rounded-full border-4 animate-spin mx-auto mb-4" style={{ borderColor: COLORS.softPurple, borderTopColor: COLORS.primary }} />
        <p style={{ color: COLORS.textSecondary }}>Loading...</p>
      </div>
    </div>
  )
}
