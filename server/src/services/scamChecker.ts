import { AssessmentResult, WarningSignal, RiskLevel, ConfidenceLevel } from '../types';
import { sanitizePii } from './piiSanitizer';

interface ScamRule {
  id: string;
  category: 'urgency' | 'impersonation' | 'financial' | 'credentials' | 'fake_job' | 'investment' | 'digital_arrest' | 'remote_access';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  regex: RegExp;
  weight: number;
}

const SCAM_DETECTION_RULES: ScamRule[] = [
  // 1. Digital Arrest & Law Enforcement Impersonation (Extremely prevalent cybercrime)
  {
    id: 'digital_arrest_scam',
    category: 'digital_arrest',
    title: 'Digital Arrest / Fake Law Enforcement Threat',
    description: 'Impersonates police, CBI, FBI, customs, or court officials claiming an arrest warrant, money laundering charges, or parcel seized with drugs.',
    severity: 'critical',
    regex: /\b(digital arrest|narcotics bureau|cbi officer|cyber cell police|customs seized a parcel containing drugs|arrest warrant issued against your name|money laundering case registered|skype video call interrogation|transfer money to rbi verification account)\b/i,
    weight: 60,
  },
  // 2. Credential & OTP Harvesting
  {
    id: 'otp_password_request',
    category: 'credentials',
    title: 'Urgent Request for OTP, PIN, or Password',
    description: 'Legitimate institutions NEVER ask for your one-time password (OTP), ATM PIN, or master password. Sharing this grants direct access to your accounts.',
    severity: 'critical',
    regex: /\b(share the otp|send the 6-digit code|enter your atm pin|verify your password|provide your secret key|send recovery phrase|confirm your cvv|update kyc immediately or account will be suspended)\b/i,
    weight: 60,
  },
  // 3. Remote Access Software Coercion
  {
    id: 'remote_access_trojan',
    category: 'remote_access',
    title: 'Remote Screen-Sharing Request (Device Takeover)',
    description: 'Instructs you to install AnyDesk, TeamViewer, RustDesk, or QuickSupport. Scammers use this to monitor your banking screens and hijack transactions.',
    severity: 'critical',
    regex: /\b(install anydesk|download teamviewer|install rustdesk|quicksupport app|apk file download|allow remote access to solve issue)\b/i,
    weight: 45,
  },
  // 4. Guaranteed Investment / Crypto Fraud
  {
    id: 'crypto_investment_guarantee',
    category: 'investment',
    title: 'Guaranteed Unrealistic Investment Returns',
    description: 'Promises risk-free high returns or doubling cryptocurrency. All legitimate investments carry market risk; guaranteed high yields are hallmark signs of Ponzi schemes.',
    severity: 'high',
    regex: /\b(guaranteed (?:daily|weekly|monthly) returns|double your (?:crypto|bitcoin|eth|money)|100% risk[- ]free investment|ai automated trading bot with 500% profit|send 1 get 2|forex signals guaranteed profit|vip telegram investment group)\b/i,
    weight: 35,
  },
  // 5. Fake Job / Part-Time Telegram Task Scams
  {
    id: 'fake_job_task_scam',
    category: 'fake_job',
    title: 'Fake Task-Based Job Offer',
    description: 'Offers high daily pay for liking YouTube videos, rating Google Maps locations, or reviewing hotels, eventually demanding prepaid fees to release earnings.',
    severity: 'high',
    regex: /\b(earn (?:[$₹]|rs\.?)\s?\d{3,5}\s?(?:daily|per day)|part-time job liking youtube videos|hotel review task|work from home earn (?:5000|10000|500) per day|contact recruiter on telegram|no experience needed daily payout)\b/i,
    weight: 35,
  },
  // 6. Courier / Package Customs Fee Phishing
  {
    id: 'fake_courier_delivery',
    category: 'impersonation',
    title: 'Fake Parcel Delivery / Customs Payment Lure',
    description: 'Pretends to be FedEx, DHL, USPS, UPS, or India Post claiming an undelivered parcel with a tiny unpaid customs fee (e.g., $1.50 or Rs 25) to steal card details.',
    severity: 'high',
    regex: /\b(package cannot be delivered|update your address within 24 hours|unpaid customs duty|small redelivery fee of|parcel has been detained at depot|click link to reschedule delivery)\b/i,
    weight: 30,
  },
  // 7. Extreme Artificial Urgency & Account Cutoff
  {
    id: 'extreme_urgency_coercion',
    category: 'urgency',
    title: 'Severe Artificial Urgency & Coercive Deadline',
    description: 'Pressures the recipient to act impulsively under threat of immediate account suspension, electricity disconnection, or SIM card deactivation.',
    severity: 'high',
    regex: /\b(account will be permanently closed|suspended within 24 hours|electricity will be disconnected tonight at 9:30|sim card deactivated immediately|urgent action required now|last warning before legal action)\b/i,
    weight: 25,
  },
  // 8. Untraceable Payment Methods (Gift Cards, Crypto, Wire)
  {
    id: 'untraceable_payment_demand',
    category: 'financial',
    title: 'Demand for Untraceable Payment Methods',
    description: 'Requests payment via Apple Gift Cards, Google Play cards, Steam vouchers, Bitcoin, or peer-to-peer wire transfers that cannot be reversed.',
    severity: 'high',
    regex: /\b(pay using (?:apple|google play|steam|amazon) gift cards|buy voucher code|send usdt to address|pay via bitcoin wallet|wire transfer only)\b/i,
    weight: 35,
  },
  // 9. Lottery / Unsolicited Sweepstakes / Inheritance
  {
    id: 'lottery_prize_lure',
    category: 'financial',
    title: 'Unsolicited Lottery / Inheritance Winning',
    description: 'Claims you won a lottery or inherited millions you never entered, asking for an upfront "processing fee" or "clearance tax".',
    severity: 'high',
    regex: /\b(congratulations you have won (?:a lottery|the draw|kbc lottery)|unclaimed inheritance of \$|selected in the lucky draw|claim your prize by paying processing fee)\b/i,
    weight: 35,
  },
  // 10. Impersonation of Financial Institutions or Tax Bodies
  {
    id: 'financial_institution_impersonation',
    category: 'impersonation',
    title: 'Impersonation of Bank or Tax Agency',
    description: 'Claims to be your bank (SBI, HDFC, Chase, Wells Fargo), IRS, or Income Tax Department warning of fraudulent login attempts to steal credentials.',
    severity: 'medium',
    regex: /\b(dear customer your (?:sbi|hdfc|icici|chase|paypal|wells fargo|bank) account has been restricted|income tax refund approved click here|irs notice of immediate audit)\b/i,
    weight: 25,
  },
];

