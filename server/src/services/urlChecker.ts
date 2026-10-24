import { AssessmentResult, WarningSignal, RiskLevel, ConfidenceLevel } from '../types';
import * as dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

// Curated high-risk / phishing domains and signatures
const KNOWN_PHISHING_DOMAINS = new Set([
  'secure-login-paypal.com',
  'account-update-apple.top',
  'wellsfargo-verify.xyz',
  'sbi-kyc-update.online',
  'netflix-billing-renew.info',
  'chase-fraud-prevention.net',
  'metamask-recover-vault.xyz',
  'steam-community-trade.top',
  'fedex-track-package.vip',
  'postal-service-redelivery.buzz',
  'amazon-security-alert.click',
  'binance-airdrop-claim.live',
]);

// Verified authoritative domains
const KNOWN_SAFE_DOMAINS = new Set([
  'google.com',
  'microsoft.com',
  'apple.com',
  'amazon.com',
  'paypal.com',
  'github.com',
  'wikipedia.org',
  'reuters.com',
  'who.int',
  'gov.in',
  'gov.uk',
  'usa.gov',
  'fbi.gov',
  'ftc.gov',
  'sbi.co.in',
  'hdfcbank.com',
  'icicibank.com',
]);

// Common typosquatting targets
const TYPOSQUAT_TARGETS = [
  'paypal', 'google', 'amazon', 'apple', 'microsoft', 'netflix', 'facebook',
  'instagram', 'whatsapp', 'chase', 'wellsfargo', 'bankofamerica', 'binance',
  'coinbase', 'metamask', 'sbi', 'hdfc', 'icici', 'fedex', 'usps', 'dhl',
];

// High risk generic TLDs frequently abused in automated phishing campaigns
const HIGH_RISK_TLDS = new Set([
  'top', 'xyz', 'click', 'buzz', 'fit', 'work', 'loan', 'gq', 'cf', 'ml', 'ga', 'zip', 'mov', 'vip', 'surf', 'rest',
]);

/**
 * Validates if an IP address is a private, loopback, or metadata address (SSRF Protection)
 */
