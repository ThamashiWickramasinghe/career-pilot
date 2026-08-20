import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

const theme = {
  bg: '#f6f3ff', primary: '#5b56b5', primaryDark: '#4d48a3',
  softPurple: '#e9e7f8', white: '#ffffff', softPanel: '#f3f0fa',
  border: '#e6e3f2', mainText: '#25243a', secondaryText: '#85839a',
  green: '#5db192', softGreen: '#dffff0', blue: '#6f8fd4',
  softBlue: '#e3eafb', orange: '#e5a26d', softOrange: '#ffefe0',
}

const CATEGORIES = [
  { id: 'python', name: 'Python'},
  { id: 'javascript', name: 'JavaScript' },
  { id: 'web', name: 'Web Dev' },
  { id: 'database', name: 'Database'},
  { id: 'dsa', name: 'DSA' },
  { id: 'cybersecurity', name: 'Cybersecurity' },
  { id: 'cloud', name: 'Cloud' },
  { id: 'devops', name: 'DevOps' },
  { id: 'ml', name: 'Machine Learning' },
  { id: 'mobile', name: 'Mobile Dev' },
  { id: 'uiux', name: 'UI/UX' },
  { id: 'networking', name: 'Networking' },
]

const DIFFICULTIES = [
  { id: 'Beginner', color: theme.green, bg: theme.softGreen, time: 300, points: 50 },
  { id: 'Intermediate', color: theme.blue, bg: theme.softBlue, time: 420, points: 75 },
  { id: 'Advanced', color: theme.orange, bg: theme.softOrange, time: 600, points: 100 },
]

const CHALLENGE_TYPES = [
  { id: 'quiz', name: 'Quiz Challenge', desc: 'Multiple choice & theory questions' },
  { id: 'coding', name: 'Coding Challenge', desc: 'Write & explain code solutions' },
  { id: 'scenario', name: 'Scenario Challenge', desc: 'Real-world problem solving' },
]

const BADGE_RULES = [
  { name: 'First Steps', icon: '🌟', desc: 'Complete your first challenge', condition: (stats) => stats.total >= 1 },
  { name: 'Quick Learner', icon: '⚡', desc: 'Score 80+ on a Beginner challenge', condition: (s, session) => session?.difficulty === 'Beginner' && session?.score >= 80 },
  { name: 'Rising Star', icon: '🚀', desc: 'Score 80+ on an Intermediate challenge', condition: (s, session) => session?.difficulty === 'Intermediate' && session?.score >= 80 },
  { name: 'Elite Coder', icon: '👑', desc: 'Score 80+ on an Advanced challenge', condition: (s, session) => session?.difficulty === 'Advanced' && session?.score >= 80 },
  { name: 'Perfect Score', icon: '💯', desc: 'Score 100 on any challenge', condition: (s, session) => session?.score === 100 },
  { name: 'Challenger', icon: '🏆', desc: 'Complete 5 challenges', condition: (stats) => stats.total >= 5 },
  { name: 'Dedicated', icon: '💪', desc: 'Complete 10 challenges', condition: (stats) => stats.total >= 10 },
]

// Icons
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
)
const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
  </svg>
)
const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)
const HistoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M12 3.75l8.25 14.25H3.75L12 3.75z" />
  </svg>
)

// Extract the first {...} JSON block from a model response, tolerant of
// stray markdown code fences or leading/trailing commentary.
function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Response did not contain valid JSON.')
  return JSON.parse(match[0])
}

// Rebuild the traditional Q/A/Explanation text block from parsed quiz
// questions. Used ONLY internally to feed the evaluator prompt — never
// rendered to the screen, so the answer key is never shown to the player.
function buildQuizAnswerKey(questions) {
  return questions.map((q, i) => {
    const opts = Object.entries(q.options).map(([k, v]) => `${k}) ${v}`).join('\n')
    return `Q${i + 1}: ${q.question}\n${opts}\nAnswer: ${q.answer}\nExplanation: ${q.explanation}`
  }).join('\n\n')
}

