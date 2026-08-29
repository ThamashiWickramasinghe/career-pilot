<div align="center">

# 🧭 Career Pilot

**An AI-Powered Web Platform for IT Career Guidance, Personalized Skill Development and Intelligent Job Recommendation**

CIS 6002 – Software Engineering Dissertation Project
_Wepitiyage Thamashi Kaveena Wickramasinghe_

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)
![Flask](https://img.shields.io/badge/Backend-Flask-000000?logo=flask&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)
![XGBoost](https://img.shields.io/badge/ML-XGBoost-EB5E28)
![Gemini](https://img.shields.io/badge/AI-Gemini_API-8E75B2?logo=google-gemini&logoColor=white)
![License](https://img.shields.io/badge/License-Academic-lightgrey)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features)
- [Why AI?](#-why-ai)
- [Tech Stack](#️-tech-stack)
- [User Roles & Dashboards](#-user-roles--dashboards)
- [System Architecture](#️-system-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Branch Workflow](#-branch-workflow)
- [Project Status](#-project-status)
- [License](#-license)

---

## 📖 Overview

Career Pilot is an AI-powered career guidance and job recommendation platform built for IT students, graduates, and job seekers. Instead of forcing users to juggle separate platforms for career planning, skill development, and job hunting, Career Pilot brings AI-based job matching, skill gap analysis, personalized career roadmap generation, a live skill challenge engine, and a learning hub together into one centralized system.

The platform supports **four user roles** — Job Seeker, Instructor, Company, and Admin — each with a dedicated dashboard, feature set, and color theme.

## ✨ Core Features

| Feature | Description |
|---|---|
| 🧩 AI Career Quiz | 14 categories, 140 questions, with anti-cheat measures (timers, tab-switch detection, shuffled options) |
| 🤖 AI Analysis Engine | Top-3 career predictions, skill gap analysis, course recommendations, and job matching from one quiz submission |
| 🗺️ Career Roadmap | Gemini-powered chatbot-style roadmap generation |
| 🏆 Live Skill Challenge Engine | AI-evaluated skill challenges with badge awards |
| 📚 Learning Hub | Video/PDF/notes content with admin approval workflow and 30-day access control |
| 💼 Job Portal | Companies post vacancies; job seekers apply with cover letters and track status |
| 🛠️ Admin Dashboard | Content approval, analytics, reports, notifications, and user management |
| 🔐 Authentication | Register, login, forgot/reset password (JWT-based) |

## 🧠 Why AI?

Traditional career guidance relies on manual counselling and generic advice that doesn't account for a user's actual skills, interests, and goals. Existing platforms (LinkedIn, Indeed, Coursera, HackerRank, etc.) each solve one piece of the puzzle — recruitment, learning, or skill assessment — but none combine them into a single, personalized, data-driven system. Career Pilot closes this gap by analyzing user profiles holistically and generating recommendations that adapt as skills and industry demands change.

## 🛠️ Tech Stack

**Frontend**
- React.js + Tailwind CSS, bundled with Vite (`localhost:5173`)
- React Router
- Recharts for data visualization
- Inline style objects with a centralized `C` design-token system per component

**Backend**
- Python Flask (`localhost:5000`)
- Flask-JWT-Extended — authentication
- Flask-Mail — email notifications
- bcrypt — password hashing
- SQLAlchemy — ORM
- MySQL via WAMP / phpMyAdmin

**AI / ML**
- XGBoost + label encoder — career prediction
- Sentence Transformer + TF-IDF + cosine similarity — job matching & course recommendations
- Gemini API (`gemini-2.0-flash`) — career roadmap generation & skill challenge evaluation

## 👥 User Roles & Dashboards

| Role | Purpose | Primary Palette |
|---|---|---|
| **Job Seeker** | Take the AI quiz, view career predictions, follow roadmaps, apply for jobs | Yellow `#F5EE9A`, dark sidebar `#1a1a2e`, purple accents |
| **Instructor** | Manage Learning Hub content, review submissions | Navy `#102A43`, accent blue `#1769E0` |
| **Company** | Post vacancies, review applicants | Burgundy/espresso `#A8434B` / `#5C0E04` |
| **Admin** | Approve content, manage users, view analytics & reports | Soft blue `#6C93C7`, white cards, pastel accents |

## 🏗️ System Architecture

```
┌─────────────────────┐
│  Presentation Layer  │  React SPA (Vite, Tailwind, Recharts)
└──────────┬───────────┘
           │ REST API
┌──────────▼───────────┐
│  Application Layer    │  Flask (auth, business logic, orchestration)
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│      AI Layer          │  XGBoost · Sentence Transformer/TF-IDF · Gemini API
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│      Data Layer        │  MySQL (via WAMP/phpMyAdmin)
└─────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- Python 3.x
- MySQL (via WAMP or standalone)
- A Gemini API key

### Clone the repo
```bash
git clone https://github.com/ThamashiWickramasinghe/career-pilot.git
cd career-pilot
```

### Frontend setup
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python app.py
# API runs at http://localhost:5000
```

## 🔑 Environment Variables

Create a `.env` file in `backend/` with:

```env
DATABASE_URL=mysql+pymysql://<user>:<password>@localhost/career_pilot
JWT_SECRET_KEY=your_jwt_secret
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_email_app_password
GEMINI_API_KEY=your_gemini_api_key
```

## 📂 Project Structure

```
career-pilot/
├── frontend/          # React + Vite + Tailwind app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
├── backend/           # Flask API
│   ├── models/
│   ├── routes/
│   ├── ai/            # XGBoost model, encoders, matching logic
│   └── app.py
└── README.md
```

## 🌿 Branch Workflow

Development happens on `develop` and is merged into `main` for stable releases.

```bash
git checkout develop
# make changes
git add .
git commit -m "feat: description of change"
git push origin develop
# merge develop → main when ready
```

## 📌 Project Status

Actively in development as part of a dissertation project. Core AI quiz, analysis, roadmap, skill challenge, learning hub, job portal, and admin features are implemented; UI/UX refinement across all role dashboards is ongoing.

**Known issue:** AI full-analysis endpoint (`/ai/full-analysis`) occasionally fails silently — under investigation.


---

<div align="center">
Made with by Wepitiyage Thamashi Kaveena Wickramasinghe
</div>
