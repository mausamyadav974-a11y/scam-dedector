# TruthGuard AI — A Free, Privacy-First Fake News & Scam Checker

> **"Verify Before You Trust."**  
> A modern, accessible, zero-retention web application that helps people identify fake news, fraudulent claims, phishing URLs, scam messages, fake job offers, investment fraud, and online extortion.

---

## 🛡️ Key Features & Capabilities

### 1. Fake News & Claim Verification
* **Claim Extraction:** Extracts concrete assertions (dates, figures, medical claims, legal orders).
* **Credible Cross-Referencing:** Cross-checks claims against accredited International Fact-Checking Network (IFCN) signatories and official advisories (Reuters Fact Check, AP Fact Check, Snopes, PIB Fact Check, Alt News, WHO Mythbusters).
* **Nuanced Categorization:** Distinguishes verified facts, disputed claims, satire/parody, outdated information, and insufficient evidence.
* **Humility & Objectivity:** Never labels a news story as definitely fake without sufficient supporting evidence. When evidence is inconclusive, it explicitly returns *Unverified*.

### 2. Scam Message & Email Checker
* **Multi-Vector Fraud Detection:** Detects Digital Arrest threats, law enforcement impersonation (police/CBI/FBI), urgent account blocking, OTP & password theft, fake task-based job scams (e.g., liking YouTube videos), and crypto doubling schemes.
* **Client-Side PII Scrubbing:** Strips telephone numbers, email addresses, credit/debit card numbers, Aadhaar, and SSN locally in the browser before data leaves the user's machine.
* **Explainable Warning Signs:** Every warning signal includes severity ratings (Critical, High, Medium, Info) and plain-language explanations.

### 3. SSRF-Isolated URL & Security Checker
* **Strict SSRF & Cloud Metadata Protection:** Blocks access to `localhost`, `127.0.0.1`, RFC 1918 private IPv4 ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), IPv6 loopbacks (`::1`), and cloud metadata IP (`169.254.169.254`).
* **Typosquatting & Homoglyph Detection:** Detects lookalike brand impersonation (e.g., `paypal-security-verify.xyz`, `arnazon.com`, Cyrillic homoglyphs, and Punycode `xn--` deceptive domains).
* **The HTTPS Myth Demystified:** Explicitly alerts users that HTTPS encryption does *not* mean a website is legitimate (over 80% of phishing sites also use HTTPS).
* **Zero Browser Execution:** Never opens untrusted URLs in the user's browser or runs untrusted scripts.

### 4. Explainable Results
* **Transparent Risk Categories:**
  - 🟢 **Likely Trustworthy** — No threat indicators or verified by reputable sources.
  - 🟡 **Suspicious** — Further independent verification recommended.
  - 🔴 **High Risk** — Strong indicators of fraud, typosquatting, or known phishing.
  - ⚪ **Unverified** — Insufficient evidence available.
* **Evidence Strength vs. Probability:** Transparently distinguishes confidence in the analysis from arbitrary pseudo-scientific fraud probabilities.

### 5. Community & Educational Support
* **Anonymous Scam Reporting:** Privacy-preserving community reporting with client-side data minimization preview.
* **Emergency Regional Helplines:** Quick access to national cybercrime portals (India 1930 / `cybercrime.gov.in`, US FBI IC3 / FTC, UK Action Fraud, Canada CAFC, Australia Scamwatch).
* **Interactive Scam Prevention Quiz:** Scenario-based simulator teaching users to spot red flags in real-world SMS, emails, and calls.
* **Device-Only Local History:** Private scan bookmarks stored purely in `localStorage` with a 1-click permanent wipe feature.
* **Bilingual Readiness:** Seamless toggle between English and Hindi (हिन्दी).

---

## 🔒 Privacy-First Architecture

| Feature | TruthGuard AI Implementation |
|---|---|
| **Account Required** | ❌ None. 100% free with no login or registration. |
| **Personal Data Collection** | ❌ None. No names, phone numbers, or emails collected. |
| **Client-Side Redaction** | ✅ Active. PII sanitizer scrubs sensitive numbers in browser before transmission. |
| **Server-Side Retention** | ❌ Zero-retention. Submissions processed in RAM and never written to disk or database. |
| **Tracking & Cookies** | ❌ Zero third-party trackers, Google Analytics, or Meta Pixels. |
| **External AI Training** | ❌ User submissions are never sold or used to train third-party LLMs. |

---

## 🚀 Quick Start & Installation

