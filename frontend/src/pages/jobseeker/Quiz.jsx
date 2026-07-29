import { useState, useEffect, useRef, useCallback } from 'react'
import API from '../../utils/api'

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
  const [warning, setWarning] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const timerRef = useRef(null)
  const totalTimerRef = useRef(null)
  const startTimeRef = useRef(null)

  // ── Anti-cheat: tab switch detection ──
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && phase === 'quiz') {
        setTabSwitches(prev => prev + 1)
        setCatTabSwitches(prev => prev + 1)
        setWarning('⚠️ Tab switch detected! This is recorded.')
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 3000)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [phase])

  // ── Anti-cheat: disable right click ──
  useEffect(() => {
    if (phase === 'quiz') {
      const prevent = (e) => e.preventDefault()
      document.addEventListener('contextmenu', prevent)
      return () => document.removeEventListener('contextmenu', prevent)
    }
  }, [phase])

  // ── Anti-cheat: disable copy/paste ──
  useEffect(() => {
    if (phase === 'quiz') {
      const prevent = (e) => e.preventDefault()
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
          handleAutoNext()
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
      startTimeRef.current = Date.now()
      totalTimerRef.current = setInterval(() => {
        setTotalTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    }
    return () => clearInterval(totalTimerRef.current)
  }, [phase])

  const handleAutoNext = useCallback(() => {
    if (selectedAnswer === null) {
      setAnswers(prev => ({ ...prev, [currentQuestions[currentQIndex]?.id]: -1 }))
    }
    goNextQuestion()
  }, [currentQIndex, currentQuestions, selectedAnswer])

  const fetchCategories = async () => {
    try {
      const res = await API.get('/quiz/categories')
      setCategories(res.data.categories)
    } catch (err) {
      setError('Failed to load categories')
    }
  }

  const startQuiz = async () => {
    setLoading(true)
    try {
      const res = await API.post('/quiz/start')
      setAttemptId(res.data.attempt_id)
      await fetchCategories()
      setPhase('category-intro')
      setCurrentCatIndex(0)
    } catch (err) {
      setError('Failed to start quiz')
    }
    setLoading(false)
  }

  const loadCategoryQuestions = async (catCode) => {
    setLoading(true)
    try {
      const res = await API.get(`/quiz/questions/${catCode}`)
      setCurrentQuestions(res.data.questions)
      setCurrentQIndex(0)
      setAnswers({})
      setSelectedAnswer(null)
      setCatTabSwitches(0)
      setPhase('quiz')
    } catch (err) {
      setError('Failed to load questions')
    }
    setLoading(false)
  }

  const skipCategory = async () => {
    const cat = categories[currentCatIndex]
    try {
      await API.post('/quiz/submit-category', {
        attempt_id: attemptId,
        category_code: cat.code,
        answers: {},
        skipped: true,
        tab_switches: 0
      })
      setSkippedCategories(prev => [...prev, cat.code])
      setCategoryScores(prev => ({ ...prev, [cat.code]: 0 }))
      goNextCategory()
    } catch (err) {
      setError('Failed to skip category')
    }
  }

  const goNextQuestion = () => {
    clearInterval(timerRef.current)
    const finalAnswers = selectedAnswer !== null
      ? { ...answers, [currentQuestions[currentQIndex]?.id]: selectedAnswer }
      : { ...answers, [currentQuestions[currentQIndex]?.id]: -1 }
    setAnswers(finalAnswers)
    setSelectedAnswer(null)

    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1)
    } else {
      submitCategory(finalAnswers)
    }
  }

  const submitCategory = async (finalAnswers) => {
    const cat = categories[currentCatIndex]
    setPhase('category-result')
    try {
      const res = await API.post('/quiz/submit-category', {
        attempt_id: attemptId,
        category_code: cat.code,
        answers: finalAnswers,
        skipped: false,
        tab_switches: catTabSwitches
      })
      setCategoryScores(prev => ({ ...prev, [cat.code]: res.data.category_score }))
    } catch (err) {
      setError('Failed to submit category')
    }
  }

  const goNextCategory = () => {
    if (currentCatIndex < categories.length - 1) {
      setCurrentCatIndex(prev => prev + 1)
      setPhase('category-intro')
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    setPhase('completing')
    try {
      const res = await API.post('/quiz/complete', {
        attempt_id: attemptId,
        time_taken_seconds: totalTime
      })
      setPhase('completed')
      if (onComplete) onComplete(res.data.attempt)
    } catch (err) {
      setError('Failed to complete quiz')
      setPhase('completed')
    }
  }

  const currentCat = categories[currentCatIndex]
  const currentQ = currentQuestions[currentQIndex]
  const progress = categories.length > 0 ? ((currentCatIndex) / categories.length) * 100 : 0
  const qProgress = currentQuestions.length > 0 ? ((currentQIndex) / currentQuestions.length) * 100 : 0

  const timerColor = timeLeft > 15 ? '#10b981' : timeLeft > 7 ? '#f59e0b' : '#ef4444'

  // ── INTRO PHASE ──
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 text-center text-white relative"
            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-bold mb-2">Career Assessment Quiz</h2>
            <p className="text-green-100 text-sm">14 categories · 10 questions each · 30 seconds per question</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: '⏱️', title: '30 seconds', desc: 'Per question timer' },
                { icon: '🔀', title: 'Randomized', desc: 'Questions shuffle each attempt' },
                { icon: '⏭️', title: 'Skip allowed', desc: 'Skip categories you don\'t know' },
                { icon: '🛡️', title: 'Anti-cheat', desc: 'Tab switches are recorded' },
              ].map(item => (
                <div key={item.title} className="p-3 rounded-xl border border-gray-100"
                  style={{background: '#f0fdf4'}}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 mb-6 text-sm text-yellow-800">
              <strong>⚠️ Important Rules:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Do not switch tabs during the quiz</li>
                <li>Copy/paste is disabled</li>
                <li>Right-click is disabled</li>
                <li>Each question auto-submits after 30 seconds</li>
                <li>You can skip any category you're unfamiliar with</li>
              </ul>
            </div>

            {error && <div className="text-red-500 text-sm mb-4">⚠️ {error}</div>}

            <button onClick={startQuiz} disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-lg disabled:opacity-50"
              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
              {loading ? 'Starting...' : '🚀 Start Quiz'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── CATEGORY INTRO PHASE ──
  if (phase === 'category-intro' && currentCat) {
    const completed = currentCatIndex
    const remaining = categories.length - currentCatIndex
    return (
      <div className="max-w-2xl mx-auto">
        {/* Overall Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Overall Progress</span>
            <span>{currentCatIndex}/{categories.length} categories</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="h-2 rounded-full transition-all"
              style={{width: `${progress}%`, background: 'linear-gradient(90deg, #0f4c35, #10b981)'}}>
            </div>
          </div>
          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {categories.map((cat, idx) => (
              <span key={cat.code}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  idx < currentCatIndex
                    ? skippedCategories.includes(cat.code)
                      ? 'bg-gray-100 text-gray-400 line-through'
                      : 'bg-green-100 text-green-700'
                    : idx === currentCatIndex
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
                style={idx === currentCatIndex ? {background: 'linear-gradient(135deg, #0f4c35, #10b981)'} : {}}>
                {cat.icon} {cat.code}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 text-center text-white"
            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
            <div className="text-5xl mb-3">{currentCat.icon}</div>
            <h2 className="text-2xl font-bold mb-1">{currentCat.name}</h2>
            <p className="text-green-100 text-sm">{currentCat.description}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                <p className="text-2xl font-bold" style={{color: '#0f4c35'}}>10</p>
                <p className="text-xs text-gray-500">Questions</p>
              </div>
              <div className="p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                <p className="text-2xl font-bold" style={{color: '#0f4c35'}}>100</p>
                <p className="text-xs text-gray-500">Max Score</p>
              </div>
              <div className="p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                <p className="text-2xl font-bold" style={{color: '#0f4c35'}}>{remaining}</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => loadCategoryQuestions(currentCat.code)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-50"
                style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
                {loading ? 'Loading...' : `Start ${currentCat.name} →`}
              </button>
              <button onClick={skipCategory}
                className="px-5 py-3 rounded-xl font-medium border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                ⏭️ Skip
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-3">
              Skipping gives 0 marks for this category
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ PHASE ──
  if (phase === 'quiz' && currentQ && currentCat) {
    return (
      <div className="max-w-2xl mx-auto select-none"
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}>

        {/* Warning Banner */}
        {showWarning && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-xl font-medium text-sm">
            ⚠️ Tab switch detected! This is recorded.
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700 text-sm">
              {currentCat.icon} {currentCat.name}
            </span>
            <div className="flex items-center gap-3">
              {tabSwitches > 0 && (
                <span className="text-xs text-red-500 font-medium">
                  ⚠️ {tabSwitches} tab switch{tabSwitches > 1 ? 'es' : ''}
                </span>
              )}
              {/* Timer Circle */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none"
                    stroke={timerColor} strokeWidth="3"
                    strokeDasharray={`${(timeLeft / 30) * 94} 94`}
                    strokeLinecap="round"
                    style={{transition: 'stroke-dasharray 1s linear, stroke 0.3s'}} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                  style={{color: timerColor}}>
                  {timeLeft}
                </span>
              </div>
            </div>
          </div>

          {/* Question Progress */}
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Question {currentQIndex + 1} of {currentQuestions.length}</span>
            <span>{currentQ.question_code}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all"
              style={{width: `${qProgress}%`, background: 'linear-gradient(90deg, #0f4c35, #10b981)'}}>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
            {currentQ.question_text}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button key={idx}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition font-medium text-sm ${
                  selectedAnswer === idx
                    ? 'border-teal-500 text-teal-800'
                    : 'border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50'
                }`}
                style={selectedAnswer === idx ? {background: '#d1fae5'} : {}}>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 flex-shrink-0"
                  style={{
                    background: selectedAnswer === idx ? '#0f4c35' : '#e5e7eb',
                    color: selectedAnswer === idx ? 'white' : '#6b7280'
                  }}>
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button onClick={goNextQuestion}
          className="w-full py-3 rounded-xl font-bold text-white text-base"
          style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
          {currentQIndex < currentQuestions.length - 1
            ? selectedAnswer !== null ? 'Next Question →' : 'Skip This Question →'
            : selectedAnswer !== null ? 'Submit Category ✓' : 'Skip & Submit →'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Question auto-submits in {timeLeft} seconds
        </p>
      </div>
    )
  }

  // ── CATEGORY RESULT PHASE ──
  if (phase === 'category-result' && currentCat) {
    const score = categoryScores[currentCat.code] || 0
    const percentage = score
    const isLast = currentCatIndex === categories.length - 1

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 text-center text-white"
            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
            <div className="text-4xl mb-2">{currentCat.icon}</div>
            <h3 className="text-xl font-bold">{currentCat.name} Complete!</h3>
          </div>

          <div className="p-6 text-center">
            {/* Score Circle */}
            <div className="relative w-32 h-32 mx-auto mb-5">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none"
                  stroke={percentage >= 70 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${(percentage / 100) * 94} 94`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{score}</span>
                <span className="text-xs text-gray-400">/ 100</span>
              </div>
            </div>

            <p className={`text-lg font-bold mb-1 ${
              percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-500'
            }`}>
              {percentage >= 70 ? '🌟 Excellent!' : percentage >= 40 ? '👍 Good effort!' : '📚 Keep learning!'}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              You scored {score} out of 100 in {currentCat.name}
            </p>

            <button onClick={goNextCategory}
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
              {isLast ? '🎯 Complete Quiz' : `Next: ${categories[currentCatIndex + 1]?.name || 'Continue'} →`}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── COMPLETING PHASE ──
  if (phase === 'completing') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-4 animate-pulse">🤖</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing your results...</h3>
        <p className="text-gray-500 text-sm">AI is predicting your career path</p>
      </div>
    )
  }

  // ── COMPLETED PHASE ──
  if (phase === 'completed') {
    const answeredCats = Object.keys(categoryScores).filter(c => !skippedCategories.includes(c))
    const totalScore = answeredCats.length > 0
      ? answeredCats.reduce((sum, c) => sum + categoryScores[c], 0) / answeredCats.length
      : 0

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
          <div className="p-6 text-center text-white"
            style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold mb-1">Quiz Completed!</h2>
            <p className="text-green-100 text-sm">
              Time: {Math.floor(totalTime / 60)}m {totalTime % 60}s ·
              Tab switches: {tabSwitches}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                <p className="text-2xl font-bold" style={{color: '#0f4c35'}}>
                  {answeredCats.length}
                </p>
                <p className="text-xs text-gray-500">Answered</p>
              </div>
              <div className="p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                <p className="text-2xl font-bold" style={{color: '#0f4c35'}}>
                  {skippedCategories.length}
                </p>
                <p className="text-xs text-gray-500">Skipped</p>
              </div>
              <div className="p-3 rounded-xl" style={{background: '#f0fdf4'}}>
                <p className="text-2xl font-bold" style={{color: '#0f4c35'}}>
                  {totalScore.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500">Avg Score</p>
              </div>
            </div>

            {/* Score breakdown */}
            <h3 className="font-bold text-gray-800 mb-3">📊 Score Breakdown</h3>
            <div className="space-y-2 mb-6">
              {categories.map(cat => {
                const score = categoryScores[cat.code] || 0
                const skipped = skippedCategories.includes(cat.code)
                return (
                  <div key={cat.code} className="flex items-center gap-3">
                    <span className="text-sm w-5">{cat.icon}</span>
                    <span className="text-xs text-gray-600 w-32 truncate">{cat.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all"
                        style={{
                          width: `${score}%`,
                          background: skipped ? '#d1d5db' :
                            score >= 70 ? '#10b981' :
                            score >= 40 ? '#f59e0b' : '#ef4444'
                        }}>
                      </div>
                    </div>
                    <span className="text-xs font-semibold w-12 text-right"
                      style={{color: skipped ? '#9ca3af' : score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}}>
                      {skipped ? 'Skipped' : `${score}/100`}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 mb-5 text-sm text-teal-800 text-center">
              🤖 Career prediction will be available once your AI model is integrated!
            </div>

            <button
              onClick={() => onComplete && onComplete({ categoryScores, skippedCategories, totalScore })}
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{background: 'linear-gradient(135deg, #0f4c35, #10b981)'}}>
              View Job Recommendations →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4 animate-pulse">⏳</div>
      <p className="text-gray-500">Loading...</p>
    </div>
  )
}