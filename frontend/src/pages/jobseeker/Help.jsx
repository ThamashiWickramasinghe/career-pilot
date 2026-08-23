import { useState } from 'react'

/* ── Colour Theme — matches the rest of the Job Seeker Dashboard ── */
const C = {
  /* Pastel purple theme based on #DBBCD4 */
  bg: '#F8F3F7',
  card: '#FFFFFF',
  border: '#E5D8E4',
  ink: '#2E2730',
  sub: '#857A87',

  /* Main purple palette */
  accent: '#9B7FA0',
  accentDark: '#765C7A',
  accentSoft: '#DBBCD4',

  /* Supporting colours */
  green: '#6E9B86',
  greenSoft: '#E3F1E9',
  blue: '#7D89B8',
  blueSoft: '#E9ECF7',
  orange: '#B88655',
  orangeSoft: '#F7EBDD',

  purple: '#9B7FA0',
  purpleSoft: '#DBBCD4',

  softPanel: '#F5EFF5'
}

const cardShadow =
  '0 2px 8px rgba(74, 69, 130, 0.06), 0 1px 3px rgba(74, 69, 130, 0.04)'

/* ── Icons ── */
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

const IconHelp = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 1.8-2.5 3.5" />
        <path d="M12 17h.01" />
      </>
    }
  />
)

const IconHome = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M3 9l9-7 9 7" />
        <path d="M9 22V12h6v10" />
      </>
    }
  />
)

const IconBot = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="4" y="9" width="16" height="10" rx="2" />
        <path d="M12 9V5M9 5h6" />
        <circle cx="9" cy="14" r="1" />
        <circle cx="15" cy="14" r="1" />
      </>
    }
  />
)

const IconMap = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M9 3l6 2 6-2v16l-6 2-6-2-6 2V5z" />
        <path d="M9 3v16M15 5v16" />
      </>
    }
  />
)

const IconBook = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v16H6.5A2.5 2.5 0 004 20.5v-16z" />
        <path d="M4 20.5A2.5 2.5 0 016.5 18H20" />
      </>
    }
  />
)

const IconBriefcase = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </>
    }
  />
)

const IconTrophy = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M8 21h8M12 17v4" />
        <path d="M7 4h10v5a5 5 0 01-10 0V4z" />
        <path d="M7 5H4a2 2 0 002 4M17 5h3a2 2 0 01-2 4" />
      </>
    }
  />
)

const IconUser = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      </>
    }
  />
)

const IconChevronDown = (p) => (
  <Icon {...p} path={<path d="M6 9l6 6 6-6" />} />
)

const IconMail = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    }
  />
)

/* ── Guide sections: one card per dashboard feature ── */
const GUIDE_SECTIONS = [
  {
    id: 'dashboard',
    icon: IconHome,
    color: C.accent,
    soft: C.accentSoft,
    title: 'Dashboard',
    summary: 'Your home base — a quick snapshot of everything happening in your account.',
    points: [
      'The three stat cards (Available Jobs, My Courses, Badges Earned) are shortcuts — click any of them to jump straight to that section.',
      'The "My Courses" list shows real courses you have access to or have requested; click a row to open the Learning Hub.',
      'The bell icon shows notifications for re-access approvals and job application updates. Unread items are highlighted.',
      'The right-hand panel shows this month\'s calendar, your real job application statuses, and your latest earned badges.'
    ]
  },
  {
    id: 'ai-jobs',
    icon: IconBot,
    color: C.blue,
    soft: C.blueSoft,
    title: 'AI Job Match',
    summary: 'Take the career assessment quiz and let AI recommend a career path for you.',
    points: [
      'The quiz covers 14 IT categories with 10 questions each — you can skip categories you\'re unsure of.',
      'Each question has a 30-second timer, so answer instinctively.',
      'Avoid switching tabs or copy-pasting during the quiz — this is monitored for fairness.',
      'Once finished, view your AI-generated career predictions, a skill-gap breakdown, recommended courses, and matched jobs.',
      'You can retake the quiz any time to get a fresh analysis.'
    ]
  },
  {
    id: 'jobs',
    icon: IconBriefcase,
    color: C.orange,
    soft: C.orangeSoft,
    title: 'Job Vacancy',
    summary: 'Browse open positions from companies and track your applications.',
    points: [
      'Use the search bar and filters (location, job type, category) to narrow down listings.',
      'Click "View" on any job to see full details, required skills, and company info.',
      'Apply directly from the job detail page — a cover letter is optional but recommended.',
      'Check the "My Applications" tab to see the status of every job you\'ve applied to: Pending, Shortlisted, Hired, or Rejected.',
      'Status changes also appear in your notification bell and on the Dashboard.'
    ]
  },
  {
    id: 'roadmap',
    icon: IconMap,
    color: C.purple,
    soft: C.purpleSoft,
    title: 'Career Roadmap',
    summary: 'A guided path showing the skills and milestones for your chosen career track.',
    points: [
      'Roadmaps are generated based on your quiz results and selected career interest.',
      'Follow the suggested order — each step usually builds on the one before it.',
      'Pair roadmap steps with matching courses in the Learning Hub to stay on track.'
    ]
  },
  {
    id: 'learning',
    icon: IconBook,
    color: C.green,
    soft: C.greenSoft,
    title: 'Learning Hub',
    summary: 'Video, PDF, and note-based learning content uploaded by instructors.',
    points: [
      'Browse by category or content type (Video, PDF, Notes), or use the search bar.',
      'Opening a video grants you 30 days of access from the first time you view it.',
      'If your access expires, use "Request Re-Access" on the content page — you\'ll be notified once an instructor responds.',
      'You can leave comments on any content item to ask questions or share feedback.'
    ]
  },
  {
    id: 'challenges',
    icon: IconTrophy,
    color: C.purple,
    soft: C.purpleSoft,
    title: 'Skill Challenges',
    summary: 'Timed skill tests that reward badges for strong performance.',
    points: [
      'Complete challenges to earn badges like "Perfect Score", "Quick Learner", and "First Steps".',
      'Earned badges appear on your Dashboard and Profile automatically — no extra step needed.'
    ]
  },
  {
    id: 'profile',
    icon: IconUser,
    color: C.blue,
    soft: C.blueSoft,
    title: 'Profile',
    summary: 'Manage your personal details, skills, and account security.',
    points: [
      'Overview shows a summary of your account and activity.',
      'Edit Profile lets you update your name, contact info, and other personal details.',
      'Skills and Experience is where you list your technical skills — keep it updated for better job matches.',
      'Security lets you change your password; a strength indicator helps you choose a strong one.'
    ]
  }
]

