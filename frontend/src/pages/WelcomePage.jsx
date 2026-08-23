import React from "react";
import { Link } from "react-router-dom";
import heroTeam from "../assets/hero-team.jpg";
import caseSeeker from "../assets/uu.jpg";
import caseInstructor from "../assets/tt.jpg";

/* =========================================================
   CAREER PILOT — WELCOME PAGE
   Reference-inspired clean card layout
========================================================= */

const C = {
  bg: "#F7F3EA",
  panel: "#FFFFFF",
  ink: "#20231F",
  inkSoft: "#697069",
  border: "#E7E1D6",

  green: "#3F6B4F",
  greenDark: "#31553E",

  purple: "#7564A8",
  purpleSoft: "#F0ECF8",

  sage: "#5D9871",
  sageSoft: "#E8F2EA",

  teal: "#4D8D95",
  tealSoft: "#E5F1F2",

  orange: "#D89A4A",
  orangeSoft: "#F8EBD8",
};

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
`;

/* =========================================================
   ICONS
========================================================= */

function Icon({ name, color = C.ink, size = 20 }) {
  const stroke = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    spark: (
      <path
        d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z"
        {...stroke}
      />
    ),

    arrow: (
      <>
        <path d="M7 17L17 7" {...stroke} />
        <path d="M9 7h8v8" {...stroke} />
      </>
    ),

    chevron: <path d="M9 6l6 6-6 6" {...stroke} />,

    users: (
      <>
        <circle cx="9" cy="8" r="3" {...stroke} />
        <path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5" {...stroke} />
        <path d="M16 5.5a3 3 0 0 1 0 5.8" {...stroke} />
        <path d="M17 14.5c2 .6 3.3 2 3.5 4.5" {...stroke} />
      </>
    ),

    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" {...stroke} />
        <path d="M4 5.5v15" {...stroke} />
        <path d="M8 7h8M8 10h7" {...stroke} />
      </>
    ),

    briefcase: (
      <>
        <rect x="3.5" y="7.5" width="17" height="12" rx="2" {...stroke} />
        <path d="M8.5 7.5V5.8A2.2 2.2 0 0 1 10.7 3.6h2.6a2.2 2.2 0 0 1 2.2 2.2v1.7" {...stroke} />
        <path d="M3.5 12h17" {...stroke} />
      </>
    ),

    ai: (
      <>
        <circle cx="12" cy="12" r="7.5" {...stroke} />
        <path d="M12 7v10M7 12h10" {...stroke} />
        <circle cx="12" cy="12" r="2" {...stroke} />
      </>
    ),

    compass: (
      <>
        <circle cx="12" cy="12" r="8.5" {...stroke} />
        <path d="M15.5 8.5l-4.5 2-2 4.5 4.5-2 2-4.5z" {...stroke} />
      </>
    ),

    roadmap: (
      <>
        <path d="M4 18c3-1 3 2 6 2s3-3 6-3 3 2 5 1" {...stroke} />
        <circle cx="4" cy="18" r="1.3" {...stroke} />
        <circle cx="21" cy="18" r="1.3" {...stroke} />
      </>
    ),

    trophy: (
      <>
        <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" {...stroke} />
        <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" {...stroke} />
        <path d="M12 13v3M9 20h6M10 20v-2h4v2" {...stroke} />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/* =========================================================
   ROLE CARDS
========================================================= */

const roleCards = [
  {
    key: "seeker",
    title: "Job Seeker",
    subtitle: "Find Your Career Path",
    description:
      "Discover the IT career that fits your skills, build your knowledge, and get matched with suitable opportunities.",
    image: caseSeeker,
    color: C.purple,
    soft: C.purpleSoft,
    icon: "users",
    tags: ["AI MATCHING", "CAREER PATH"],
  },

  {
    key: "instructor",
    title: "Instructor",
    subtitle: "Share Your Knowledge",
    description:
      "Create and publish quality learning content while helping job seekers develop the skills employers need.",
    image: caseInstructor,
    color: C.sage,
    soft: C.sageSoft,
    icon: "book",
    tags: ["COURSES", "LEARNING"],
  },

  {
    key: "company",
    title: "Company",
    subtitle: "Find Better Candidates",
    description:
      "Publish vacancies and connect with candidates whose skills and career profiles match your requirements.",
    image: heroTeam,
    color: C.teal,
    soft: C.tealSoft,
    icon: "briefcase",
    tags: ["HIRING", "AI MATCHING"],
  },
];

/* =========================================================
   AI FEATURES
========================================================= */

const aiFeatures = [
  {
    icon: "ai",
    title: "AI Job Matching",
    text: "Connect job seekers with relevant IT vacancies based on their skills and profile.",
  },
  {
    icon: "compass",
    title: "Career Prediction",
    text: "Predict suitable IT career paths using the user's assessment and skill information.",
  },
  {
    icon: "roadmap",
    title: "Career Roadmap",
    text: "Create a practical learning journey that guides users toward their target career.",
  },
  {
    icon: "trophy",
    title: "Skill Challenges",
    text: "Test knowledge through assessments and challenges that help identify skill gaps.",
  },
];

/* =========================================================
   WELCOME PAGE
========================================================= */

export default function WelcomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.ink,
        fontFamily: "Inter, sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{fontImport}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="cp-header"
        style={{
          width: "100%",
          maxWidth: 1180,
          margin: "0 auto",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: C.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="spark" color="#FFFFFF" size={17} />
          </div>

          <span
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Career Pilot
          </span>
        </div>

        {/* Navigation */}
        <nav
          className="cp-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            fontSize: 13.5,
            fontWeight: 500,
            color: C.inkSoft,
          }}
        >
          <a href="#roles" style={navLink}>
            Roles
          </a>
          <a href="#ai" style={navLink}>
            AI Features
          </a>
          <a href="#about" style={navLink}>
            About
          </a>
        </nav>

        {/* Header Buttons */}
        <div
          className="cp-header-buttons"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <Link
            to="/login"
            style={{
              ...smallButton,
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.ink,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Log In
          </Link>

          <Link
            to="/register"
            style={{
              ...smallButton,
              border: "none",
              background: C.ink,
              color: "#FFFFFF",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main>
        {/* ===================================================
            HERO / REFERENCE STYLE SECTION
        =================================================== */}

        <section
          id="roles"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "58px 28px 72px",
            boxSizing: "border-box",
          }}
        >
          {/* Heading */}
          <div
            className="cp-title-area"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 40,
              marginBottom: 34,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                

                <span
                  style={{
                    color: C.green,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                  }}
                >
                  Welcome to Career Pilot
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  maxWidth: 600,
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 43,
                  lineHeight: 1.05,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                }}
              >
                Your career journey
                <br />
                starts <span style={{ color: C.green }}>here.</span>
              </h1>
            </div>

            
          </div>

          {/* =================================================
              THREE CARDS
          ================================================= */}

          <div
            className="cp-role-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 13,
            }}
          >
            {roleCards.map((role) => (
              <article
                key={role.key}
                className="cp-role-card"
                style={{
                  minWidth: 0,
                }}
              >
                {/* Image */}
                <div
                  className="cp-card-image"
                  style={{
                    position: "relative",
                    height: 205,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: role.soft,
                  }}
                >
                  <img
                    src={role.image}
                    alt={role.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />

                  {/* Image overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(20,25,20,0.22), transparent 45%)",
                      pointerEvents: "none",
                    }}
                  />

                </div>

                {/* Card content */}
                <div
                  style={{
                    padding: "14px 2px 0",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: 18,
                      lineHeight: 1.2,
                      fontWeight: 800,
                      marginBottom: 4,
                    }}
                  >
                    {role.title}
                  </div>

                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: role.color,
                      marginBottom: 7,
                    }}
                  >
                    {role.subtitle}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      maxWidth: 330,
                      fontSize: 11.5,
                      color: C.inkSoft,
                      lineHeight: 1.5,
                    }}
                  >
                    {role.description}
                  </p>

                  
                </div>
              </article>
            ))}
          </div>

          {/* View all button */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 34,
            }}
          >
            <Link
              to="/register"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 19px 10px 20px",
                borderRadius: 999,
                border: "none",
                background: "#171917",
                color: "#FFFFFF",
                fontSize: 10.5,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Explore Career Pilot
              <span
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="chevron" color="#FFFFFF" size={10} />
              </span>
            </Link>
          </div>
        </section>

        {/* ===================================================
            AI FEATURES
        =================================================== */}

        <section
          id="ai"
          style={{
            background: C.panel,
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "65px 28px",
              boxSizing: "border-box",
            }}
          >
            <div
              className="cp-ai-heading"
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 30,
                marginBottom: 30,
              }}
            >
              <div>
                <div
                  style={{
                    color: C.green,
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    marginBottom: 9,
                  }}
                >
                  Intelligent Career Support
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 30,
                    lineHeight: 1.1,
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                  }}
                >
                  AI tools built around your career.
                </h2>
              </div>

              
            </div>

            <div
              className="cp-ai-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {aiFeatures.map((feature) => (
                <div
                  key={feature.title}
                  style={{
                    border: `1px solid ${C.border}`,
                    borderRadius: 11,
                    padding: "20px 17px",
                    background: C.bg,
                  }}
                >
                  <div
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 9,
                      background: C.green,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 15,
                    }}
                  >
                    <Icon
                      name={feature.icon}
                      color="#FFFFFF"
                      size={17}
                    />
                  </div>

                  <h3
                    style={{
                      margin: "0 0 7px",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    {feature.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: C.inkSoft,
                      fontSize: 11.5,
                      lineHeight: 1.55,
                    }}
                  >
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            ABOUT / FINAL CTA
        =================================================== */}

        <section
          id="about"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "60px 28px 70px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="cp-final"
            style={{
              borderRadius: 16,
              background: C.ink,
              padding: "40px 42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 30,
            }}
          >
            <div>
              <div
                style={{
                  color: "#A9C8B2",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 9,
                }}
              >
                Start Your Journey
              </div>

              <h2
                style={{
                  margin: "0 0 7px",
                  color: "#FFFFFF",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 27,
                  lineHeight: 1.15,
                  fontWeight: 800,
                }}
              >
                Find where your skills can take you.
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 12.5,
                }}
              >
                Create your profile and let Career Pilot guide your next step.
              </p>
            </div>

            <Link
              to="/register"
              style={{
                flexShrink: 0,
                border: "none",
                borderRadius: 999,
                background: C.green,
                color: "#FFFFFF",
                padding: "12px 22px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        style={{
          borderTop: `1px solid ${C.border}`,
          maxWidth: 1180,
          margin: "0 auto",
          padding: "22px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          color: C.inkSoft,
          fontSize: 11.5,
          boxSizing: "border-box",
        }}
      >
        <span>
          © {new Date().getFullYear()} Career Pilot
        </span>

        <span>
          AI-Powered IT Career Guidance
        </span>
      </footer>

      {/* =====================================================
          RESPONSIVE STYLES
      ===================================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        html, body {
          margin: 0;
          background: ${C.bg};
          scrollbar-width: none;      /* Firefox */
          -ms-overflow-style: none;   /* IE / Edge */
        }

        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;              /* Chrome / Safari / Opera */
          width: 0;
          height: 0;
        }

        button,
        a {
          font-family: inherit;
        }

        button {
          transition:
            transform 0.18s ease,
            opacity 0.18s ease,
            box-shadow 0.18s ease;
        }

        button:hover {
          transform: translateY(-1px);
        }

        a {
          transition: color 0.18s ease, transform 0.18s ease;
        }

        a:hover {
          color: ${C.green} !important;
        }

        .cp-header-buttons a:hover,
        .cp-final a:hover,
        section a[href="#roles"]:hover {
          transform: translateY(-1px);
          color: inherit !important;
        }

        .cp-role-card {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .cp-role-card:hover {
          transform: translateY(-4px);
        }

        .cp-card-image img {
          transition: transform 0.4s ease;
        }

        .cp-role-card:hover .cp-card-image img {
          transform: scale(1.035);
        }

        @media (max-width: 900px) {
          .cp-role-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .cp-role-card:last-child {
            grid-column: 1 / -1;
            max-width: calc(50% - 6px);
            width: 100%;
            margin: 0 auto;
          }

          .cp-ai-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .cp-title-area {
            flex-direction: column;
            align-items: flex-start !important;
          }

          .cp-title-area p {
            max-width: 550px !important;
          }
        }

        @media (max-width: 650px) {
          .cp-header {
            padding: 18px 20px !important;
          }

          .cp-nav {
            display: none !important;
          }

          .cp-header-buttons a:first-child {
            display: none;
          }

          .cp-header-buttons a:last-child {
            padding: 8px 14px !important;
            font-size: 12px !important;
          }

          .cp-title-area {
            margin-bottom: 28px !important;
          }

          .cp-title-area h1 {
            font-size: 34px !important;
          }

          .cp-role-grid {
            grid-template-columns: 1fr !important;
          }

          .cp-role-card:last-child {
            grid-column: auto;
            max-width: none;
          }

          .cp-card-image {
            height: 220px !important;
          }

          .cp-ai-heading {
            flex-direction: column;
            align-items: flex-start !important;
          }

          .cp-ai-grid {
            grid-template-columns: 1fr !important;
          }

          .cp-final {
            flex-direction: column;
            align-items: flex-start !important;
            padding: 30px 25px !important;
          }

          footer {
            padding: 20px !important;
            flex-direction: column;
            align-items: flex-start !important;
          }
        }

        @media (max-width: 420px) {
          .cp-title-area h1 {
            font-size: 30px !important;
          }

          .cp-card-image {
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   SMALL STYLE OBJECTS
========================================================= */

const navLink = {
  color: "inherit",
  textDecoration: "none",
};

const smallButton = {
  padding: "9px 16px",
  borderRadius: 8,
  fontSize: 12.5,
  fontWeight: 700,
  cursor: "pointer",
};
