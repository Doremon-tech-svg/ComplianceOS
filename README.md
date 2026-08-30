# ComplianceOS

> One app for everything a small business needs to stay legal, access money, and grow.

Built for India's 6.3 crore MSME owners — shopkeepers, manufacturers, service providers, street vendors. ComplianceOS replaces the chaos of GST portals, missed deadlines, unknown schemes, and overloaded CAs with a single AI-powered platform.

---

## Table of Contents

- [What it does](#what-it-does)
- [The Five Agents](#the-five-agents)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Routes](#routes)
- [Authentication](#authentication)
- [Pricing & Tiers](#pricing--tiers)
- [Revenue Model](#revenue-model)
- [Fraud Protection](#fraud-protection)
- [Team](#team)

---

## What it does

Most Indian MSMEs miss compliance deadlines not because they don't care, but because the system is designed for lawyers, not shopkeepers. ComplianceOS fixes that with five AI agents that work together:

- **ARIA** onboards you in Hindi or English and builds your business profile
- **VEDA** reads every document you upload and auto-fills your compliance calendar
- **SCOUT** finds every government scheme you're eligible for and pre-fills the applications
- **PATHWAY** navigates government portals for you, scheduling submissions at off-peak hours
- **SENTINEL** monitors regulatory changes 24/7 and alerts you in plain language

---

## The Five Agents

### ARIA — Adaptive Registration & Intelligence Agent
The brain of the platform. Every other agent runs on what ARIA knows.

- Conversational onboarding in Hindi + 8 regional languages + English
- Voice input for low-literacy users
- Builds a persistent Business Profile (type, sector, size, turnover, location, registrations, gender)
- Pulls Udyam registration data via official API
- Auto-flags women-led enterprise benefits (20% discount on Growth, 30% on Pro)
- Controls what renders on every page — schemes, calendar, notices — all filtered by profile

### VEDA — Vault Extraction & Deadline Agent
Reads every document you upload. Extracts what matters. Never lets you miss a deadline.

- Accepts: GST certificate, PAN, Udyam, invoices, bank statements, licenses, loan letters, payroll data
- OCR engine handles scanned documents, regional language documents, handwritten entries
- Auto-populates Compliance Calendar with every extracted deadline
- Tracks license renewals (Shop Act, FSSAI, trade license) — not just tax deadlines
- Priority Notice Board: Red (overdue), Amber (due in 7 days), Green (upcoming)
- All documents stored in encrypted Compliance Vault with timestamps

### SCOUT — Scheme & Subsidy Discovery Agent
Finds money the government already set aside for you. Fills the forms. Gets it verified.

- Cross-references Business Profile + documents to find only eligible schemes
- Scheme Match Score on every card (e.g. "91% match")
- Sources: Central schemes, state schemes, district-level schemes, bank-linked schemes
- Women-led enterprise schemes surfaced automatically (Udyogini, Mahila Udyam Nidhi, Stand-Up India)
- Pre-fills application forms using known profile data — user just reviews
- Human verification step before any submission

### PATHWAY — Government Portal Navigation Agent
Gets you to the right government page with your data already filled in.

- Step-by-step registration roadmap with deep links for new businesses
- Smart Scheduling Engine: detects portal load patterns, schedules at off-peak hours (2–5 AM IST)
- Form Pre-fill Cache: all data pre-staged so submission is instant
- Manual Filing Queue: if API fails, data is queued and retried automatically
- Fallback: if portal is unreachable for 24 hours, flags to CA for manual assisted filing

### SENTINEL — Regulatory Watch Agent
Monitors the government so you don't have to. Catches 2 AM circulars before they become your problem.

- 24/7 monitoring of GST Council notifications, MCA circulars, Labour Code gazette, RBI circulars
- Extracts what changed and maps impact to each affected business profile
- Pushes plain-language alerts: "New GST circular affects your textile business in UP."
- Labour Codes 2026 compliance engine built in — tracks implementation state-by-state

---

## Tech Stack

### Frontend
| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Styling | Tailwind CSS (custom `cs-*` color system) |
| State | Zustand |
| Auth state | localStorage via `utils/helpers.js` |
| Icons | Lucide React |

### Backend
| Layer | Choice |
|---|---|
| Runtime | Python (FastAPI) |
| AI / LLM | Groq (`llama3-70b-8192`) via LangChain |
| Primary DB | PostgreSQL (via Supabase) |
| ORM | SQLAlchemy (async) |
| Document store | MongoDB (raw OCR output, agent logs) |
| Queue | Redis + Celery (deadline alerts, portal scheduling) |
| OCR | Custom OCR service (`app/services/ocr_service.py`) |

### Payments
| Feature | Tool |
|---|---|
| User subscriptions | Razorpay Subscriptions API |
| CA dashboard subscriptions | Razorpay (separate plan IDs) |
| CA consultation split | Razorpay Route (split payments) |
| Invoicing | Auto-generated GST-compliant PDF per payment |

### AI Models
- **ARIA, VEDA, SCOUT, PATHWAY, SENTINEL** — all powered by `llama3-70b-8192` via Groq
- **Fraud Shield** — same model, separate detection prompts per fraud type
- **Scheme matching** — pgvector similarity search + LLM ranking

---

## Project Structure

```
complianceos/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx              # Homepage with Business/CA toggle + login modal
│   │   ├── Onboarding.jsx           # ARIA chat-based registration
│   │   ├── Dashboard.jsx            # Business owner main dashboard
│   │   ├── Calendar.jsx             # Compliance calendar
│   │   ├── Documents.jsx            # VEDA document vault
│   │   ├── Schemes.jsx              # SCOUT scheme discovery
│   │   ├── Registration.jsx         # PATHWAY registration hub
│   │   ├── CAConnect.jsx            # CA booking and consultation
│   │   ├── Loans.jsx                # FINPILOT loan discovery
│   │   ├── Notices.jsx              # Priority notice board
│   │   ├── Profile.jsx              # User profile management
│   │   ├── FraudShieldPage.jsx      # Identity + document + shell business detection
│   │   └── ca/
│   │       ├── CADashboard.jsx      # CA client management portal
│   │       └── CAFraudShield.jsx    # CA signature fraud protection
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── Footer.jsx
│   │   └── ui/
│   │       ├── Common.jsx           # Button, Input, etc.
│   │       ├── MetricCard.jsx
│   │       ├── StatusBadge.jsx
│   │       └── ProgressBar.jsx
│   ├── services/
│   │   └── groqService.js           # Groq API wrapper (groqChat function)
│   ├── utils/
│   │   ├── helpers.js               # Auth: getToken, setToken, getRole, clearAuth
│   │   ├── profileStore.js          # Business profile state (setProfile, getProfile)
│   │   └── constants.js             # Mock data: deadlines, documents
│   └── App.jsx                      # Route definitions + auth guards
│
├── app/                             # Python backend
│   ├── agents/
│   │   ├── aria_agent.py            # Onboarding conversational agent
│   │   ├── veda_agent.py            # Document extraction agent
│   │   ├── scout_agent.py           # Scheme discovery agent
│   │   ├── pathway_agent.py         # Portal navigation agent
│   │   └── sentinel_agent.py        # Regulatory monitoring agent
│   ├── models/
│   │   ├── business.py              # BusinessProfile SQLAlchemy model
│   │   └── compliance.py            # ComplianceDeadline model
│   ├── services/
│   │   └── ocr_service.py           # Document text extraction
│   ├── database.py                  # PostgreSQL + MongoDB + Redis connections
│   └── config.py                    # Settings (GROQ_API_KEY, DB URLs, etc.)
│
├── .env                             # Environment variables (never commit)
├── package.json
├── requirements.txt
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- MongoDB
- Redis
- A Groq API key (free at [console.groq.com](https://console.groq.com))
- A Razorpay account (for payments)

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173`.

### Backend

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

### Database setup

```bash
# Run Prisma migrations (if using Prisma for schema)
npx prisma migrate dev

# Or run SQL migrations directly against your PostgreSQL instance
```

---

## Environment Variables

Create a `.env` file in the project root. **Never commit this file.**

```env
# Groq (LLM for all agents + fraud detection)
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# Backend config
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama3-70b-8192

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/complianceos
MONGODB_URL=mongodb://localhost:27017/complianceos
REDIS_URL=redis://localhost:6379

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx

# Supabase (if using Supabase for auth + DB)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxx
```

### Razorpay plan IDs

Create these once in your Razorpay dashboard and paste the IDs here:

```env
RZP_PLAN_GROWTH_MONTHLY=plan_xxxxxxxxxxxx
RZP_PLAN_GROWTH_ANNUAL=plan_xxxxxxxxxxxx
RZP_PLAN_PRO_MONTHLY=plan_xxxxxxxxxxxx
RZP_PLAN_PRO_ANNUAL=plan_xxxxxxxxxxxx
RZP_PLAN_CA_LITE=plan_xxxxxxxxxxxx
RZP_PLAN_CA_PRO=plan_xxxxxxxxxxxx
```

---

## Routes

### Public
| Path | Page |
|---|---|
| `/` | Landing — Business/CA toggle, login modal, pricing |
| `/onboarding` | ARIA chat-based business registration |

### Business owner (requires login, non-CA)
| Path | Page |
|---|---|
| `/dashboard` | Overview: notices, scheme cards, savings tracker |
| `/calendar` | Compliance calendar with deadlines |
| `/documents` | VEDA document vault (Growth+ only) |
| `/schemes` | SCOUT scheme discovery |
| `/registration` | PATHWAY registration hub |
| `/ca-connect` | CA directory and booking |
| `/loans` | FINPILOT loan discovery |
| `/notices` | Priority notice board |
| `/profile` | Business profile management |
| `/fraud-shield` | Identity + document + shell business fraud detection |

### CA (requires login, CA role only)
| Path | Page |
|---|---|
| `/ca/dashboard` | Client management, approvals, compliance calendar |
| `/ca/fraud-shield` | Workload guard, velocity checker, booking detector |

---

## Authentication

Auth is handled client-side via `localStorage` using three keys:

```js
cos_token    // session token
cos_role     // "business_owner" | "msme_owner" | "enterprise" | "individual" | "ca"
cos_user_id  // user ID
```

Helper functions live in `src/utils/helpers.js`:

```js
getToken()       // read token
setToken(v)      // write token
getRole()        // read role
setRole(v)       // write role
clearAuth()      // logout — clears all three keys
isCA()           // true if role === "ca"
isMSME()         // true if role === "msme_owner"
```

The `ProtectedRoute` component in `App.jsx` wraps all authenticated pages:

```jsx
// caOnly  → redirects non-CAs to /dashboard
// noCA    → redirects CAs to /ca/dashboard
<ProtectedRoute caOnly>...</ProtectedRoute>
<ProtectedRoute noCA>...</ProtectedRoute>
```

**Demo logins** are available from the landing page for all user types — no account needed to explore the product.

---

## Pricing & Tiers

### Business plans

| Feature | Free | Growth ₹249/mo | Pro ₹649/mo |
|---|---|---|---|
| ARIA onboarding | ✓ | ✓ | ✓ |
| Scheme recommendations | 3 only | All matches | All matches |
| VEDA document uploads | — | Unlimited | Unlimited |
| Compliance deadline alerts | View only | WhatsApp + email | WhatsApp + email |
| PATHWAY smart scheduling | Basic | Full | Priority |
| SENTINEL regulation alerts | — | ✓ | ✓ |
| CA consultation included | — | 1/month | 1/month |
| Compliance Vault storage | — | 3 years | 7 years + export |
| FINPILOT loan advisory | — | ✓ | ✓ |
| Women-led discount | — | 20% off | 30% off |
| Ads | Yes | No | No |
| Multi-business profiles | — | — | ✓ |

### CA plans

| Feature | CA Lite ₹749/mo | CA Pro ₹1,599/mo |
|---|---|---|
| Client profiles | Up to 10 | Unlimited |
| Shared compliance calendar | ✓ | ✓ |
| Approve / reject applications | ✓ | ✓ |
| Document annotation | ✓ | ✓ |
| API access | — | ✓ |
| Verified CA badge | — | ✓ |
| Revenue dashboard | — | ✓ |
| White-label client reports | — | ✓ |
| Free trial | 14 days | 14 days |

---

## Revenue Model

| Stream | How |
|---|---|
| User subscriptions | ₹249–₹649/month via Razorpay |
| CA dashboard subscriptions | ₹749–₹1,599/month via Razorpay |
| CA consultation commission | 15–20% cut via Razorpay Route (split payments) |
| Hyperlocal ads (free tier) | CPM/CPC by district + sector |
| Scheme sponsor slots | Banks, NBFCs, state bodies pay for featured placement |
| Bank account referrals | ₹500–₹1,500 per account opened |
| Loan DSA commission | 0.5–1% of disbursed loan amount |
| MSME insurance cross-sell | 14–15% referral commission |
| Compliance courses | ₹499–₹999 per course (GST filing, Udyam, FSSAI basics) |
| Govt data partnerships | Annual licensing to state MSME departments |
| Whitelabel / B2G | State MSME portals pay for platform access |

**Year 1 target:** ₹1.4 Cr | **Year 2:** ₹11.5 Cr | **Year 3:** ₹63 Cr

---

## Fraud Protection

ComplianceOS has two fraud detection systems built in.

### FraudShieldPage (`/fraud-shield`) — for business-side fraud
Three AI-powered detection panels using Groq:

1. **Identity Fraud** — PAN deduplication, Aadhaar linkage check, name-vs-govt-record matching
2. **Document Forgery** — compares uploaded document against direct govt portal fetch; catches inflated figures and tampered PDFs
3. **Shell Business** — activity pattern analysis before any loan referral; blocks businesses with zero compliance footprint

### CAFraudShield (`/ca/fraud-shield`) — for CA signature fraud
Solves the "overloaded CA rubber-stamp" crisis:

1. **Workload Guard** — checks CA's current queue depth before admitting a new urgent booking; blocks bookings when cognitive overload risk is HIGH
2. **Approval Velocity Checker** — timestamps every approval; voids any approval that falls below safe minimum review time (600s for loan guarantees, 480s for bank statements, etc.)
3. **Booking Detector** — screens incoming bookings for fraud patterns before the CA ever sees them; new account + same-day urgency + high-value loan documents = declined automatically

All fraud detection uses `llama3-70b-8192` via Groq with structured JSON output.

---

## Team

Built by a team of 4 using AI-assisted development.

| Role | Owns |
|---|---|
| Frontend Lead | React pages, Razorpay checkout UI, FeatureGate component |
| Backend Lead | FastAPI, Razorpay webhooks, Prisma schema, commission ledger |
| AI / Agents Lead | ARIA, VEDA, SCOUT, SENTINEL prompts and pipelines |
| Infra + Admin Lead | Deployment, admin panel, CA KYC, Redis jobs, revenue dashboard |

---

## Defensibility

| Moat | Why it holds |
|---|---|
| Data | Every profile, document, and filing makes scheme matching smarter over time |
| Switching cost | Compliance history + vault + calendar — users can't leave without losing everything |
| Network effects | CA network + freelancer network grow in value as platform scales |
| Government trust | Verified MSME audience is worth paying to reach — B2G revenue line |
| Language access | Hindi + regional language support locks in Tier 2/3 cities competitors ignore |

---

## License

Private — all rights reserved. Not open source.