export function checkScamMessage(rawText: string): AssessmentResult {
  const { sanitizedText, redactedCount, redactedTypes } = sanitizePii(rawText.trim());
  const lowerText = sanitizedText.toLowerCase();

  const warningSignals: WarningSignal[] = [];
  let totalRiskScore = 0;
  const detectedCategories = new Set<string>();

  // Check all scam heuristics
  for (const rule of SCAM_DETECTION_RULES) {
    const match = lowerText.match(rule.regex);
    if (match) {
      totalRiskScore += rule.weight;
      detectedCategories.add(rule.category);
      warningSignals.push({
        id: rule.id,
        title: rule.title,
        severity: rule.severity,
        description: rule.description,
        evidenceSnippet: match[0],
      });
    }
  }

  // Detect suspicious URL indicators embedded in the message
  const urlRegex = /(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+|t\.me\/[^\s]+|wa\.me\/[^\s]+)/gi;
  const urlsFound = sanitizedText.match(urlRegex) || [];
  if (urlsFound.length > 0) {
    const hasShortener = urlsFound.some(u => /bit\.ly|tinyurl|t\.me|wa\.me|cutt\.ly|is\.gd/i.test(u));
    if (hasShortener) {
      totalRiskScore += 20;
      warningSignals.push({
        id: 'suspicious_link_shortener',
        title: 'Obfuscated Link or Chat Redirection',
        severity: 'high',
        description: 'Contains a shortened URL (bit.ly/tinyurl) or direct link to Telegram/WhatsApp. Scammers use link shorteners to disguise fraudulent domains.',
        evidenceSnippet: urlsFound[0],
      });
    } else {
      warningSignals.push({
        id: 'external_link_present',
        title: 'Embedded Web Link in Message',
        severity: 'medium',
        description: 'Message contains an external link. Never click links in unsolicited messages claiming account security or urgent action.',
        evidenceSnippet: urlsFound[0],
      });
      totalRiskScore += 10;
    }
  }

  // Cap risk score at 100
  const normalizedRiskScore = Math.min(totalRiskScore, 100);

  // Determine Risk Level & Confidence
  let riskLevel: RiskLevel = 'trustworthy';
  let confidenceLevel: ConfidenceLevel = 'moderate';
  let confidenceReasoning = '';
  let summary = '';
  const recommendedNextSteps: string[] = [];

  if (normalizedRiskScore >= 55) {
    riskLevel = 'high_risk';
    confidenceLevel = 'high';
    confidenceReasoning = `Multiple critical scam indicators matched (${warningSignals.length} high-severity warning signs identified).`;
    summary = `CRITICAL FRAUD ALERT: This message exhibits classic hallmarks of a ${Array.from(detectedCategories).join(', ')} scam. Do NOT interact, send funds, or click any links.`;
    
    recommendedNextSteps.push('DO NOT send money, cryptocurrency, or gift cards under any circumstances.');
    recommendedNextSteps.push('DO NOT share any OTP, passwords, bank account numbers, or Aadhaar/SSN.');
    recommendedNextSteps.push('DO NOT download AnyDesk, TeamViewer, or third-party APK files.');
    recommendedNextSteps.push('If this claims to be your bank or police, disconnect immediately and call the official phone number printed on the back of your bank card.');
    recommendedNextSteps.push('If money has already been lost, report immediately to your national cyber helpline (e.g. 1930 in India, IC3 in the US, 0300 123 2040 in the UK).');
  } else if (normalizedRiskScore >= 25) {
    riskLevel = 'suspicious';
    confidenceLevel = 'moderate';
    confidenceReasoning = 'Message exhibits warning signals such as urgency or embedded payment/link requests, but lacks full proof of coordinated fraud.';
    summary = 'SUSPICIOUS MESSAGE: Several cautionary signals detected. Further independent verification is strongly recommended before responding.';

    recommendedNextSteps.push('Verify the sender through an independent, official channel (not using the phone number or link provided in this message).');
    recommendedNextSteps.push('Check the sender email address or phone country code carefully for impersonation.');
    recommendedNextSteps.push('Never click links to "confirm identity" or "reschedule deliveries" without checking the official website directly.');
  } else if (sanitizedText.length < 20) {
    riskLevel = 'unverified';
    confidenceLevel = 'insufficient';
    confidenceReasoning = 'Input is too short to analyze conversational context or scam intent.';
    summary = 'Insufficient text to determine risk. Please paste the full message text, email body, or job offer.';
    recommendedNextSteps.push('Paste the full message text including any instructions or contact details.');
  } else {
    riskLevel = 'trustworthy';
    confidenceLevel = 'moderate';
    confidenceReasoning = 'No common scam triggers, high-pressure urgency cues, credential requests, or known fraudulent scripts detected.';
    summary = 'No typical scam indicators detected based on standard heuristics. Content appears to be standard communication.';

    recommendedNextSteps.push('Always practice general cyber safety: never share OTPs or passwords even in regular conversations.');
    recommendedNextSteps.push('If this conversation later requests money, gift cards, or remote access, re-scan it immediately.');
  }

  // Evidence Sources for educational context
  const evidenceSources = [
    {
      title: 'Common Scams and Prevention Guide',
      publisher: 'Federal Trade Commission (FTC)',
      url: 'https://consumer.ftc.gov/scams',
      publishDate: 'Continuous Advisory',
      verdict: 'True' as const,
      relevanceSummary: 'Educational baseline detailing high-pressure urgency tactics, imposter scams, and fake check schemes.',
    },
    {
      title: 'Citizen Cyber Safety Guidelines',
      publisher: 'Indian Cyber Crime Coordination Centre (I4C)',
      url: 'https://cybercrime.gov.in',
      publishDate: 'Current Standard',
      verdict: 'True' as const,
      relevanceSummary: 'Official warnings regarding Digital Arrest impersonation, KYC fraud, and illegal loan apps.',
    },
  ];

  return {
    id: `scan_scam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    category: 'message',
    inputExcerpt: sanitizedText.slice(0, 160) + (sanitizedText.length > 160 ? '...' : ''),
    riskLevel,
    riskScore: normalizedRiskScore,
    confidenceLevel,
    confidenceReasoning,
    summary,
    warningSignals,
    evidenceSources,
    recommendedNextSteps,
    disclaimer: 'TruthGuard AI scam evaluations are automated heuristic assessments. They do not constitute legal advice. Sophisticated targeted scams may evolve new language patterns not yet cataloged. When in doubt, always independently contact official institutions directly.',
    technicalDetails: {
      detectedRuleCount: warningSignals.length,
      categoriesTriggered: Array.from(detectedCategories),
      piiRedactedCount: redactedCount,
      redactedTypes,
      detectionEngine: 'TruthGuard Heuristic Anti-Fraud Engine v1.0',
    },
  };
}
