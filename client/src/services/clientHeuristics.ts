import { AssessmentResult, RiskLevel, ConfidenceLevel, WarningSignal } from '../types';
import { sanitizePiiClient } from './sanitizer';

// Known fact-check references for client-side offline evaluation
const OFFLINE_FACT_CHECKS = [
  {
    keywords: ['lemon', 'cancer', 'chemotherapy', 'kill cells'],
    verdict: 'False' as const,
    risk: 'high_risk' as RiskLevel,
    publisher: 'Reuters Fact Check',
    title: 'Hot lemon water does not cure or destroy cancer cells',
    url: 'https://www.reuters.com/fact-check',
    date: '2023-04-12',
    explanation: 'There is no medical evidence that hot lemon water cures or destroys cancer.',
  },
  {
    keywords: ['5g', 'covid', 'radiation', 'virus'],
    verdict: 'False' as const,
    risk: 'high_risk' as RiskLevel,
    publisher: 'World Health Organization',
    title: '5G mobile networks do not spread COVID-19',
    url: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters',
    date: '2022-08-15',
    explanation: 'Viruses cannot travel on radio waves or mobile networks.',
  },
  {
    keywords: ['pib', 'free laptop', 'prime minister', 'scheme', 'registration fee'],
    verdict: 'False' as const,
    risk: 'high_risk' as RiskLevel,
    publisher: 'PIB Fact Check',
    title: 'Government free laptop scheme message is fake',
    url: 'https://factcheck.pib.gov.in',
    date: '2024-01-05',
    explanation: 'Government of India has announced no such laptop scheme. The link is fraudulent.',
  },
];

export function clientCheckNews(rawText: string): AssessmentResult {
  const { sanitizedText } = sanitizePiiClient(rawText);
  const lower = sanitizedText.toLowerCase();

  const warningSignals: WarningSignal[] = [];
  let riskLevel: RiskLevel = 'unverified';
  let riskScore = 25;
  let confidence: ConfidenceLevel = 'low';
  let reasoning = 'Client-side offline heuristic analysis.';
  let summary = 'Claim evaluated offline against local fact-checking index.';

  // Check known fact checks
  const match = OFFLINE_FACT_CHECKS.find(f => f.keywords.filter(k => lower.includes(k)).length >= 2);

  if (match) {
    riskLevel = match.risk;
    confidence = 'high';
    riskScore = 85;
    reasoning = `Direct offline match with independent fact check by ${match.publisher}.`;
    summary = `Debunked viral claim cataloged by ${match.publisher}.`;
    warningSignals.push({
      id: 'offline_fact_match',
      title: `Fact-Check Refutation (${match.publisher})`,
      severity: 'high',
      description: match.explanation,
    });
  } else if (/\b(shocking|miracle cure|doctors hate this|government is hiding|forward before deleted|100% guaranteed)\b/i.test(lower)) {
    riskLevel = 'suspicious';
    riskScore = 65;
    confidence = 'moderate';
    reasoning = 'Sensationalist or conspiracy language detected.';
    summary = 'High degree of emotional manipulation and unverified assertions detected.';
    warningSignals.push({
      id: 'sensational_offline',
      title: 'Sensationalist Language Patterns',
      severity: 'high',
      description: 'Text uses urgency, sensationalism, or claims of suppression.',
    });
  }

  return {
    id: `local_news_${Date.now()}`,
    timestamp: new Date().toISOString(),
    category: 'news',
    inputExcerpt: sanitizedText.slice(0, 150),
    riskLevel,
    riskScore,
    confidenceLevel: confidence,
    confidenceReasoning: reasoning,
    summary,
    warningSignals,
    extractedClaims: [sanitizedText.slice(0, 120)],
    evidenceSources: match ? [{
      title: match.title,
      publisher: match.publisher,
      url: match.url,
      publishDate: match.date,
      verdict: match.verdict,
      relevanceSummary: match.explanation,
    }] : [{
      title: 'International Fact-Checking Network Standards',
      publisher: 'IFCN Poynter',
      url: 'https://www.poynter.org/ifcn/',
      publishDate: 'Current',
      verdict: 'Unproven',
      relevanceSummary: 'No direct debunk or verification found in local cache. Independent verification advised.',
    }],
    recommendedNextSteps: [
      'Search for the exact headline in Google News or Reuters.',
      'Check if reputable national news agencies have covered the story.',
      'Do not forward unverified medical or legal claims.',
    ],
    disclaimer: 'Evaluated locally in your browser. TruthGuard automated checks are informational aids and not scientific guarantees.',
    isOfflineFallback: true,
  };
}

