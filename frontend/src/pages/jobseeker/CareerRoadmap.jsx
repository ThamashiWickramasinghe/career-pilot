import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

// ============================================================
// COLOR TOKENS — DO NOT CHANGE
// ============================================================
const theme = {
  bg: '#f6f3ff',
  primary: '#5b56b5',
  primaryDark: '#4d48a3',
  softPurple: '#e9e7f8',
  white: '#ffffff',
  softPanel: '#f3f0fa',
  border: '#e6e3f2',
  mainText: '#25243a',
  secondaryText: '#85839a',
  green: '#5db192',
  softGreen: '#dffff0',
  blue: '#6f8fd4',
  softBlue: '#e3eafb',
  orange: '#e5a26d',
  softOrange: '#ffefe0',
}

const FONT_DISPLAY = "'Sora', system-ui, sans-serif"
const FONT_BODY = "'Inter', system-ui, sans-serif"

// ============================================================
// ACCENTS
// ============================================================
const ACCENTS = [
  {
    bg: theme.softPurple,
    text: theme.primaryDark,
    bar: theme.primary,
  },
  {
    bg: theme.softGreen,
    text: '#2f7d5e',
    bar: theme.green,
  },
  {
    bg: theme.softBlue,
    text: '#3f5fa8',
    bar: theme.blue,
  },
  {
    bg: theme.softOrange,
    text: '#a56b3c',
    bar: theme.orange,
  },
]

// ============================================================
// QUESTIONS
// ============================================================
const QUESTIONS = [
  {
    id: 'career',
    question: 'What is your target IT career?',
    placeholder:
      'e.g. Full Stack Developer, Data Scientist, DevOps Engineer...',
  },
  {
    id: 'experience',
    question: 'What is your current experience level?',
    placeholder:
      'e.g. Complete beginner, 1 year experience, 3 years in backend...',
  },
  {
    id: 'skills',
    question: 'What technical skills do you currently have?',
    placeholder:
      'e.g. Python basics, HTML/CSS, some JavaScript...',
  },
  {
    id: 'timeline',
    question: 'What is your target timeline to achieve this career?',
    placeholder:
      'e.g. 6 months, 1 year, 2 years...',
  },
  {
    id: 'goal',
    question: 'What is your main goal? (job, freelance, startup, etc.)',
    placeholder:
      'e.g. Get a job at a tech company, start freelancing...',
  },
]

// ============================================================
// ICON SET
// ============================================================
const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

const IconSend = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <path d="M4 12l16-7-6.5 16-2.5-7-7-2z" />
  </svg>
)

const IconCompass = (p) => (
  <svg className="w-5 h-5" {...iconProps} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.5 9.5l-2 5-5 2 2-5z" />
  </svg>
)

const IconSpark = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
  </svg>
)

const IconRefresh = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <path d="M20 11a8 8 0 10-2.2 5.6M20 11V6M20 11h-5" />
  </svg>
)

const IconChevron = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

const IconUser = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
  </svg>
)

const IconAdvisor = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <rect x="4" y="7" width="16" height="12" rx="3" />
    <path d="M9 13h.01M15 13h.01M9 4v3M15 4v3" />
  </svg>
)

const IconDownload = (p) => (
  <svg className="w-3.5 h-3.5" {...iconProps} {...p}>
    <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
  </svg>
)

const IconClock = (p) => (
  <svg className="w-3.5 h-3.5" {...iconProps} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)

const IconTarget = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="0.7" fill="currentColor" />
  </svg>
)

const IconGap = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <path d="M4 20V10M11 20V4M18 20v-7" />
  </svg>
)

const IconBook = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <path d="M4 5.5A2.5 2.5 0 016.5 3H12v17H6.5A2.5 2.5 0 004 17.5v-12z" />
    <path d="M20 5.5A2.5 2.5 0 0017.5 3H12v17h5.5a2.5 2.5 0 002.5-2.5v-12z" />
  </svg>
)

const IconCoin = (p) => (
  <svg className="w-4 h-4" {...iconProps} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v8M9.5 10a2 2 0 012-1.5h1a2 2 0 010 4h-1a2 2 0 000 4h1a2 2 0 002-1.5" />
  </svg>
)

// ============================================================
// CAREER PATH ICONS
// ============================================================
const IconCode = (p) => (
  <svg className="w-5 h-5" {...iconProps} {...p}>
    <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
  </svg>
)

const IconChartBar = (p) => (
  <svg className="w-5 h-5" {...iconProps} {...p}>
    <path d="M4 20V12M10 20V6M16 20v-9M4 20h16" />
  </svg>
)