const FAQS = [
  {
    q: 'Why do I see "0 Available Jobs" or "No applications yet"?',
    a: 'These reflect live data. If no companies have posted jobs yet, or you haven\'t applied to any, the counts will show 0 until that changes.'
  },
  {
    q: 'How long do I have access to a video course?',
    a: 'Video content grants 30 days of access from when you first open it. After that, you can request re-access from the content page.'
  },
  {
    q: 'How do I know if an instructor approved my re-access request?',
    a: 'You\'ll get a notification in the bell icon on your Dashboard, and your access will automatically renew for another 30 days.'
  },
  {
    q: 'Can I retake the career assessment quiz?',
    a: 'Yes — go to AI Job Match and click "Retake Quiz" any time to get an updated analysis.'
  },
  {
    q: 'Where can I see the status of a job I applied to?',
    a: 'Check Job Vacancy → "My Applications" tab, or the "Job Status Notifications" widget on your Dashboard.'
  }
]

function GuideCard({ section, isOpen, onToggle }) {
  const IconComp = section.icon

  return (
    <div
      className="rounded-2xl overflow-hidden transition"
      style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: cardShadow }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: section.soft }}
        >
          <IconComp size={20} color={section.color} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: C.ink }}>
            {section.title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: C.sub }}>
            {section.summary}
          </p>
        </div>

        <div
          className="flex-shrink-0 transition-transform"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <IconChevronDown size={16} color={C.sub} />
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5">
          <div
            className="rounded-xl p-4"
            style={{ background: C.softPanel }}
          >
            <ul className="space-y-2.5">
              {section.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: C.ink }}>
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: section.color }}
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Help() {
  const [openSection, setOpenSection] = useState('dashboard')
  const [openFaq, setOpenFaq] = useState(null)

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id))
  }

  const toggleFaq = (i) => {
    setOpenFaq((prev) => (prev === i ? null : i))
  }

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <div className="max-w-4xl mx-auto px-2 py-2">

        {/* Header */}
        

        {/* Feature guide cards */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4" style={{ color: C.ink }}>
            Help & Support
          </h2>

          <div className="space-y-3">
            {GUIDE_SECTIONS.map((section) => (
              <GuideCard
                key={section.id}
                section={section}
                isOpen={openSection === section.id}
                onToggle={() => toggleSection(section.id)}
              />
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4" style={{ color: C.ink }}>
            Frequently Asked Questions
          </h2>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: cardShadow }}
          >
            {FAQS.map((f, i) => (
              <div
                key={i}
                style={{
                  borderBottom: i !== FAQS.length - 1 ? `1px solid ${C.border}` : 'none'
                }}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left"
                >
                  <p className="text-sm font-semibold" style={{ color: C.ink }}>
                    {f.q}
                  </p>
                  <div
                    className="flex-shrink-0 transition-transform"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <IconChevronDown size={14} color={C.sub} />
                  </div>
                </button>

                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: C.sub }}>
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact / support footer */}
        <div
          className="rounded-2xl p-5 flex items-center gap-4 mb-10"
          style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: cardShadow }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: C.greenSoft }}
          >
            <IconMail size={18} color={C.green} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: C.ink }}>
              Still need help?
            </p>
            <p className="text-xs mt-0.5" style={{ color: C.sub }}>
              Reach out to your Career Pilot administrator for further support with your account.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}