export function clientCheckScam(rawText: string): AssessmentResult {
  const { sanitizedText, redactedCount } = sanitizePiiClient(rawText);
  const lower = sanitizedText.toLowerCase();

  const warningSignals: WarningSignal[] = [];
  let score = 0;

  if (/\b(digital arrest|narcotics bureau|cbi officer|cyber cell police|customs parcel drugs|arrest warrant)\b/i.test(lower)) {
    score += 50;
    warningSignals.push({
      id: 'offline_digital_arrest',
      title: 'Digital Arrest / Police Impersonation',
      severity: 'critical',
      description: 'Pretends to be law enforcement threatening arrest over a parcel. Police never conduct arrests or interrogations via Skype/WhatsApp.',
    });
  }

  if (/\b(share otp|enter pin|send password|update kyc immediately|account permanently closed)\b/i.test(lower)) {
    score += 45;
    warningSignals.push({
      id: 'offline_otp_threat',
      title: 'OTP / Credential Harvesting Request',
      severity: 'critical',
      description: 'Demands OTP, PIN, or password under threat of account blocking. Legitimate banks never request OTPs.',
    });
  }

  if (/\b(earn \d{3,5} daily|part-time job liking youtube|hotel review task|telegram task group)\b/i.test(lower)) {
    score += 40;
    warningSignals.push({
      id: 'offline_job_scam',
      title: 'Fake Task-Based Job Scam',
      severity: 'high',
      description: 'Offers high daily payouts for rating videos or maps, then demands deposits to release funds.',
    });
  }

  if (/\b(install anydesk|download teamviewer|rustdesk|quicksupport)\b/i.test(lower)) {
    score += 45;
    warningSignals.push({
      id: 'offline_remote_tool',
      title: 'Remote Screen-Sharing Coercion',
      severity: 'critical',
      description: 'Instructs installation of remote access tools like AnyDesk to monitor banking screens.',
    });
  }

  if (/\b(gift cards|bitcoin wallet|send usdt|wire transfer only)\b/i.test(lower)) {
    score += 35;
    warningSignals.push({
      id: 'offline_untraceable_pay',
      title: 'Untraceable Payment Method Demand',
      severity: 'high',
      description: 'Demands cryptocurrency or gift cards that cannot be charged back or refunded.',
    });
  }

  let riskLevel: RiskLevel = 'trustworthy';
  let confidence: ConfidenceLevel = 'moderate';
  let summary = 'No common fraud patterns detected in this message.';

  if (score >= 50) {
    riskLevel = 'high_risk';
    confidence = 'high';
    summary = 'CRITICAL FRAUD WARNING: Multiple severe scam patterns identified. Do NOT comply or share details.';
  } else if (score >= 20) {
    riskLevel = 'suspicious';
    confidence = 'moderate';
    summary = 'CAUTION: Warning signs detected. Independent verification of the sender is recommended.';
  }

  return {
    id: `local_scam_${Date.now()}`,
    timestamp: new Date().toISOString(),
    category: 'message',
    inputExcerpt: sanitizedText.slice(0, 150),
    riskLevel,
    riskScore: Math.min(score, 100),
    confidenceLevel: confidence,
    confidenceReasoning: `Local heuristic engine matched ${warningSignals.length} scam indicators.`,
    summary,
    warningSignals,
    evidenceSources: [{
      title: 'FTC Scam Recognition Guide',
      publisher: 'Federal Trade Commission',
      url: 'https://consumer.ftc.gov/scams',
      publishDate: 'Current',
      verdict: 'True',
      relevanceSummary: 'Guidance on urgency, impersonation, and irreversible payment demands.',
    }],
    recommendedNextSteps: [
      'Never share OTPs, PINs, or bank passwords with anyone.',
      'Never send money or buy gift cards for strangers or phone callers.',
      'If someone claims to be police, hang up and contact your local police station directly.',
    ],
    disclaimer: 'Evaluated locally in your browser with zero retention. Disclaimers apply.',
    isOfflineFallback: true,
    technicalDetails: { piiRedactedCount: redactedCount },
  };
}