export default function SkillChallenge() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('play')
  const [phase, setPhase] = useState('setup') // setup | playing | result
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [challenge, setChallenge] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [timeTaken, setTimeTaken] = useState(0)
  const [history, setHistory] = useState([])
  const [badges, setBadges] = useState([])
  const [stats, setStats] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (activeTab === 'history') fetchHistory()
    if (activeTab === 'badges') fetchBadges()
    if (activeTab === 'stats') fetchStats()
  }, [activeTab])

  useEffect(() => {
    if (phase === 'playing' && challenge) {
      const diff = DIFFICULTIES.find(d => d.id === selectedDifficulty)
      setTimeLeft(diff?.time || 300)
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleTimeout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase, challenge])

  // ── Calls our own Flask backend, which holds the Gemini key server-side ──
  const callGemini = async (prompt, options = {}) => {
    const token = localStorage.getItem('token') // adjust to match your app's stored JWT key

    const response = await fetch('http://localhost:5000/api/ai/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        prompt,
        temperature: options.temperature ?? 0.8,
        max_tokens: options.maxTokens ?? 1500
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('generate-content API error:', data)
      throw new Error(data.error || `Request failed with status ${response.status}`)
    }

    if (!data.text) {
      console.error('No text in response:', data)
      throw new Error('Server returned an empty response.')
    }

    return data.text
  }

  const generateChallenge = async () => {
    if (!selectedCategory || !selectedDifficulty || !selectedType) return
    setLoading(true)
    setErrorMsg(null)

    const cat = CATEGORIES.find(c => c.id === selectedCategory)
    const typeLabel = CHALLENGE_TYPES.find(t => t.id === selectedType)?.name
    const title = `${cat?.name} ${selectedDifficulty} ${typeLabel}`

    try {
      if (selectedType === 'quiz') {
        // ── Quiz: request structured JSON so we can hide answers/explanations from the player ──
        const prompt = `Generate a ${selectedDifficulty} level multiple choice quiz for ${cat?.name}.

Return ONLY valid JSON (no markdown code fences, no extra text) in exactly this structure:
{
  "questions": [
    {
      "question": "question text",
      "options": { "A": "option text", "B": "option text", "C": "option text", "D": "option text" },
      "answer": "A",
      "explanation": "brief explanation of why this is correct"
    }
  ]
}

Include exactly 3 questions, progressively harder.`

        const raw = await callGemini(prompt, { temperature: 0.8, maxTokens: 1500 })
        const parsed = extractJson(raw)
        if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          throw new Error('Quiz response was missing questions.')
        }

        setChallenge({
          type: 'quiz',
          category: cat?.name,
          difficulty: selectedDifficulty,
          questions: parsed.questions,
          title
        })
      } else {
        const prompt = selectedType === 'coding'
          ? `Create a practical coding challenge for ${cat?.name} at ${selectedDifficulty} level. Include:
TITLE: [challenge title]
PROBLEM: [clear problem statement]
REQUIREMENTS: [2-3 specific requirements]
EXAMPLE INPUT/OUTPUT: [if applicable]
HINT: [one helpful hint]
Keep it practical and achievable in ${DIFFICULTIES.find(d => d.id === selectedDifficulty)?.time / 60} minutes.
Return ONLY the challenge content, no extra text.`
          : `Create a real-world scenario challenge for ${cat?.name} at ${selectedDifficulty} level. Include:
TITLE: [scenario title]
SCENARIO: [realistic workplace scenario - 2-3 sentences]
CHALLENGE: [what they need to solve/decide]
CONTEXT: [additional technical context]
EVALUATION CRITERIA: [what makes a good answer]
Make it realistic and industry-relevant.
Return ONLY the challenge content, no extra text.`

        const content = await callGemini(prompt, { temperature: 0.8, maxTokens: 1500 })
        setChallenge({
          type: selectedType,
          category: cat?.name,
          difficulty: selectedDifficulty,
          content,
          title
        })
      }

      setPhase('playing')
      setUserAnswer('')
    } catch (err) {
      console.error('Challenge generation failed:', err)
      setErrorMsg(`Couldn't generate a challenge: ${err.message}`)
    }
    setLoading(false)
  }

  const handleTimeout = () => {
    clearInterval(timerRef.current)
    const taken = Math.floor((Date.now() - startTimeRef.current) / 1000)
    setTimeTaken(taken)
    submitAnswer(true)
  }

  const submitAnswer = async (timedOut = false) => {
    clearInterval(timerRef.current)
    setSubmitting(true)
    setErrorMsg(null)
    const taken = Math.floor((Date.now() - startTimeRef.current) / 1000)
    setTimeTaken(taken)

    const diff = DIFFICULTIES.find(d => d.id === selectedDifficulty)

    // For quiz challenges the answer key was never shown to the player —
    // rebuild it here, server-side of the prompt, purely for evaluation.
    const challengeTextForEval = challenge?.type === 'quiz'
      ? buildQuizAnswerKey(challenge.questions)
      : challenge?.content

    const evalPrompt = `You are evaluating a ${challenge?.difficulty} ${challenge?.type} challenge response.

CHALLENGE:
${challengeTextForEval}

USER'S ANSWER:
${timedOut ? '[Time ran out - no answer submitted]' : userAnswer || '[No answer provided]'}

Evaluate and respond in this EXACT JSON format:
{
  "score": [0-100 integer based on correctness, completeness, quality],
  "grade": "[A/B/C/D/F]",
  "correct": [true/false],
  "strengths": ["point 1", "point 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "feedback": "[2-3 sentences of encouraging, specific feedback]",
  "sample_answer": "[brief model answer or key points]"
}

Be fair but strict. Score based on technical accuracy and completeness.`

    try {
      const evalText = await callGemini(evalPrompt, { temperature: 0.7, maxTokens: 1500 })
      const evaluation = extractJson(evalText)

      // Determine badge
      const totalAfter = (stats?.total_challenges || 0) + 1
      const sessionData = {
        difficulty: selectedDifficulty,
        score: evaluation.score
      }
      let badgeEarned = null
      let badgeIcon = ''
      let badgeDesc = ''

      for (const rule of BADGE_RULES) {
        const earned = rule.condition({ total: totalAfter }, sessionData)
        if (earned) {
          const alreadyHas = badges.some(b => b.badge_name === rule.name)
          if (!alreadyHas) {
            badgeEarned = rule.name
            badgeIcon = rule.icon
            badgeDesc = rule.desc
            break
          }
        }
      }

      const sessionResult = {
        category: challenge.category,
        difficulty: challenge.difficulty,
        challenge_type: challenge.type,
        challenge_title: challenge.title,
        challenge_content: challengeTextForEval,
        user_answer: userAnswer,
        ai_feedback: JSON.stringify(evaluation),
        score: evaluation.score,
        max_score: 100,
        time_taken: taken,
        time_limit: diff?.time || 300,
        status: timedOut ? 'timed_out' : 'completed',
        badge_earned: badgeEarned,
        badge_icon: badgeIcon,
        badge_description: badgeDesc,
      }

      // Save to backend
      try {
        await API.post('/challenge/save', sessionResult)
      } catch (err) {
        console.error('Save failed:', err)
      }

      setResult({ evaluation, badgeEarned, badgeIcon, badgeDesc, timedOut, timeTaken: taken })
      setPhase('result')
    } catch (err) {
      console.error('Evaluation error:', err)
      setErrorMsg(`Couldn't evaluate your answer: ${err.message}. Please try submitting again.`)
    }
    setSubmitting(false)
  }

  const fetchHistory = async () => {
    try {
      const res = await API.get('/challenge/history')
      setHistory(res.data.sessions)
    } catch (err) { console.error(err) }
  }

  const fetchBadges = async () => {
    try {
      const res = await API.get('/challenge/badges')
      setBadges(res.data.badges)
    } catch (err) { console.error(err) }
  }

  const fetchStats = async () => {
    try {
      const res = await API.get('/challenge/stats')
      setStats(res.data)
    } catch (err) { console.error(err) }
  }

  const resetChallenge = () => {
    clearInterval(timerRef.current)
    setPhase('setup')
    setChallenge(null)
    setUserAnswer('')
    setResult(null)
    setSelectedCategory(null)
    setSelectedDifficulty(null)
    setSelectedType(null)
    setTimeLeft(300)
    setErrorMsg(null)
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const timerColor = timeLeft > 120 ? theme.green : timeLeft > 30 ? theme.orange : '#dc2626'
  const timerBg = timeLeft > 120 ? theme.softGreen : timeLeft > 30 ? theme.softOrange : '#fee2e2'

  const tabs = [
    { id: 'play', label: 'Play', icon: <PlayIcon /> },
    { id: 'stats', label: 'Stats', icon: <ChartIcon /> },
    { id: 'history', label: 'History', icon: <HistoryIcon /> },
    { id: 'badges', label: 'Badges', icon: <TrophyIcon /> },
  ]

  return (
    <div className="min-h-screen" style={{background: theme.bg}}>
      <div className="max-w-5xl mx-auto px-5 py-7">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-xl font-bold" style={{color: theme.mainText}}>Live Skill Challenge</h1>
            </div>
          </div>
          {phase !== 'setup' && (
            <button onClick={resetChallenge}
              className="px-4 py-2 rounded-xl text-sm font-medium transition"
              style={{background: theme.softPurple, color: theme.primary}}>
              New Challenge
            </button>
          )}
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 rounded-2xl mb-5"
            style={{background: '#fee2e2', border: '1px solid #fca5a5'}}>
            <div style={{color: '#dc2626'}}><AlertIcon /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{color: '#991b1b'}}>Something went wrong</p>
              <p className="text-xs mt-0.5" style={{color: '#991b1b'}}>{errorMsg}</p>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-xs font-bold" style={{color: '#991b1b'}}>
              Dismiss
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 p-1.5 rounded-2xl"
          style={{background: theme.white, border: `1px solid ${theme.border}`}}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === 'play') resetChallenge() }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition"
              style={activeTab === tab.id
                ? {background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`, color: 'white'}
                : {color: theme.secondaryText}}>
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── PLAY TAB ── */}
        {activeTab === 'play' && (
          <div>
            {/* SETUP */}
            {phase === 'setup' && (
              <div className="space-y-6">

                {/* Step 1: Category */}
                <div className="rounded-2xl p-6"
                  style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{background: theme.primary}}>1</div>
                    <h3 className="font-bold" style={{color: theme.mainText}}>Choose Category</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {CATEGORIES.map(cat => (
                      <button key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition hover:shadow-sm"
                        style={{
                          background: selectedCategory === cat.id ? theme.softPurple : theme.softPanel,
                          border: `1px solid ${selectedCategory === cat.id ? theme.primary : theme.border}`,
                          color: selectedCategory === cat.id ? theme.primary : theme.mainText,
                          fontWeight: selectedCategory === cat.id ? '700' : '500'
                        }}>
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-center leading-tight">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Difficulty */}
                <div className="rounded-2xl p-6"
                  style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{background: theme.primary}}>2</div>
                    <h3 className="font-bold" style={{color: theme.mainText}}>Select Difficulty</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {DIFFICULTIES.map(diff => (
                      <button key={diff.id}
                        onClick={() => setSelectedDifficulty(diff.id)}
                        className="p-4 rounded-xl text-left transition hover:shadow-sm"
                        style={{
                          background: selectedDifficulty === diff.id ? diff.bg : theme.softPanel,
                          border: `2px solid ${selectedDifficulty === diff.id ? diff.color : theme.border}`,
                        }}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-sm" style={{color: diff.color}}>{diff.id}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{background: diff.bg, color: diff.color}}>
                            {diff.points}pts
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs" style={{color: theme.secondaryText}}>
                          <ClockIcon />
                          <span>{diff.time / 60} min</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Type */}
                <div className="rounded-2xl p-6"
                  style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{background: theme.primary}}>3</div>
                    <h3 className="font-bold" style={{color: theme.mainText}}>Challenge Type</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {CHALLENGE_TYPES.map(type => (
                      <button key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className="p-4 rounded-xl text-left transition hover:shadow-sm"
                        style={{
                          background: selectedType === type.id ? theme.softPurple : theme.softPanel,
                          border: `2px solid ${selectedType === type.id ? theme.primary : theme.border}`,
                        }}>
                        <p className="font-bold text-sm mb-1"
                          style={{color: selectedType === type.id ? theme.primary : theme.mainText}}>
                          {type.name}
                        </p>
                        <p className="text-xs" style={{color: theme.secondaryText}}>{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={generateChallenge}
                  disabled={!selectedCategory || !selectedDifficulty || !selectedType || loading}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-3 disabled:opacity-40 transition hover:opacity-90"
                  style={{background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Challenge...
                    </>
                  ) : (
                    <>
                      <PlayIcon />
                      Start Challenge
                    </>
                  )}
                </button>
              </div>
            )}

            {/* PLAYING */}
            {phase === 'playing' && challenge && (
              <div className="space-y-4">

                {/* Timer & Meta */}
                <div className="flex items-center justify-between p-4 rounded-2xl"
                  style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{background: theme.softPurple, color: theme.primary}}>
                      {challenge.category}
                    </span>
                    {(() => {
                      const diff = DIFFICULTIES.find(d => d.id === challenge.difficulty)
                      return (
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{background: diff?.bg, color: diff?.color}}>
                          {challenge.difficulty}
                        </span>
                      )
                    })()}
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{background: theme.softPanel, color: theme.mainText}}>
                      {CHALLENGE_TYPES.find(t => t.id === challenge.type)?.name}
                    </span>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg"
                    style={{background: timerBg, color: timerColor}}>
                    <ClockIcon />
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Challenge Content */}
                <div className="rounded-2xl p-6"
                  style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <h3 className="font-bold text-lg mb-4" style={{color: theme.mainText}}>
                    {challenge.title}
                  </h3>

                  {challenge.type === 'quiz' ? (
                    // ── Quiz: render questions + options only. No answer or explanation here. ──
                    <div className="space-y-4 mb-5">
                      {challenge.questions.map((q, i) => (
                        <div key={i} className="p-4 rounded-xl"
                          style={{background: theme.softPanel, border: `1px solid ${theme.border}`}}>
                          <p className="text-sm font-semibold mb-2" style={{color: theme.mainText}}>
                            Q{i + 1}: {q.question}
                          </p>
                          <div className="space-y-1">
                            {Object.entries(q.options).map(([letter, text]) => (
                              <p key={letter} className="text-sm" style={{color: theme.mainText}}>
                                <span className="font-semibold">{letter})</span> {text}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl mb-5"
                      style={{background: theme.softPanel, border: `1px solid ${theme.border}`}}>
                      <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans"
                        style={{color: theme.mainText}}>
                        {challenge.content}
                      </pre>
                    </div>
                  )}

                  {/* Answer Area */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{color: theme.mainText}}>
                      Your Answer
                    </label>
                    <textarea
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      rows={8}
                      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 font-mono"
                      style={{
                        background: theme.softPanel,
                        border: `1px solid ${theme.border}`,
                        color: theme.mainText,
                        resize: 'vertical'
                      }}
                      placeholder={
                        challenge.type === 'coding'
                          ? '// Write your code solution here...\n// Explain your approach and logic'
                          : challenge.type === 'quiz'
                          ? 'Answer each question:\nQ1: [A/B/C/D]\nQ2: [A/B/C/D]\nQ3: [A/B/C/D]'
                          : 'Describe your approach to this scenario...\nInclude technical steps, tools you would use, and your reasoning.'
                      }
                    />
                  </div>
                </div>

                {/* Submit */}
                <button onClick={() => submitAnswer(false)}
                  disabled={!userAnswer.trim() || submitting}
                  className="w-full py-3.5 rounded-2xl font-bold text-white disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      AI Evaluating...
                    </>
                  ) : 'Submit & Get AI Feedback'}
                </button>
              </div>
            )}

            {/* RESULT */}
            {phase === 'result' && result && (
              <div className="space-y-4">

                {/* Score Card */}
                <div className="rounded-2xl overflow-hidden"
                  style={{border: `1px solid ${theme.border}`}}>
                  <div className="p-6 text-center text-white"
                    style={{background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                    <p className="text-sm mb-2 opacity-80">
                      {result.timedOut ? 'Time ran out!' : 'Challenge Complete!'}
                    </p>
                    <div className="text-7xl font-bold mb-1">{result.evaluation.score}</div>
                    <p className="text-sm opacity-80">out of 100</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold"
                        style={{background: 'rgba(255,255,255,0.2)'}}>
                        Grade: {result.evaluation.grade}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold"
                        style={{background: 'rgba(255,255,255,0.2)'}}>
                        Time: {formatTime(result.timeTaken)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6" style={{background: theme.white}}>

                    {/* Badge Earned */}
                    {result.badgeEarned && (
                      <div className="p-4 rounded-xl mb-5 text-center"
                        style={{background: theme.softOrange, border: `1px solid ${theme.orange}40`}}>
                        <p className="text-3xl mb-1">{result.badgeIcon}</p>
                        <p className="font-bold" style={{color: theme.orange}}>
                          New Badge: {result.badgeEarned}
                        </p>
                        <p className="text-xs mt-1" style={{color: theme.orange}}>{result.badgeDesc}</p>
                      </div>
                    )}

                    {/* Feedback */}
                    <div className="p-4 rounded-xl mb-4"
                      style={{background: theme.softPanel}}>
                      <p className="text-sm font-semibold mb-2" style={{color: theme.mainText}}>
                        AI Feedback
                      </p>
                      <p className="text-sm leading-relaxed" style={{color: theme.mainText}}>
                        {result.evaluation.feedback}
                      </p>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-xl" style={{background: theme.softGreen}}>
                        <p className="text-xs font-bold mb-2" style={{color: theme.green}}>Strengths</p>
                        {result.evaluation.strengths?.map((s, i) => (
                          <p key={i} className="text-xs mb-1 flex items-start gap-1.5" style={{color: theme.green}}>
                            <span className="mt-0.5">✓</span> {s}
                          </p>
                        ))}
                        {(!result.evaluation.strengths || result.evaluation.strengths.length === 0) && (
                          <p className="text-xs" style={{color: theme.green}}>Keep practicing!</p>
                        )}
                      </div>
                      <div className="p-3 rounded-xl" style={{background: theme.softOrange}}>
                        <p className="text-xs font-bold mb-2" style={{color: theme.orange}}>Improve On</p>
                        {result.evaluation.improvements?.map((s, i) => (
                          <p key={i} className="text-xs mb-1 flex items-start gap-1.5" style={{color: theme.orange}}>
                            <span className="mt-0.5">→</span> {s}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Sample Answer */}
                    {result.evaluation.sample_answer && (
                      <div className="p-4 rounded-xl"
                        style={{background: theme.softBlue, border: `1px solid ${theme.blue}30`}}>
                        <p className="text-xs font-bold mb-2" style={{color: theme.blue}}>
                          Model Answer / Key Points
                        </p>
                        <p className="text-xs leading-relaxed" style={{color: theme.blue}}>
                          {result.evaluation.sample_answer}
                        </p>
                      </div>
                    )}

                    {/* Full answer key — shown only now, after submission */}
                    {challenge?.type === 'quiz' && (
                      <div className="mt-4 p-4 rounded-xl"
                        style={{background: theme.softPanel, border: `1px solid ${theme.border}`}}>
                        <p className="text-xs font-bold mb-3" style={{color: theme.mainText}}>
                          Correct Answers
                        </p>
                        <div className="space-y-3">
                          {challenge.questions.map((q, i) => (
                            <div key={i}>
                              <p className="text-xs font-semibold" style={{color: theme.mainText}}>
                                Q{i + 1}: {q.question}
                              </p>
                              <p className="text-xs mt-0.5" style={{color: theme.green}}>
                                Correct answer: {q.answer}) {q.options[q.answer]}
                              </p>
                              <p className="text-xs mt-0.5" style={{color: theme.secondaryText}}>
                                {q.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={resetChallenge}
                    className="py-3 rounded-xl font-bold text-white"
                    style={{background: `linear-gradient(135deg, ${theme.primary}, ${theme.blue})`}}>
                    Try Another
                  </button>
                  <button onClick={() => { setActiveTab('history'); fetchHistory() }}
                    className="py-3 rounded-xl font-bold border"
                    style={{color: theme.primary, borderColor: theme.primary, background: theme.softPurple}}>
                    View History
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STATS TAB ── */}
        {activeTab === 'stats' && (
          <div className="space-y-5">
            {!stats ? (
              <div className="text-center py-16 rounded-2xl"
                style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <div className="w-12 h-12 border-4 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"
                  style={{borderColor: theme.softPurple, borderTopColor: theme.primary}}></div>
                <p style={{color: theme.secondaryText}}>Loading stats...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Challenges', value: stats.total_challenges, color: theme.primary, bg: theme.softPurple },
                    { label: 'Avg Score', value: `${stats.avg_score}%`, color: theme.blue, bg: theme.softBlue },
                    { label: 'Best Score', value: `${stats.best_score}%`, color: theme.green, bg: theme.softGreen },
                    { label: 'Badges Earned', value: stats.total_badges, color: theme.orange, bg: theme.softOrange },
                  ].map((s, i) => (
                    <div key={i} className="rounded-2xl p-5 text-center"
                      style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                      <p className="text-3xl font-bold mb-1" style={{color: s.color}}>{s.value}</p>
                      <p className="text-xs" style={{color: theme.secondaryText}}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl p-6"
                  style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <h3 className="font-bold mb-4" style={{color: theme.mainText}}>By Difficulty</h3>
                  {DIFFICULTIES.map(diff => {
                    const count = stats.by_difficulty?.[diff.id] || 0
                    const max = stats.total_challenges || 1
                    return (
                      <div key={diff.id} className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold w-24" style={{color: diff.color}}>
                          {diff.id}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                          <div className="h-2.5 rounded-full transition-all"
                            style={{width: `${(count / max) * 100}%`, background: diff.color}}></div>
                        </div>
                        <span className="text-xs font-bold w-8 text-right" style={{color: diff.color}}>
                          {count}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {Object.keys(stats.by_category || {}).length > 0 && (
                  <div className="rounded-2xl p-6"
                    style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                    <h3 className="font-bold mb-4" style={{color: theme.mainText}}>By Category</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(stats.by_category).map(([cat, count]) => (
                        <div key={cat} className="flex items-center justify-between p-3 rounded-xl"
                          style={{background: theme.softPanel}}>
                          <span className="text-xs font-medium" style={{color: theme.mainText}}>{cat}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{background: theme.softPurple, color: theme.primary}}>
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div>
            {history.length === 0 ? (
              <div className="text-center py-16 rounded-2xl"
                style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{background: theme.softPurple}}>
                  <HistoryIcon />
                </div>
                <h3 className="font-bold mb-2" style={{color: theme.mainText}}>No challenges yet</h3>
                <p className="text-sm mb-4" style={{color: theme.secondaryText}}>
                  Complete your first challenge to see history
                </p>
                <button onClick={() => setActiveTab('play')}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                  style={{background: theme.primary}}>
                  Start Playing
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(session => {
                  const diff = DIFFICULTIES.find(d => d.id === session.difficulty)
                  let feedback = {}
                  try { feedback = JSON.parse(session.ai_feedback) } catch (e) {}
                  return (
                    <div key={session.id} className="rounded-2xl p-5"
                      style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{background: theme.softPurple, color: theme.primary}}>
                              {session.category}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{background: diff?.bg, color: diff?.color}}>
                              {session.difficulty}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{background: theme.softPanel, color: theme.mainText}}>
                              {session.challenge_type}
                            </span>
                            {session.badge_earned && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                style={{background: theme.softOrange, color: theme.orange}}>
                                {session.badge_earned}
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-sm mb-1" style={{color: theme.mainText}}>
                            {session.challenge_title}
                          </p>
                          {feedback.feedback && (
                            <p className="text-xs line-clamp-2" style={{color: theme.secondaryText}}>
                              {feedback.feedback}
                            </p>
                          )}
                          <p className="text-xs mt-2" style={{color: theme.secondaryText}}>
                            {new Date(session.completed_at).toLocaleDateString()} ·{' '}
                            {Math.floor(session.time_taken / 60)}m {session.time_taken % 60}s
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold" style={{
                            color: session.score >= 80 ? theme.green
                              : session.score >= 50 ? theme.orange : '#dc2626'
                          }}>
                            {session.score}
                          </p>
                          <p className="text-xs" style={{color: theme.secondaryText}}>/ 100</p>
                          {feedback.grade && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{background: theme.softPurple, color: theme.primary}}>
                              {feedback.grade}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── BADGES TAB ── */}
        {activeTab === 'badges' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
              {badges.map(badge => (
                <div key={badge.id} className="rounded-2xl p-5 text-center"
                  style={{background: theme.white, border: `1px solid ${theme.border}`}}>
                  <div className="text-4xl mb-2">{badge.badge_icon}</div>
                  <p className="font-bold text-sm mb-1" style={{color: theme.mainText}}>{badge.badge_name}</p>
                  <p className="text-xs mb-2" style={{color: theme.secondaryText}}>{badge.badge_description}</p>
                  <div className="flex justify-center gap-1.5 flex-wrap">
                    {badge.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{background: theme.softPurple, color: theme.primary}}>
                        {badge.category}
                      </span>
                    )}
                    {badge.difficulty && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: DIFFICULTIES.find(d => d.id === badge.difficulty)?.bg || theme.softPanel,
                          color: DIFFICULTIES.find(d => d.id === badge.difficulty)?.color || theme.mainText
                        }}>
                        {badge.difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-2" style={{color: theme.secondaryText}}>
                    {new Date(badge.earned_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* All Possible Badges */}
            <div className="rounded-2xl p-6"
              style={{background: theme.white, border: `1px solid ${theme.border}`}}>
              <h3 className="font-bold mb-4" style={{color: theme.mainText}}>All Badges</h3>
              <div className="space-y-2">
                {BADGE_RULES.map(rule => {
                  const earned = badges.some(b => b.badge_name === rule.name)
                  return (
                    <div key={rule.name} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{background: earned ? theme.softGreen : theme.softPanel}}>
                      <span className="text-2xl"
                        style={{filter: earned ? 'none' : 'grayscale(1) opacity(0.4)'}}>
                        {rule.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{color: earned ? theme.green : theme.mainText}}>
                          {rule.name}
                        </p>
                        <p className="text-xs" style={{color: theme.secondaryText}}>{rule.desc}</p>
                      </div>
                      {earned && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{background: theme.green, color: 'white'}}>
                          Earned
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