const IconCloudGear = (p) => (
  <svg className="w-5 h-5" {...iconProps} {...p}>
    <path d="M7 17a4 4 0 01-.5-7.97A5 5 0 0116.5 8 4 4 0 0117 17H7z" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </svg>
)

const IconPenTool = (p) => (
  <svg className="w-5 h-5" {...iconProps} {...p}>
    <path d="M3 21l3-1 10-10-2-2L4 18l-1 3z" />
    <path d="M14 6l4 4M16 3l5 5" />
  </svg>
)

const IconShield = (p) => (
  <svg className="w-5 h-5" {...iconProps} {...p}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9.5 12l2 2 3.5-4" />
  </svg>
)

const IconMobile = (p) => (
  <svg className="w-5 h-5" {...iconProps} {...p}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
    <path d="M11 18h2" />
  </svg>
)

// ============================================================
// QUICK PROMPTS
// ============================================================
const QUICK_PROMPTS = [
  {
    label: 'Full Stack Developer',
    icon: IconCode,
    desc: 'Web development career path',
  },
  {
    label: 'Data Scientist',
    icon: IconChartBar,
    desc: 'ML & AI career path',
  },
  {
    label: 'DevOps Engineer',
    icon: IconCloudGear,
    desc: 'Cloud & automation path',
  },
  {
    label: 'UI/UX Designer',
    icon: IconPenTool,
    desc: 'Design career path',
  },
  {
    label: 'Cybersecurity Analyst',
    icon: IconShield,
    desc: 'Security career path',
  },
  {
    label: 'Mobile Developer',
    icon: IconMobile,
    desc: 'iOS & Android path',
  },
]

// ============================================================
// FEATURES
// ============================================================
const FEATURES = [
  {
    icon: IconTarget,
    text: 'A personalized, phase-by-phase roadmap',
  },
  {
    icon: IconGap,
    text: 'Clear view of your current skill gaps',
  },
  {
    icon: IconBook,
    text: 'Curated learning resources and projects',
  },
  {
    icon: IconCoin,
    text: 'Realistic salary and job-market insight',
  },
]

// ============================================================
// ROLE TAG — unified, muted label chip
// ============================================================
function RoleTag({ label, dotColor }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase"
      style={{
        background: theme.softPanel,
        color: theme.secondaryText,
        border: `1px solid ${theme.border}`,
        fontFamily: FONT_DISPLAY,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: dotColor }}
      />
      {label}
    </span>
  )
}