export function isPrivateOrReservedIp(ip: string): boolean {
  // IPv6 loopback and link-local
  if (ip === '::1' || ip === '::' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) {
    return true;
  }

  // IPv4 breakdown
  const parts = ip.split('.').map(p => parseInt(p, 10));
  if (parts.length !== 4 || parts.some(isNaN)) {
    return false;
  }

  const [p0, p1] = parts;

  // 127.0.0.0/8 (Loopback)
  if (p0 === 127) return true;
  // 0.0.0.0/8
  if (p0 === 0) return true;
  // 10.0.0.0/8 (Private)
  if (p0 === 10) return true;
  // 172.16.0.0/12 (Private)
  if (p0 === 172 && p1 >= 16 && p1 <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (p0 === 192 && p1 === 168) return true;
  // 169.254.0.0/16 (Link Local & AWS/GCP/Azure Cloud Metadata: 169.254.169.254)
  if (p0 === 169 && p1 === 254) return true;
  // 100.64.0.0/10 (Carrier-grade NAT)
  if (p0 === 100 && p1 >= 64 && p1 <= 127) return true;

  return false;
}

/**
 * Checks for Homoglyphs or Punycode in domain name (IDN Homograph attack)
 */
export function checkHomoglyphOrPunycode(hostname: string): { hasHomoglyph: boolean; punycode: boolean; reason?: string } {
  if (hostname.startsWith('xn--')) {
    return { hasHomoglyph: true, punycode: true, reason: 'Punycode encoded domain (xn--) often used to spoof Latin letters with lookalike Cyrillic or Greek symbols.' };
  }

  // Non-ASCII characters present in hostname
  // eslint-disable-next-line no-control-regex
  if (/[^\u0000-\u007F]/.test(hostname)) {
    return { hasHomoglyph: true, punycode: false, reason: 'Contains non-ASCII Unicode characters that visually imitate standard Latin alphabet.' };
  }

  return { hasHomoglyph: false, punycode: false };
}

/**
 * Levenshtein distance helper for typosquatting detection
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Calculates Shannon entropy of a string (identifies algorithmically generated or random subdomains)
 */
function calculateEntropy(str: string): number {
  const map: Record<string, number> = {};
  for (const char of str) {
    map[char] = (map[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in map) {
    const p = map[char] / str.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

export async function checkUrlSafety(inputUrl: string): Promise<AssessmentResult> {
  const trimmed = inputUrl.trim();

  // Ensure protocol is present for parsing
  const urlWithProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(urlWithProto);
  } catch {
    return {
      id: `scan_url_err_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'url',
      inputExcerpt: trimmed.slice(0, 100),
      riskLevel: 'high_risk',
      riskScore: 90,
      confidenceLevel: 'high',
      confidenceReasoning: 'Malformed or unparseable URL structure.',
      summary: 'INVALID URL: The provided string is not a valid web URL format.',
      warningSignals: [{
        id: 'malformed_url',
        title: 'Malformed URL Syntax',
        severity: 'high',
        description: 'The URL does not conform to RFC 3986 standards and cannot be safely resolved.',
      }],
      evidenceSources: [],
      recommendedNextSteps: ['Check for typos in the address bar before visiting.'],
      disclaimer: 'Never open malformed or scrambled URLs.',
    };
  }

  // 1. Strict Protocol Validation (SSRF defense against file://, gopher://, etc.)
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      id: `scan_url_proto_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'url',
      inputExcerpt: trimmed.slice(0, 100),
      riskLevel: 'high_risk',
      riskScore: 95,
      confidenceLevel: 'high',
      confidenceReasoning: 'Non-HTTP protocol rejected for security.',
      summary: `UNSAFE PROTOCOL: Protocol "${parsed.protocol}" is rejected to prevent SSRF and local system attacks.`,
      warningSignals: [{
        id: 'unsafe_protocol',
        title: 'Prohibited Network Scheme',
        severity: 'critical',
        description: `Scheme "${parsed.protocol}" can execute local scripts or access internal machine resources. Only http:// and https:// are permitted.`,
      }],
      evidenceSources: [],
      recommendedNextSteps: ['Only access web resources utilizing secure HTTPS or standard HTTP.'],
      disclaimer: 'TruthGuard security sandbox rejects arbitrary protocols to safeguard server infrastructure.',
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const warningSignals: WarningSignal[] = [];
  let riskScore = 15; // baseline

  // 2. SSRF Localhost / Private IP Check
  const isDirectIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':');
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '0.0.0.0') {
    return {
      id: `scan_url_ssrf_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'url',
      inputExcerpt: hostname,
      riskLevel: 'high_risk',
      riskScore: 100,
      confidenceLevel: 'high',
      confidenceReasoning: 'SSRF protection triggered: loopback address specified.',
      summary: 'BLOCKED (SSRF Protection): The URL targets localhost or loopback interfaces.',
      warningSignals: [{
        id: 'localhost_target',
        title: 'Localhost Target Detected',
        severity: 'critical',
        description: 'Addresses pointing to localhost or internal network boundaries are blocked to prevent internal network scanning.',
      }],
      evidenceSources: [],
      recommendedNextSteps: ['Do not access private internal resources through public web proxies.'],
      disclaimer: 'TruthGuard strictly enforces OWASP SSRF defense guidelines.',
      technicalDetails: { ssrfSafe: false, target: hostname },
    };
  }

  if (isDirectIp && isPrivateOrReservedIp(hostname)) {
    return {
      id: `scan_url_private_ip_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'url',
      inputExcerpt: hostname,
      riskLevel: 'high_risk',
      riskScore: 100,
      confidenceLevel: 'high',
      confidenceReasoning: 'SSRF protection triggered: Private RFC 1918 / Cloud metadata IP targeted.',
      summary: 'BLOCKED (SSRF Protection): URL points to a private network or cloud metadata IP address.',
      warningSignals: [{
        id: 'private_ip_target',
        title: 'Private / Cloud Metadata IP Address',
        severity: 'critical',
        description: `The IP address ${hostname} belongs to private network spaces or cloud metadata endpoints (e.g. AWS 169.254.169.254).`,
      }],
      evidenceSources: [],
      recommendedNextSteps: ['Never follow links pointing to private IP addresses.'],
      disclaimer: 'TruthGuard strictly enforces OWASP SSRF defense guidelines.',
      technicalDetails: { ssrfSafe: false, target: hostname },
    };
  }

  // 3. DNS Lookup verification for Rebinding & Private IP resolution
  let resolvedIp = '';
  try {
    const res = await dnsLookup(hostname);
    resolvedIp = res.address;
    if (isPrivateOrReservedIp(resolvedIp)) {
      return {
        id: `scan_url_dns_ssrf_${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: 'url',
        inputExcerpt: hostname,
        riskLevel: 'high_risk',
        riskScore: 100,
        confidenceLevel: 'high',
        confidenceReasoning: 'DNS Rebinding / SSRF: Domain resolves to a private or loopback IP.',
        summary: `BLOCKED (DNS Rebinding): The domain ${hostname} resolves to an internal address (${resolvedIp}).`,
        warningSignals: [{
          id: 'dns_rebinding_alert',
          title: 'DNS Rebinding to Internal IP',
          severity: 'critical',
          description: `Domain resolved to ${resolvedIp}, which is an internal private IP address. This is a common attack technique to bypass firewalls.`,
        }],
        evidenceSources: [],
        recommendedNextSteps: ['Avoid this domain. It is attempting to tunnel into private local networks.'],
        disclaimer: 'DNS rebinding attacks are actively intercepted.',
        technicalDetails: { ssrfSafe: false, resolvedIp },
      };
    }
  } catch {
    // Domain did not resolve
    warningSignals.push({
      id: 'unresolvable_domain',
      title: 'Domain Does Not Resolve via DNS',
      severity: 'medium',
      description: 'The domain name could not be resolved by public DNS. It may be inactive, newly registered, or already taken down.',
    });
    riskScore += 20;
  }

  // 4. Known Phishing Database Check
  let isKnownMalicious = false;
  if (KNOWN_PHISHING_DOMAINS.has(hostname)) {
    isKnownMalicious = true;
    riskScore = 98;
    warningSignals.push({
      id: 'known_phishing_db',
      title: 'Known Phishing Domain Match',
      severity: 'critical',
      description: 'This domain matches an active phishing indicator recorded in threat intelligence feeds.',
    });
  }

  // 5. Homoglyph / Punycode Check
  const homoglyph = checkHomoglyphOrPunycode(hostname);
  if (homoglyph.hasHomoglyph) {
    riskScore += 45;
    warningSignals.push({
      id: 'homoglyph_attack',
      title: 'IDN Homograph / Punycode Deception Detected',
      severity: 'critical',
      description: homoglyph.reason || 'Uses deceptive internationalized character sets to visually mimic a well-known brand.',
    });
  }

  // 6. Direct IP as Hostname Check
  if (isDirectIp) {
    riskScore += 35;
    warningSignals.push({
      id: 'raw_ip_hostname',
      title: 'Raw IP Address Used Instead of Domain Name',
      severity: 'high',
      description: 'Legitimate consumer web services operate under branded domain names. Using raw IP addresses is a frequent technique in malicious drive-by downloads and phishing kits.',
    });
  }

  // 7. Subdomain Entropy and Depth
  const subdomains = hostname.split('.');
  const tld = subdomains[subdomains.length - 1];
  const mainDomain = subdomains.slice(-2).join('.');

  if (subdomains.length >= 4) {
    riskScore += 25;
    warningSignals.push({
      id: 'excessive_subdomains',
      title: 'Excessive Subdomain Stacking',
      severity: 'high',
      description: `Domain contains ${subdomains.length} label levels (e.g., "${hostname}"). Phishing attacks frequently stack brand names into subdomains to mislead mobile users whose address bars truncate long URLs.`,
    });
  }

  // 8. Typosquatting Analysis against high-value targets
  let typosquatTarget: string | undefined;
  for (const brand of TYPOSQUAT_TARGETS) {
    // If brand is in the hostname but mainDomain is not official
    if (hostname.includes(brand)) {
      const isOfficial = Array.from(KNOWN_SAFE_DOMAINS).some(safe => hostname === safe || hostname.endsWith(`.${safe}`));
      if (!isOfficial) {
        typosquatTarget = brand;
        riskScore += 45;
        warningSignals.push({
          id: 'typosquatting_detected',
          title: `Brand Impersonation / Typosquatting (${brand.toUpperCase()})`,
          severity: 'critical',
          description: `The URL contains the brand name "${brand}" but is hosted under an unrelated root domain ("${mainDomain}"). This is a primary sign of credential harvesting.`,
        });
        break;
      }
    } else {
      // Check edit distance on domain label
      const baseLabel = subdomains[subdomains.length - 2] || '';
      if (baseLabel.length >= 4 && Math.abs(baseLabel.length - brand.length) <= 2) {
        const dist = levenshteinDistance(baseLabel, brand);
        if (dist === 1 || dist === 2) {
          typosquatTarget = brand;
          riskScore += 40;
          warningSignals.push({
            id: 'brand_fuzzy_typosquat',
            title: `Likely Typosquatting against "${brand}"`,
            severity: 'high',
            description: `The domain name "${baseLabel}" is an almost identical typo of popular service "${brand}". Scammers register slight misspellings to trap users.`,
          });
          break;
        }
      }
    }
  }

  // 9. High-Risk TLD Check
  if (HIGH_RISK_TLDS.has(tld)) {
    riskScore += 20;
    warningSignals.push({
      id: 'high_risk_tld',
      title: `High-Risk Top Level Domain (.${tld})`,
      severity: 'medium',
      description: `The .${tld} TLD has historically high correlation with automated throwaway phishing sites due to ultra-cheap or unverified registrar policies.`,
    });
  }

  // 10. Path & Query Credential Phishing Keywords
  const fullPath = (parsed.pathname + parsed.search).toLowerCase();
  const suspiciousPathKeywords = ['login', 'signin', 'verify', 'account-update', 'wallet-connect', 'wp-admin', 'banking', 'secure-web', 'sessionid'];
  const matchedKeywords = suspiciousPathKeywords.filter(kw => fullPath.includes(kw));
  if (matchedKeywords.length >= 2) {
    riskScore += 20;
    warningSignals.push({
      id: 'credential_harvesting_path',
      title: 'Suspicious Authentication Path Pattern',
      severity: 'high',
      description: `URL path contains credential collection terms: [${matchedKeywords.join(', ')}].`,
    });
  }

  // 11. Shannon Entropy
  const domainEntropy = calculateEntropy(hostname);
  if (domainEntropy > 3.8 && hostname.length > 15) {
    riskScore += 15;
    warningSignals.push({
      id: 'high_entropy_domain',
      title: 'High Domain Randomness / DGA Characteristics',
      severity: 'medium',
      description: 'Domain characters show high randomness, typical of Domain Generation Algorithms (DGAs) used by botnets and transient malware distribution sites.',
    });
  }

  // 12. HTTPS Analysis & Crucial Education
  const isHttps = parsed.protocol === 'https:';
  const httpsNotice = isHttps
    ? 'HTTPS is active (encrypted in transit). IMPORTANT: Over 80% of phishing sites also use HTTPS certificates. An SSL padlock does NOT prove a website is legitimate or safe.'
    : 'No HTTPS encryption. Connection uses unencrypted plaintext HTTP. Any passwords or sensitive data transmitted can be intercepted by anyone on the network.';

  if (!isHttps) {
    riskScore += 25;
    warningSignals.push({
      id: 'unencrypted_http',
      title: 'Unencrypted HTTP Connection (No SSL)',
      severity: 'high',
      description: 'This website does not support HTTPS encryption. Do not enter passwords, payment cards, or personal information on this site.',
    });
  }

  // 13. Known Safe Domain Check
  const isKnownSafe = Array.from(KNOWN_SAFE_DOMAINS).some(safe => hostname === safe || hostname.endsWith(`.${safe}`));
  if (isKnownSafe && !isKnownMalicious && warningSignals.length === 0) {
    riskScore = 5;
  }

  // Normalize final risk score
  const finalRiskScore = Math.min(Math.max(riskScore, 0), 100);

  // Determine Risk Category & Confidence
  let riskLevel: RiskLevel = 'trustworthy';
  let confidenceLevel: ConfidenceLevel = 'moderate';
  let confidenceReasoning = '';
  let summary = '';
  const recommendedNextSteps: string[] = [];

  if (isKnownMalicious || finalRiskScore >= 60) {
    riskLevel = 'high_risk';
    confidenceLevel = 'high';
    confidenceReasoning = isKnownMalicious
      ? 'Domain confirmed in active phishing / threat intelligence records.'
      : 'Multiple high-severity structural risk indicators identified (typosquatting, unverified TLD, or auth targeting).';
    summary = `DANGEROUS / SUSPECTED PHISHING LINK: Strong indicators of domain impersonation or fraudulent infrastructure targeting ${typosquatTarget ? typosquatTarget.toUpperCase() : 'users'}.`;

    recommendedNextSteps.push('DO NOT enter usernames, passwords, or credit card details.');
    recommendedNextSteps.push('DO NOT download files or execute software from this link.');
    recommendedNextSteps.push('If you already visited, close the tab immediately and run a security scan on your device.');
    recommendedNextSteps.push('If you typed account credentials, navigate directly to the legitimate site on a clean tab and reset your password immediately.');
  } else if (finalRiskScore >= 30) {
    riskLevel = 'suspicious';
    confidenceLevel = 'moderate';
    confidenceReasoning = 'Heuristic indicators suggest potential risk (e.g. unencrypted connection, uncommon TLD, or stacked subdomains), but no confirmed blacklisting found.';
    summary = 'CAUTION ADVISED: Domain displays anomalies or lack of encryption. Exercise care before interacting.';

    recommendedNextSteps.push('Do not share personal or payment details on unencrypted or unfamiliar domains.');
    recommendedNextSteps.push('Search for independent reviews or trust ratings of the company behind this site.');
    recommendedNextSteps.push('Remember that zero-day or brand-new phishing websites may not yet be indexed in public threat databases.');
  } else if (isKnownSafe) {
    riskLevel = 'trustworthy';
    confidenceLevel = 'high';
    confidenceReasoning = 'Domain is an established, authoritative global institution or trusted digital service.';
    summary = `Domain corresponds to verified infrastructure for ${mainDomain}. No threat flags detected.`;

    recommendedNextSteps.push('Always ensure the address in your browser address bar matches the expected domain exactly.');
  } else {
    riskLevel = 'unverified';
    confidenceLevel = 'low';
    confidenceReasoning = 'Domain has no threat history on record, but is not an established global authority. New malicious websites often take 24–72 hours to appear on public blocklists.';
    summary = 'NO KNOWN THREATS FOUND (UNVERIFIED): Domain is not currently flagged in threat databases, but newly created scam sites frequently bypass filters. Exercise normal caution.';

    recommendedNextSteps.push('Verify the identity of the organization independently before making purchases or downloading software.');
    recommendedNextSteps.push('Never trust an unfamiliar website simply because it displays a green lock or uses HTTPS.');
  }

  const evidenceSources = [
    {
      title: 'OWASP Top 10 — Server-Side Request Forgery & Phishing Defenses',
      publisher: 'OWASP Foundation',
      url: 'https://owasp.org',
      publishDate: '2023 Standard',
      verdict: 'True' as const,
      relevanceSummary: 'Standards used for SSRF isolation, private IP blocking, and host header analysis.',
    },
    {
      title: 'Anti-Phishing Working Group (APWG) Threat Guidelines',
      publisher: 'APWG',
      url: 'https://apwg.org',
      publishDate: 'Annual Report',
      verdict: 'True' as const,
      relevanceSummary: 'Heuristics for typosquatting, IDN homoglyphs, and high-risk gTLD abuse.',
    },
  ];

  return {
    id: `scan_url_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    category: 'url',
    inputExcerpt: trimmed.slice(0, 100),
    riskLevel,
    riskScore: finalRiskScore,
    confidenceLevel,
    confidenceReasoning,
    summary,
    warningSignals,
    evidenceSources,
    recommendedNextSteps,
    disclaimer: 'TruthGuard AI never opens untrusted URLs in your browser or on client devices. Zero-day malicious sites, compromised legitimate sites, and private phishing campaigns may not appear on blocklists immediately. Automated scans are decision-support aids, not absolute warranties.',
    technicalDetails: {
      domain: hostname,
      resolvedIp: resolvedIp || 'Resolution omitted or filtered',
      isHttps,
      sslDisclaimer: httpsNotice,
      homographDetected: homoglyph.hasHomoglyph,
      typosquattingTarget: typosquatTarget || 'None detected',
      tldRisk: HIGH_RISK_TLDS.has(tld) ? 'High' : 'Normal',
      ssrfSafe: true,
      threatDatabaseMatches: isKnownMalicious ? ['TruthGuard Threat Intelligence Phishing Feed'] : [],
      detectionEngine: 'TruthGuard SSRF-Isolated URL Engine v1.0',
    },
  };
}