### Prerequisites
* Node.js 18+ (Node 20+ recommended)
* npm 9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/truthguard-ai.git
cd truthguard-ai
npm install
```

### 2. Environment Variables
Copy `.env.example` in `server/`:
```bash
cp server/.env.example server/.env
```
Default configuration:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Run Development Servers
To start both client and server simultaneously:
```bash
# Terminal 1: Start Backend (Express API)
npm run dev:server

# Terminal 2: Start Frontend (Vite + React)
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

### 5. Run Automated Tests
```bash
npm run test
```

---

## 🏛️ Project Structure

```
truthguard-ai/
├── client/                     # Vite + React 18 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Header with language & history toggles
│   │   │   ├── Hero.tsx               # Value proposition & trust indicators
│   │   │   ├── CheckerSection.tsx     # News, Scam, and URL input tabs with presets
│   │   │   ├── ResultDisplay.tsx      # Risk status, confidence meter & evidence sources
│   │   │   ├── LocalHistoryModal.tsx  # Device-only scan history with 1-click wipe
│   │   │   ├── LearnSection.tsx       # Scam guides & interactive "Spot the Scam" quiz
│   │   │   ├── RegionalResources.tsx  # Helplines (India 1930, US IC3, UK Action Fraud)
│   │   │   ├── AnonymousReportModal.tsx # Privacy-first scam reporting modal
│   │   │   ├── FeedbackModal.tsx      # False positive/negative reporting
│   │   │   ├── PrivacySection.tsx     # Plain-language data flow policy
│   │   │   ├── AboutSection.tsx       # Methodology, limitations & FAQ
│   │   │   └── Footer.tsx             # Disclaimers & emergency links
│   │   ├── services/
│   │   │   ├── api.ts                 # Backend client with automatic fallback
│   │   │   ├── clientHeuristics.ts    # Standalone browser-side offline detection engine
│   │   │   ├── sanitizer.ts           # Client-side PII scrubbing engine
│   │   │   └── storage.ts             # LocalStorage manager
│   │   ├── translations/              # English & Hindi (हिन्दी) dictionaries
│   │   ├── types/                     # Shared TypeScript interfaces
│   │   ├── App.tsx                    # Main layout & state orchestrator
│   │   └── main.tsx                   # React root entry
│   └── package.json
│
├── server/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── services/
│   │   │   ├── newsChecker.ts         # Fact extraction & claim cross-referencing
│   │   │   ├── scamChecker.ts         # Multi-vector fraud detection heuristics
│   │   │   ├── urlChecker.ts          # SSRF-isolated URL inspection & typosquatting
│   │   │   ├── piiSanitizer.ts        # Zero-retention PII cleaner
│   │   │   └── reportStore.ts         # Anonymous community scam repository
│   │   ├── routes/
│   │   │   ├── checkRoutes.ts         # /api/check/news, /scam, /url
│   │   │   ├── reportRoutes.ts        # /api/report
│   │   │   └── feedbackRoutes.ts      # /api/feedback
│   │   ├── middleware/
│   │   │   └── security.ts            # Zero-retention logging & payload validation
│   │   ├── tests/
│   │   │   └── checker.test.ts        # Automated security & heuristic unit tests
│   │   └── index.ts                   # Express server entry
│   └── package.json
│
└── package.json                # Root workspace configuration
```

---

## 🔒 Security Best Practices & OWASP Conformance

1. **Server-Side Request Forgery (SSRF) Defense:**
   - Strict protocol whitelisting (only `http:` and `https:`).
   - Domain resolution check: private and loopback IP addresses (RFC 1918, RFC 3927) and cloud metadata (`169.254.169.254`) are immediately rejected.
2. **Input Validation & DoS Mitigation:**
   - Strict 50KB payload limits on JSON endpoints.
   - Rate limiting: 120 requests per 15 minutes per IP.
3. **Defense Against Prompt Injection & Unsafe Execution:**
   - Input texts are processed purely as untrusted data using deterministic pattern extractors and strict semantic heuristics.
   - Submitted links are never fetched or rendered directly in the user's browser.
4. **Security Headers:**
   - Enforced Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, and X-Content-Type-Options via Helmet.

---

## ⚖️ Legal Disclaimer

TruthGuard AI provides automated heuristic evaluations and references independent, accredited fact-checking records. It is designed as an informational and educational aid. It does not replace professional legal, financial, or cyber law enforcement counsel. If you have been defrauded, immediately contact your financial institution and official national cybercrime authorities.