export function clientCheckUrl(inputUrl: string): AssessmentResult {
  const trimmed = inputUrl.trim();
  const urlWithProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(urlWithProto);
  } catch {
    return {
      id: `local_url_err_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'url',
      inputExcerpt: trimmed.slice(0, 100),
      riskLevel: 'high_risk',
      riskScore: 90,
      confidenceLevel: 'high',
      confidenceReasoning: 'Malformed URL.',
      summary: 'INVALID URL: The provided string cannot be parsed as a valid web address.',
      warningSignals: [{
        id: 'malformed_url_client',
        title: 'Malformed URL Syntax',
        severity: 'high',
        description: 'Does not conform to standard URL structure.',
      }],
      evidenceSources: [],
      recommendedNextSteps: ['Check for typos in the address bar.'],
      disclaimer: 'Never open malformed links.',
      isOfflineFallback: true,
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const warningSignals: WarningSignal[] = [];
  let score = 10;

  // SSRF check locally
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname === '169.254.169.254') {
    return {
      id: `local_url_ssrf_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'url',
      inputExcerpt: hostname,
      riskLevel: 'high_risk',
      riskScore: 100,
      confidenceLevel: 'high',
      confidenceReasoning: 'Local/private network address.',
      summary: 'BLOCKED (SSRF Protection): The URL targets private local network address space.',
      warningSignals: [{
        id: 'local_ip_target',
        title: 'Localhost / Private Network Target',
        severity: 'critical',
        description: 'Addresses pointing to local private network addresses are blocked for security.',
      }],
      evidenceSources: [],
      recommendedNextSteps: ['Do not access private internal network addresses through web tools.'],
      disclaimer: 'SSRF protection enforced.',
      isOfflineFallback: true,
    };
  }

  // Typosquatting heuristics
  const brands = ['paypal', 'google', 'amazon', 'apple', 'sbi', 'chase', 'netflix', 'wellsfargo'];
  let typosquatBrand = '';
  for (const b of brands) {
    if (hostname.includes(b) && !hostname.endsWith(`.${b}.com`) && hostname !== `${b}.com` && hostname !== `${b}.co.in`) {
      typosquatBrand = b;
      score += 50;
      warningSignals.push({
        id: 'client_typosquat',
        title: `Likely Impersonation / Typosquatting of ${b.toUpperCase()}`,
        severity: 'critical',
        description: `URL contains the name "${b}" but is hosted under an unrelated root domain.`,
      });
      break;
    }
  }

  // Punycode
  if (hostname.startsWith('xn--')) {
    score += 45;
    warningSignals.push({
      id: 'client_punycode',
      title: 'Punycode Internationalized Domain (Lookalike Attack)',
      severity: 'high',
      description: 'Domain uses xn-- encoding to imitate standard alphabet characters.',
    });
  }

  // High risk TLDs
  const highRiskTlds = ['top', 'xyz', 'click', 'buzz', 'fit', 'work', 'zip', 'mov'];
  const tld = hostname.split('.').pop() || '';
  if (highRiskTlds.includes(tld)) {
    score += 25;
    warningSignals.push({
      id: 'client_risky_tld',
      title: `High-Risk TLD (.${tld})`,
      severity: 'medium',
      description: `Domains ending in .${tld} are frequently associated with automated throwaway spam sites.`,
    });
  }

  const isHttps = parsed.protocol === 'https:';
  if (!isHttps) {
    score += 25;
    warningSignals.push({
      id: 'client_no_https',
      title: 'Unencrypted HTTP Connection',
      severity: 'high',
      description: 'Connection is unencrypted. Do not enter passwords or cards.',
    });
  }

  let riskLevel: RiskLevel = 'trustworthy';
  let summary = `Domain appears structurally normal (${hostname}).`;
  if (score >= 50) {
    riskLevel = 'high_risk';
    summary = `SUSPECTED FRAUDULENT DOMAIN: Strong indicators of brand imitation (${typosquatBrand || 'deceptive name'}).`;
  } else if (score >= 25) {
    riskLevel = 'suspicious';
    summary = 'Domain exhibits caution flags such as risky TLD or lack of encryption.';
  }

  return {
    id: `local_url_${Date.now()}`,
    timestamp: new Date().toISOString(),
    category: 'url',
    inputExcerpt: trimmed.slice(0, 100),
    riskLevel,
    riskScore: Math.min(score, 100),
    confidenceLevel: 'moderate',
    confidenceReasoning: 'Client-side URL parsing and brand impersonation heuristic.',
    summary,
    warningSignals,
    evidenceSources: [{
      title: 'OWASP Phishing & SSRF Defensive Guide',
      publisher: 'OWASP',
      url: 'https://owasp.org',
      publishDate: 'Current',
      verdict: 'True',
      relevanceSummary: 'Guidelines on domain spoofing, Punycode, and network isolation.',
    }],
    recommendedNextSteps: [
      'Do not enter login credentials or bank details on this page.',
      'Always check the domain name in the address bar carefully.',
      'Remember that HTTPS only encrypts communication; it does not guarantee trustworthiness.',
    ],
    disclaimer: 'Assessed locally. Never opens untrusted URLs in your browser.',
    isOfflineFallback: true,
    technicalDetails: {
      domain: hostname,
      isHttps,
      sslDisclaimer: 'HTTPS encrypts transit, but over 80% of phishing sites also use HTTPS. It does not prove the website is safe.',
    },
  };
}