// ============================================================
// ROADMAP RENDERER
// ============================================================
function RoadmapRenderer({ content }) {
  const lines = content.split('\n')

  let phaseIndex = -1
  let currentAccent = ACCENTS[0]
  let prevBlank = true // suppress a leading gap at the very top

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // --------------------------------------------------------
        // Blank lines — collapse runs of them into a single gap
        // --------------------------------------------------------
        if (!line.trim()) {
          if (prevBlank) return null
          prevBlank = true
          return <div key={i} className="h-2" />
        }

        // --------------------------------------------------------
        // Markdown horizontal rules (---, ***, ___) — drop entirely,
        // phase headers already carry their own spacing/divider
        // --------------------------------------------------------
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
          return null
        }

        prevBlank = false

        // --------------------------------------------------------
        // Phase headers
        // --------------------------------------------------------
        if (line.startsWith('## ') || line.startsWith('# ')) {
          const text = line
            .replace(/^##? /, '')
            .replace(/\*\*/g, '')

          phaseIndex += 1
          currentAccent = ACCENTS[phaseIndex % ACCENTS.length]

          return (
            <div
              key={i}
              className="mt-6 mb-3 flex items-stretch gap-3"
            >
              <div
                className="w-1 rounded-full flex-shrink-0"
                style={{
                  background: currentAccent.bar,
                }}
              />

              <div
                className="flex-1 flex items-center justify-between py-3 px-4 rounded-lg"
                style={{
                  background: currentAccent.bg,
                  border: `1px solid ${currentAccent.bar}30`,
                }}
              >
                <h3
                  className="font-bold text-base"
                  style={{
                    color: currentAccent.text,
                    fontFamily: FONT_DISPLAY,
                  }}
                >
                  {text}
                </h3>

                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: currentAccent.text,
                    opacity: 0.75,
                  }}
                >
                  Stage {String(phaseIndex + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          )
        }

        // --------------------------------------------------------
        // Bold headers
        // --------------------------------------------------------
        if (line.match(/^\*\*[^*]+\*\*:?$/)) {
          const text = line
            .replace(/\*\*/g, '')
            .replace(/:$/, '')

          return (
            <div key={i} className="mt-5 mb-2">
              <h4
                className="font-bold text-sm"
                style={{
                  color: theme.mainText,
                  fontFamily: FONT_DISPLAY,
                }}
              >
                {text}
              </h4>
            </div>
          )
        }

        // --------------------------------------------------------
        // Numbered list
        // --------------------------------------------------------
        if (line.match(/^\d+\./)) {
          const text = line
            .replace(/^\d+\.\s*/, '')
            .replace(/\*\*/g, '')

          const num = line.match(/^(\d+)\./)?.[1]

          return (
            <div
              key={i}
              className="flex items-start gap-3 py-2 px-3 rounded-lg"
              style={{
                background: theme.softPanel,
                border: `1px solid ${theme.border}`,
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mt-0.5"
                style={{
                  background: currentAccent.bar,
                }}
              >
                {num}
              </span>

              <p
                className="text-sm leading-relaxed"
                style={{
                  color: theme.mainText,
                }}
              >
                {text}
              </p>
            </div>
          )
        }

        // --------------------------------------------------------
        // Bullet points
        // --------------------------------------------------------
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const text = line
            .replace(/^[-*] /, '')
            .replace(/\*\*/g, '')

          return (
            <div
              key={i}
              className="flex items-start gap-2.5 py-1.5 pl-2"
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                style={{
                  background: currentAccent.bar,
                }}
              />

              <p
                className="text-sm leading-relaxed"
                style={{
                  color: theme.mainText,
                }}
              >
                {text}
              </p>
            </div>
          )
        }

        // --------------------------------------------------------
        // Time / duration indicators — only short, label-like lines
        // (e.g. "Duration: 2 months", "Weeks 1-2"), never long
        // descriptive sentences that merely mention a time unit
        // --------------------------------------------------------
        const isDurationLabel =
          line.trim().length <= 60 &&
          /\b\d+\s*(-|to|–)?\s*\d*\s*(months?|weeks?)\b/i.test(line) &&
          !/[.!?]\s*\S/.test(line.trim()) // no mid-sentence punctuation

        if (isDurationLabel) {
          const text = line.replace(/\*\*/g, '')

          return (
            <div
              key={i}
              className="flex items-center gap-2 py-2 px-3 rounded-lg my-1"
              style={{
                background: theme.softGreen,
                border: `1px solid ${theme.green}30`,
              }}
            >
              <IconClock
                style={{
                  color: theme.green,
                }}
              />

              <p
                className="text-xs font-semibold"
                style={{
                  color: '#2f7d5e',
                }}
              >
                {text}
              </p>
            </div>
          )
        }

        // --------------------------------------------------------
        // Normal text
        // --------------------------------------------------------
        const formatted = line.replace(
          /\*\*(.*?)\*\*/g,
          '<strong>$1</strong>'
        )

        return (
          <p
            key={i}
            className="text-sm leading-relaxed"
            style={{
              color: theme.mainText,
            }}
            dangerouslySetInnerHTML={{
              __html: formatted,
            }}
          />
        )
      })}
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function CareerRoadmap() {
  const { user } = useAuth()

  const [messages, setMessages] = useState([])
  const [answers, setAnswers] = useState({})
  const [currentStep, setCurrentStep] = useState('welcome')
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [followupInput, setFollowupInput] = useState('')

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // ============================================================
  // AUTO SCROLL
  // ============================================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  // ============================================================
  // BACKEND — UNCHANGED
  // ============================================================
  const callGemini = async (prompt) => {
    const token = localStorage.getItem('token')

    const response = await fetch(
      'http://localhost:5000/api/ai/career-roadmap',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Career roadmap API error:', data)
      throw new Error(
        data.error ||
          `Request failed with status ${response.status}`
      )
    }

    if (!data.text) {
      console.error('No text in response:', data)
      throw new Error(
        'Server returned an empty response.'
      )
    }

    return data.text
  }

  // ============================================================
  // QUICK PROMPT
  // ============================================================
  const startWithQuickPrompt = (career) => {
    setAnswers({
      career,
      experience: '',
      skills: '',
      timeline: '',
      goal: '',
    })

    setCurrentStep('questions')
    setCurrentQIndex(1)

    setMessages([
      {
        type: 'bot',
        role: 'advisor',
        content: `Great choice. Let's build your roadmap to become a **${career}**. Just a few more details.`,
      },
      {
        type: 'bot',
        role: 'question',
        content: QUESTIONS[1].question,
        isQuestion: true,
      },
    ])
  }

  // ============================================================
  // MANUAL START
  // ============================================================
  const startManual = () => {
    setCurrentStep('questions')
    setCurrentQIndex(0)

    setMessages([
      {
        type: 'bot',
        role: 'advisor',
        content:
          "Let's build your personalized IT career roadmap. I'll ask a few quick questions first.",
      },
      {
        type: 'bot',
        role: 'question',
        content: QUESTIONS[0].question,
        isQuestion: true,
      },
    ])
  }

  // ============================================================
  // HANDLE ANSWER — UNCHANGED LOGIC
  // ============================================================
  const handleAnswer = async () => {
    if (!inputValue.trim()) return

    const currentQ = QUESTIONS[currentQIndex]

    const newAnswers = {
      ...answers,
      [currentQ.id]: inputValue,
    }

    setAnswers(newAnswers)

    const newMessages = [
      ...messages,
      {
        type: 'user',
        content: inputValue,
      },
    ]

    setInputValue('')

    const nextIndex = currentQIndex + 1

    if (nextIndex < QUESTIONS.length) {
      setCurrentQIndex(nextIndex)

      setMessages([
        ...newMessages,
        {
          type: 'bot',
          role: 'question',
          content: QUESTIONS[nextIndex].question,
          isQuestion: true,
        },
      ])
    } else {
      setMessages([
        ...newMessages,
        {
          type: 'bot',
          role: 'advisor',
          content:
            'Generating your personalized career roadmap...',
          isLoading: true,
        },
      ])

      setLoading(true)

      const prompt = `You are a senior IT career advisor. Create a detailed, structured career roadmap for someone who wants to become a ${newAnswers.career}.

Their profile:
- Current experience: ${newAnswers.experience}
- Current skills: ${newAnswers.skills}
- Timeline goal: ${newAnswers.timeline}
- Main goal: ${newAnswers.goal}

Please provide:
1. A brief assessment of their current position
2. A phase-by-phase roadmap with specific timeframes (Phase 1, Phase 2, etc.)
3. Specific technologies and skills to learn in each phase
4. Resources and projects to build
5. Milestones to track progress
6. Job search tips for the Sri Lankan IT market
7. Estimated salary ranges

Format with clear sections using ## for major phases. Be specific, practical and encouraging. Make it tailored to their specific timeline of ${newAnswers.timeline}.`

      try {
        const result = await callGemini(prompt)

        setRoadmap(result)
        setCurrentStep('roadmap')

        setMessages([
          ...newMessages,
          {
            type: 'bot',
            role: 'ready',
            content:
              'Your personalized career roadmap is ready. Ask any follow-up questions below.',
            isRoadmap: true,
          },
        ])
      } catch (err) {
        console.error(
          'Roadmap generation failed:',
          err
        )

        setMessages([
          ...newMessages,
          {
            type: 'bot',
            role: 'advisor',
            content: `Sorry, I couldn't generate the roadmap: ${err.message}`,
          },
        ])
      }

      setLoading(false)
    }
  }

  // ============================================================
  // FOLLOW UP — UNCHANGED LOGIC
  // ============================================================
  const handleFollowup = async () => {
    if (!followupInput.trim() || loading) return

    const question = followupInput

    setFollowupInput('')
    setLoading(true)

    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        content: question,
      },
    ])

    const prompt = `You are a career advisor. The user has received a career roadmap for ${answers.career}.
They are asking a follow-up question: "${question}"

Context:
- Target career: ${answers.career}
- Current skills: ${answers.skills}
- Timeline: ${answers.timeline}
- Their roadmap was already generated.

Please answer their question helpfully and specifically. Keep the response focused and practical.`

    try {
      const result = await callGemini(prompt)

      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          role: 'advisor',
          content: result,
        },
      ])
    } catch (err) {
      console.error(
        'Follow-up question failed:',
        err
      )

      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          role: 'advisor',
          content: `Sorry, couldn't process that: ${err.message}`,
        },
      ])
    }

    setLoading(false)
  }

  // ============================================================
  // RESET
  // ============================================================
  const resetAll = () => {
    setMessages([])
    setAnswers({})
    setCurrentStep('welcome')
    setCurrentQIndex(0)
    setInputValue('')
    setRoadmap(null)
    setFollowupInput('')
  }

  // ============================================================
  // KEYBOARD
  // ============================================================
  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handler()
    }
  }

  // ============================================================
  // ROLE TAG
  // ============================================================
  const roleTagFor = (msg) => {
    if (msg.type === 'user') {
      return <RoleTag label="You" dotColor={theme.primary} />
    }

    if (msg.role === 'question') {
      return <RoleTag label="Question" dotColor={theme.blue} />
    }

    if (msg.role === 'ready') {
      return <RoleTag label="Roadmap ready" dotColor={theme.green} />
    }

    return <RoleTag label="Advisor" dotColor={theme.orange} />
  }

  // ============================================================
  // FRONTEND
  // ============================================================
  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.bg,
        fontFamily: FONT_BODY,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes softPulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        .cr-msg {
          animation: fadeInUp 0.2s ease both;
        }

        .cr-card {
          transition:
            border-color 0.15s ease,
            background 0.15s ease;
        }

        .cr-card:hover {
          border-color: ${theme.primary}55 !important;
          background: ${theme.white} !important;
        }

        .cr-online {
          animation: softPulse 2.2s ease-in-out infinite;
        }

        /* ======================================================
           HIDE HORIZONTAL + VERTICAL SCROLLBARS
           Scrolling remains enabled.
           ====================================================== */

        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overflow-x: hidden;
        }

        .hide-scrollbar::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }

        .hide-scrollbar::-webkit-scrollbar-track {
          display: none;
        }

        .hide-scrollbar::-webkit-scrollbar-thumb {
          display: none;
        }

        /* Prevent accidental horizontal page scrolling */
        html,
        body {
          overflow-x: hidden;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${theme.softPurple};
          border-color: ${theme.primary} !important;
        }

        button:focus-visible {
          outline: 2px solid ${theme.primary};
          outline-offset: 2px;
        }

        .cr-shadow {
          box-shadow:
            0 1px 2px rgba(22, 26, 35, 0.04),
            0 8px 24px rgba(22, 26, 35, 0.06);
        }

        .cr-dot-grid {
          background-image: radial-gradient(${theme.border} 1px, transparent 1px);
          background-size: 18px 18px;
        }

        @media (max-width: 1024px) {
          .cr-main-layout {
            flex-direction: column !important;
          }

          .cr-chat-panel,
          .cr-roadmap-panel {
            width: 100% !important;
            flex: none !important;
          }

          .cr-chat-panel {
            min-height: 620px;
          }

          .cr-roadmap-panel {
            min-height: 620px;
          }
        }

        @media (max-width: 640px) {
          .cr-page {
            padding: 12px !important;
          }

          .cr-header-title {
            font-size: 17px !important;
          }

          .cr-chat-panel {
            min-height: 650px;
          }

          .cr-roadmap-panel {
            min-height: 650px;
          }

          .cr-welcome-title {
            font-size: 25px !important;
          }

          .cr-welcome-grid {
            grid-template-columns: 1fr !important;
          }

          .cr-quick-grid {
            grid-template-columns: 1fr !important;
          }

          .cr-message-width {
            max-width: 86% !important;
          }
        }
      `}</style>

      {/* ======================================================
          PAGE CONTAINER
          ====================================================== */}
      <div
        className="cr-page max-w-7xl mx-auto px-4 py-5 h-screen flex flex-col"
      >
        {/* ====================================================
            HEADER
            ==================================================== */}
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            

            <div>
              <h1
                className="cr-header-title text-xl font-bold"
                style={{
                  color: theme.mainText,
                  fontFamily: FONT_DISPLAY,
                  letterSpacing: '-0.01em',
                }}
              >
                Career Roadmap
              </h1>

              
            </div>
          </div>

          {currentStep !== 'welcome' && (
            <button
              onClick={resetAll}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition hover:bg-white"
              style={{
                background: theme.white,
                color: theme.mainText,
                border: `1px solid ${theme.border}`,
                fontFamily: FONT_DISPLAY,
              }}
            >
              <IconRefresh />
              Start over
            </button>
          )}
        </div>

        {/* ====================================================
            MAIN LAYOUT
            ==================================================== */}
        <div
          className="cr-main-layout flex-1 flex gap-5 min-h-0"
        >
          {/* ==================================================
              LEFT / CHAT PANEL
              ================================================== */}
          <div
            className="cr-chat-panel flex flex-col rounded-xl overflow-hidden relative cr-shadow"
            style={{
              background: theme.white,
              border: `1px solid ${theme.border}`,
              width:
                currentStep === 'roadmap'
                  ? '42%'
                  : '100%',
              transition: 'width 0.3s ease',
            }}
          >
            {/* ----------------------------------------------
                CHAT HEADER
                ---------------------------------------------- */}
            <div
              className="px-5 py-3.5 flex items-center gap-3 border-b relative z-10 flex-shrink-0"
              style={{
                background: theme.softPanel,
                borderColor: theme.border,
              }}
            >
              

              <div className="flex-1">
                <p
                  className="text-sm font-bold"
                  style={{
                    color: theme.mainText,
                    fontFamily: FONT_DISPLAY,
                  }}
                >
                  Career Advisor
                </p>

                <div className="flex items-center gap-1.5">
                  <div
                    className="cr-online w-1.5 h-1.5 rounded-full"
                    style={{
                      background: theme.green,
                    }}
                  />

                  <p
                    className="text-xs"
                    style={{
                      color: theme.secondaryText,
                    }}
                  >
                    Online now
                  </p>
                </div>
              </div>

              <div
                className="px-2.5 py-1 rounded-md text-[10px] font-bold"
                style={{
                  background: theme.white,
                  color: theme.mainText,
                  border: `1px solid ${theme.border}`,
                }}
              >
                AI
              </div>
            </div>

            {/* ----------------------------------------------
                MESSAGE / WELCOME AREA
                ---------------------------------------------- */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-4 relative hide-scrollbar"
            >
              {/* =================================================
                  WELCOME STATE
                  ================================================= */}
              {currentStep === 'welcome' && (
                <div className="h-full flex flex-col justify-between relative">
                  {/* Quiet decorative backdrop */}
                  <div
                    className="cr-dot-grid absolute -top-4 -right-4 w-56 h-56 pointer-events-none"
                    style={{
                      opacity: 0.6,
                      maskImage:
                        'radial-gradient(circle, black, transparent 70%)',
                      WebkitMaskImage:
                        'radial-gradient(circle, black, transparent 70%)',
                    }}
                  />

                  <div className="relative z-10">
                    {/* AI label */}
                    

                    {/* Hero title */}
                    <h2
                      className="mb-3 leading-tight cr-welcome-title"
                      style={{
                        fontFamily: FONT_DISPLAY,
                      }}
                    >
                      <span
                        className="block text-2xl font-semibold"
                        style={{
                          color: theme.mainText,
                        }}
                      >
                        Hello
                        {user?.full_name
                          ? `, ${user.full_name.split(' ')[0]}`
                          : ''}
                        .
                      </span>

                      <span
                        className="block text-3xl font-extrabold"
                        style={{
                          color: theme.primaryDark,
                          letterSpacing: '-0.03em',
                        }}
                      >
                        Plan your path in IT.
                      </span>
                    </h2>

                    <p
                      className="text-sm mb-6 max-w-md"
                      style={{ color: theme.secondaryText }}
                    >
                      Answer a few quick questions and get a
                      structured, phase by phase plan built
                      around your goals and timeline.
                    </p>

                    {/* Feature cards */}
                    <div
                      className="grid grid-cols-2 gap-3 mb-7 cr-welcome-grid"
                    >
                      {FEATURES.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg"
                          style={{
                            background: theme.softPanel,
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: theme.white,
                              color: theme.primary,
                              border: `1px solid ${theme.border}`,
                            }}
                          >
                            <f.icon />
                          </div>

                          <p
                            className="text-xs leading-snug pt-1"
                            style={{
                              color: theme.mainText,
                            }}
                          >
                            {f.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Quick start */}
                    <p
                      className="text-[10px] font-bold mb-3 px-1 uppercase tracking-wider"
                      style={{
                        color: theme.secondaryText,
                        fontFamily: FONT_DISPLAY,
                      }}
                    >
                      Quick start — choose a path
                    </p>

                    <div
                      className="grid grid-cols-2 gap-2.5 mb-5 cr-quick-grid"
                    >
                      {QUICK_PROMPTS.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            startWithQuickPrompt(
                              prompt.label
                            )
                          }
                          className="cr-card flex items-center gap-3 p-3 rounded-lg text-left"
                          style={{
                            background: theme.softPanel,
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: theme.white,
                              color: theme.primary,
                              border: `1px solid ${theme.border}`,
                            }}
                          >
                            <prompt.icon />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="text-xs font-bold truncate"
                              style={{
                                color: theme.mainText,
                              }}
                            >
                              {prompt.label}
                            </p>

                            <p
                              className="text-[10px] mt-0.5"
                              style={{
                                color: theme.secondaryText,
                              }}
                            >
                              {prompt.desc}
                            </p>
                          </div>

                          <div
                            className="ml-auto flex-shrink-0"
                            style={{
                              color: theme.secondaryText,
                            }}
                          >
                            <IconChevron />
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-3">
                      <div
                        className="flex-1 h-px"
                        style={{
                          background: theme.border,
                        }}
                      />

                      <span
                        className="text-[11px] px-2"
                        style={{
                          color: theme.secondaryText,
                        }}
                      >
                        or
                      </span>

                      <div
                        className="flex-1 h-px"
                        style={{
                          background: theme.border,
                        }}
                      />
                    </div>
                  </div>

                  {/* Custom roadmap button */}
                  <button
                    onClick={startManual}
                    className="relative z-10 w-full py-3.5 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 transition hover:bg-[#0b5647]"
                    style={{
                      background: theme.primary,
                      fontFamily: FONT_DISPLAY,
                    }}
                  >
                    <IconSpark />
                    Build custom roadmap
                    <IconChevron />
                  </button>
                </div>
              )}

              {/* =================================================
                  CHAT MESSAGES
                  ================================================= */}
              {currentStep !== 'welcome' &&
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`cr-msg flex gap-3 ${
                      msg.type === 'user'
                        ? 'flex-row-reverse'
                        : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                      style={{
                        background:
                          msg.type === 'user'
                            ? theme.mainText
                            : theme.primary,
                      }}
                    >
                      {msg.type === 'user'
                        ? user?.full_name?.charAt(0).toUpperCase() || (
                            <IconUser />
                          )
                        : (
                          <IconAdvisor />
                        )}
                    </div>

                    <div
                      className="cr-message-width max-w-xs lg:max-w-sm"
                    >
                      {/* Role tag */}
                      <div
                        className={`mb-1.5 flex ${
                          msg.type === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        {roleTagFor(msg)}
                      </div>

                      {/* Loading */}
                      {msg.isLoading ? (
                        <div
                          className="px-4 py-3.5 rounded-xl rounded-tl-sm flex items-center gap-3"
                          style={{
                            background: theme.softPanel,
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          <div className="flex gap-1">
                            {[0, 1, 2].map((j) => (
                              <div
                                key={j}
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{
                                  background:
                                    theme.primary,
                                  animationDelay: `${
                                    j * 0.15
                                  }s`,
                                }}
                              />
                            ))}
                          </div>

                          <span
                            className="text-xs"
                            style={{
                              color:
                                theme.secondaryText,
                            }}
                          >
                            Generating roadmap...
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`px-4 py-3 text-sm leading-relaxed ${
                            msg.type === 'user'
                              ? 'rounded-xl rounded-tr-sm'
                              : 'rounded-xl rounded-tl-sm'
                          }`}
                          style={{
                            background:
                              msg.type === 'user'
                                ? theme.mainText
                                : theme.softPanel,

                            color:
                              msg.type === 'user'
                                ? theme.white
                                : theme.mainText,

                            border: msg.isQuestion
                              ? `1px solid ${theme.primary}40`
                              : `1px solid ${theme.border}`,

                            boxShadow:
                              '0 1px 3px rgba(22,26,35,0.04)',
                          }}
                        >
                          {msg.isRoadmap ? (
                            <div
                              className="flex items-center gap-2 font-semibold"
                              style={{ color: theme.primaryDark }}
                            >
                              <IconSpark />
                              {msg.content}
                            </div>
                          ) : (
                            <p
                              dangerouslySetInnerHTML={{
                                __html:
                                  msg.content.replace(
                                    /\*\*(.*?)\*\*/g,
                                    '<strong>$1</strong>'
                                  ),
                              }}
                            />
                          )}
                        </div>
                      )}

                      {/* Question counter */}
                      {msg.isQuestion && (
                        <p
                          className="text-[10px] mt-1.5 px-1"
                          style={{
                            color: theme.secondaryText,
                          }}
                        >
                          Question {currentQIndex + 1} of{' '}
                          {QUESTIONS.length}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

              <div ref={messagesEndRef} />
            </div>

            {/* ==================================================
                INPUT AREA
                ================================================== */}
            {currentStep !== 'welcome' && (
              <div
                className="p-4 border-t flex-shrink-0"
                style={{
                  borderColor: theme.border,
                  background: theme.white,
                }}
              >
                {currentStep === 'roadmap' ? (
                  <div>
                    <p
                      className="text-xs mb-2 font-semibold"
                      style={{
                        color: theme.secondaryText,
                      }}
                    >
                      Ask a follow-up question about your roadmap
                    </p>

                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={followupInput}
                        onChange={(e) =>
                          setFollowupInput(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(
                            e,
                            handleFollowup
                          )
                        }
                        className="flex-1 rounded-lg px-4 py-3 text-sm"
                        style={{
                          background:
                            theme.softPanel,
                          border: `1px solid ${theme.border}`,
                          color: theme.mainText,
                        }}
                        placeholder="e.g. What resources should I use for React?"
                        disabled={loading}
                      />

                      <button
                        onClick={handleFollowup}
                        disabled={
                          loading ||
                          !followupInput.trim()
                        }
                        className="w-11 h-11 rounded-lg flex items-center justify-center text-white disabled:opacity-50 transition hover:bg-[#0b5647]"
                        style={{
                          background: theme.primary,
                        }}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <IconSend />
                        )}
                      </button>
                    </div>

                    <div className="flex gap-2 mt-2.5 flex-wrap">
                      {[
                        'Best resources?',
                        'Salary expectations?',
                        'How to get first job?',
                        'Project ideas?',
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setFollowupInput(q)
                            inputRef.current?.focus()
                          }}
                          className="text-[11px] px-3 py-1.5 rounded-full transition hover:bg-white font-medium"
                          style={{
                            background:
                              theme.softPanel,
                            color:
                              theme.mainText,
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p
                      className="text-xs mb-2"
                      style={{
                        color: theme.secondaryText,
                      }}
                    >
                      {
                        QUESTIONS[currentQIndex]
                          ?.placeholder
                      }
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) =>
                          setInputValue(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(
                            e,
                            handleAnswer
                          )
                        }
                        className="flex-1 rounded-lg px-4 py-3 text-sm"
                        style={{
                          background:
                            theme.softPanel,
                          border: `1px solid ${theme.border}`,
                          color: theme.mainText,
                        }}
                        placeholder="Type your answer..."
                        autoFocus
                      />

                      <button
                        onClick={handleAnswer}
                        disabled={!inputValue.trim()}
                        className="w-11 h-11 rounded-lg flex items-center justify-center text-white disabled:opacity-50 transition hover:bg-[#0b5647]"
                        style={{
                          background: theme.primary,
                        }}
                      >
                        <IconSend />
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex gap-1.5">
                        {QUESTIONS.map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-1 rounded-full transition-all"
                            style={{
                              background:
                                i < currentQIndex
                                  ? theme.primary
                                  : i ===
                                    currentQIndex
                                  ? theme.blue
                                  : theme.border,
                            }}
                          />
                        ))}
                      </div>

                      <p
                        className="text-[10px] mt-1.5"
                        style={{
                          color: theme.secondaryText,
                        }}
                      >
                        {currentQIndex}/
                        {QUESTIONS.length} answered
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==================================================
              RIGHT PANEL — ROADMAP OUTPUT
              ================================================== */}
          {currentStep === 'roadmap' && roadmap && (
            <div
              className="cr-roadmap-panel flex flex-col rounded-xl overflow-hidden cr-shadow"
              style={{
                flex: 1,
                background: theme.white,
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* ----------------------------------------------
                  ROADMAP HEADER
                  ---------------------------------------------- */}
              <div
                className="px-5 py-3.5 border-b flex items-center justify-between flex-shrink-0"
                style={{
                  background: theme.softPanel,
                  borderColor: theme.border,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{
                      background: theme.primary,
                    }}
                  >
                    <IconCompass />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: theme.mainText,
                        fontFamily: FONT_DISPLAY,
                      }}
                    >
                      Your career roadmap
                    </p>

                    <p
                      className="text-xs truncate"
                      style={{
                        color: theme.secondaryText,
                      }}
                    >
                      {answers.career} &middot;{' '}
                      {answers.timeline}
                    </p>
                  </div>
                </div>

                {answers.experience && (
                  <span
                    className="text-[11px] px-2.5 py-1.5 rounded-md font-semibold flex-shrink-0 max-w-[180px] truncate hidden sm:block"
                    style={{
                      background: theme.white,
                      color: theme.mainText,
                      border: `1px solid ${theme.border}`,
                    }}
                    title={answers.experience}
                  >
                    {answers.experience}
                  </span>
                )}
              </div>

              {/* ----------------------------------------------
                  ROADMAP CONTENT
                  HORIZONTAL + VERTICAL SCROLLBARS HIDDEN
                  ---------------------------------------------- */}
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden p-6 hide-scrollbar"
              >
                <RoadmapRenderer content={roadmap} />
              </div>

              {/* ----------------------------------------------
                  FOOTER
                  ---------------------------------------------- */}
              <div
                className="px-5 py-3 border-t flex items-center justify-between flex-shrink-0"
                style={{
                  borderColor: theme.border,
                  background: theme.softPanel,
                }}
              >
                <p
                  className="text-xs"
                  style={{
                    color: theme.secondaryText,
                  }}
                >
                  Personalized for {answers.career}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const blob = new Blob(
                        [roadmap],
                        {
                          type: 'text/plain',
                        }
                      )

                      const url =
                        URL.createObjectURL(blob)

                      const a =
                        document.createElement('a')

                      a.href = url
                      a.download = `${answers.career}-roadmap.txt`

                      a.click()
                    }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition hover:bg-white"
                    style={{
                      background: theme.white,
                      color: theme.mainText,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <IconDownload />
                    Download
                  </button>

                  <button
                    onClick={resetAll}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition hover:opacity-90"
                    style={{
                      background: theme.primary,
                      color: theme.white,
                    }}
                  >
                    <IconRefresh />
                    New roadmap
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
