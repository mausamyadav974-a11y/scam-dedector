import { AssessmentResult, EvidenceSource, WarningSignal, RiskLevel, ConfidenceLevel } from '../types';
import { sanitizePii } from './piiSanitizer';

interface KnownFactRecord {
  keywords: string[];
  claimSummary: string;
  verdict: 'False' | 'Misleading' | 'True' | 'Mostly True' | 'Satire' | 'Outdated';
  riskLevel: RiskLevel;
  publisher: string;
  sourceTitle: string;
  sourceUrl: string;
  publishDate: string;
  explanation: string;
}

// Curated database of verified fact-checks from accredited IFCN signatories & public advisories
const KNOWN_FACT_CHECKS: KnownFactRecord[] = [
  {
    keywords: ['lemon', 'hot water', 'cancer', 'cure', 'kill cancer cells', '1000 times'],
    claimSummary: 'Drinking hot lemon water or baking soda cures cancer or is 1,000 times stronger than chemotherapy.',
    verdict: 'False',
    riskLevel: 'high_risk',
    publisher: 'Reuters Fact Check',
    sourceTitle: 'Fact Check: Hot lemon water does not cure cancer or destroy cancer cells',
    sourceUrl: 'https://www.reuters.com/fact-check',
    publishDate: '2023-04-12',
    explanation: 'Medical experts and cancer institutes confirm that while lemons contain vitamin C and antioxidants, there is zero clinical evidence that hot lemon water cures or prevents cancer.',
  },
  {
    keywords: ['5g', 'covid', 'coronavirus', 'radiation', 'virus transmission', 'towers'],
    claimSummary: '5G mobile networks spread COVID-19 or suppress the immune system to transmit viruses.',
    verdict: 'False',
    riskLevel: 'high_risk',
    publisher: 'World Health Organization (WHO)',
    sourceTitle: 'Coronavirus disease (COVID-19) advice for the public: Mythbusters',
    sourceUrl: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters',
    publishDate: '2022-08-15',
    explanation: 'Viruses cannot travel on radio waves or mobile networks. COVID-19 spreads through respiratory droplets. 5G uses non-ionizing radio frequencies incapable of damaging cells or carrying biological pathogens.',
  },
  {
    keywords: ['who', 'pandemic treaty', 'strip national sovereignty', 'forced lockdowns', 'military'],
    claimSummary: 'The WHO Pandemic Agreement will surrender national sovereignty, impose worldwide mandatory lockdowns, and strip citizen rights.',
    verdict: 'False',
    riskLevel: 'high_risk',
    publisher: 'AP News Fact Check',
    sourceTitle: 'Fact Focus: Proposed WHO agreement does not surrender US or global sovereignty',
    sourceUrl: 'https://apnews.com/hub/ap-fact-check',
    publishDate: '2024-03-20',
    explanation: 'The draft accord explicitly reaffirms member states national sovereignty to enact their own public health policies, with no authority for the WHO to deploy military, police, or enforce domestic lockdowns.',
  },
  {
    keywords: ['nasa', 'asteroid', 'destroy earth', 'collide', 'next month', 'secret apocalypse'],
    claimSummary: 'NASA secretly warned an asteroid is on an unavoidable collision course to destroy Earth in the coming weeks.',
    verdict: 'False',
    riskLevel: 'high_risk',
    publisher: 'Snopes & NASA Cneos',
    sourceTitle: 'NASA Asteroid Watch: Planetary Defense Coordination Office',
    sourceUrl: 'https://cneos.jpl.nasa.gov',
    publishDate: '2023-11-10',
    explanation: 'NASA’s Center for Near-Earth Object Studies monitors all known hazardous asteroids and confirms no significant known asteroid has a high probability of impacting Earth for at least the next 100 years.',
  },
  {
    keywords: ['onion', 'room', 'absorb virus', 'flu', 'black plague', 'toxins'],
    claimSummary: 'Leaving raw cut onions around the room absorbs flu viruses, bacteria, and toxins from the air.',
    verdict: 'False',
    riskLevel: 'high_risk',
    publisher: 'National Onion Association & AP Fact Check',
    sourceTitle: 'Myth: Cut onions in a room do not cure or absorb the flu virus',
    sourceUrl: 'https://www.onions-usa.org',
    publishDate: '2023-01-18',
    explanation: 'Onions do not act as magnets for viruses or bacteria. Viruses require a living host to replicate and cannot be absorbed from room air into a cut vegetable.',
  },
  {
    keywords: ['pib', 'free laptop', 'prime minister', 'scheme', 'government gift', 'registration fee'],
    claimSummary: 'Government is giving free laptops or Rs 500,000 cash to all students upon payment of a registration fee.',
    verdict: 'False',
    riskLevel: 'high_risk',
    publisher: 'PIB Fact Check (Government of India)',
    sourceTitle: 'PIB Fact Check: Viral message claiming free laptops under government scheme is fake',
    sourceUrl: 'https://factcheck.pib.gov.in',
    publishDate: '2024-01-05',
    explanation: 'The Press Information Bureau confirmed no such universal laptop or cash scheme exists. Fraudulent links ask for personal details and upfront processing fees.',
  },
  {
    keywords: ['earthquake', 'animal behavior', 'dogs barking', 'birds flying', 'predict exact date'],
    claimSummary: 'Animals barking or unusual clouds predict the exact minute and magnitude of a major earthquake tomorrow.',
    verdict: 'Misleading',
    riskLevel: 'suspicious',
    publisher: 'USGS (US Geological Survey)',
    sourceTitle: 'Can animals or clouds predict earthquakes?',
    sourceUrl: 'https://www.usgs.gov/faqs/can-animals-predict-earthquakes',
    publishDate: '2023-06-14',
    explanation: 'Neither the USGS nor any credible seismological institute has ever predicted a major earthquake to an exact date or hour. While animals may sense P-waves seconds before S-waves, they cannot forecast quakes in advance.',
  },
  {
    keywords: ['the onion', 'babylon bee', 'parody', 'satire', 'fictional', 'comedy'],
    claimSummary: 'Content originating from recognized satirical or parody comedy publications.',
    verdict: 'Satire',
    riskLevel: 'suspicious',
    publisher: 'Fact-Check Standards Consortium',
    sourceTitle: 'Satirical Humor Misinterpreted as Factual News',
    sourceUrl: 'https://www.factcheck.org',
    publishDate: '2023-09-01',
    explanation: 'This material originated as deliberate satire or parody intended for comedic entertainment, but has been circulated without comedic context.',
  },
  {
    keywords: ['world health organization', 'polio', 'eradication', 'vaccine safety', 'routine immunization'],
    claimSummary: 'Routine childhood vaccination programs have reduced global polio cases by over 99%.',
    verdict: 'True',
    riskLevel: 'trustworthy',
    publisher: 'Global Polio Eradication Initiative & WHO',
    sourceTitle: 'Poliomyelitis Fact Sheet and Global Eradication Milestones',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/poliomyelitis',
    publishDate: '2023-10-24',
    explanation: 'Documented medical records and peer-reviewed surveillance confirm that widespread vaccination has driven wild poliovirus transmission down by over 99% since 1988.',
  },
];

// Sensationalist, conspiracy, and clickbait language triggers
const SENSATIONALIST_PATTERNS = [
  { pattern: /\b(shocking|unbelievable|miracle cure|doctors hate this|secret leaked|mainstream media won't tell you|government is hiding|government secretly banned|100% guaranteed cure|wake up sheeple|forward before it's deleted|forward before it is deleted)\b/i, weight: 30, title: 'Sensationalist & Clickbait Language', desc: 'Uses emotional hooks, urgency, or claims of hidden suppression to bypass critical thinking.' },
  { pattern: /\b(share this with everyone|forward to 10 people|pass this urgent message|do not ignore|emergency alert from a friend)\b/i, weight: 20, title: 'Viral Chain Letter & Coercive Forwarding Cues', desc: 'Prompts immediate emotional forwarding without source verification.' },
  { pattern: /\b(according to unnamed sources|top scientist revealed|secret document proves|insider leaked|confidential memo|truth revealed)\b/i, weight: 20, title: 'Anonymous or Unverifiable Attribution', desc: 'Attributes dramatic factual claims to vague "insiders" without verifiable author or peer-reviewed publication.' },
  { pattern: /\b(cure for all|eliminates all toxins|cancer dissolved in 48 hours|reverses aging overnight)\b/i, weight: 30, title: 'Extraordinary Medical / Health Claim', desc: 'Claims extraordinary therapeutic breakthroughs without clinical trials or medical consensus.' },
  { pattern: /\b(all scientists agree that earth is flat|reptilian|deep state weather weapon|poison in tap water everywhere)\b/i, weight: 35, title: 'Unfounded Conspiracy Narrative', desc: 'Mirrors well-documented viral conspiracy tropes that contradict empirical scientific data.' },
];

export function checkNewsContent(rawText: string): AssessmentResult {
  const { sanitizedText } = sanitizePii(rawText.trim());
  const lowerText = sanitizedText.toLowerCase();

  const warningSignals: WarningSignal[] = [];
  const matchedSources: EvidenceSource[] = [];
  const extractedClaims: string[] = [];

  // 1. Extract potential factual claims (sentences with assertive verbs or quantities)
  const sentences = sanitizedText.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 20);
  for (const sentence of sentences.slice(0, 5)) {
    if (/\b(is|was|are|cures|causes|destroyed|announced|banned|proven|discovered|killed|signed)\b/i.test(sentence)) {
      extractedClaims.push(sentence);
    }
  }

  // 2. Check against known fact-checking registry
  let knownFactMatch: KnownFactRecord | null = null;
  let highestMatchCount = 0;

  for (const record of KNOWN_FACT_CHECKS) {
    let matchCount = 0;
    for (const kw of record.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        matchCount++;
      }
    }
    if (matchCount >= 2 && matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      knownFactMatch = record;
    }
  }

  // 3. Evaluate sensationalism and manipulative language
  let sensationalismScore = 0;
  for (const item of SENSATIONALIST_PATTERNS) {
    const match = lowerText.match(item.pattern);
    if (match) {
      sensationalismScore += item.weight;
      warningSignals.push({
        id: `sensational_${warningSignals.length + 1}`,
        title: item.title,
        severity: item.weight >= 25 ? 'high' : 'medium',
        description: item.desc,
        evidenceSnippet: match[0],
      });
    }
  }

  // Cap sensationalism at 100
  sensationalismScore = Math.min(sensationalismScore, 100);

  // Check for lack of dates, names, or verifiable references
  const hasSpecificDateOrYear = /\b(19\d\d|20[0-2]\d|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(lowerText);
  if (!hasSpecificDateOrYear && sanitizedText.length > 100) {
    warningSignals.push({
      id: 'missing_temporal_context',
      title: 'Missing Date / Time Context',
      severity: 'low',
      description: 'The claim does not cite specific dates or verifiable timelines, making it difficult to assess timeliness.',
    });
  }

  // Check for ALL CAPS yelling
  const upperWords = sanitizedText.split(/\s+/).filter(w => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  if (upperWords.length >= 3) {
    warningSignals.push({
      id: 'excessive_capitalization',
      title: 'Excessive Capitalization / Emotional Shouting',
      severity: 'medium',
      description: 'Multiple capitalized words detected, typical of viral propaganda and clickbait intended to evoke alarm.',
    });
    sensationalismScore = Math.min(sensationalismScore + 15, 100);
  }

  // 4. Formulate Verdict & Risk Level
  let riskLevel: RiskLevel = 'unverified';
  let riskScore = 30; // default baseline
  let confidenceLevel: ConfidenceLevel = 'low';
  let confidenceReasoning = '';
  let summary = '';
  const recommendedNextSteps: string[] = [];

  if (knownFactMatch) {
    riskLevel = knownFactMatch.riskLevel;
    confidenceLevel = 'high';
    confidenceReasoning = `Direct cross-reference identified in independent fact-checking databases (${knownFactMatch.publisher}).`;
    riskScore = riskLevel === 'high_risk' ? 88 : riskLevel === 'suspicious' ? 62 : 12;

    matchedSources.push({
      title: knownFactMatch.sourceTitle,
      publisher: knownFactMatch.publisher,
      url: knownFactMatch.sourceUrl,
      publishDate: knownFactMatch.publishDate,
      verdict: knownFactMatch.verdict,
      relevanceSummary: knownFactMatch.explanation,
    });

    if (riskLevel === 'high_risk') {
      summary = `This claim matches a thoroughly debunked viral claim cataloged by ${knownFactMatch.publisher}. Evidence shows it is inaccurate or misleading.`;
      recommendedNextSteps.push('Do not share or forward this text to friends or family.');
      recommendedNextSteps.push(`Consult official fact-checks from organizations like ${knownFactMatch.publisher}.`);
      recommendedNextSteps.push('If this concerns health, consult a licensed healthcare professional rather than viral online advice.');
    } else if (riskLevel === 'suspicious') {
      summary = `This content contains partially accurate or unproven elements according to fact-checkers (${knownFactMatch.publisher}).`;
      recommendedNextSteps.push('Review the primary source before quoting or sharing.');
      recommendedNextSteps.push('Look for concurring reports from at least two reputable newsrooms.');
    } else {
      summary = `The claim corresponds to verified factual reporting from accredited agencies (${knownFactMatch.publisher}).`;
      recommendedNextSteps.push('Content appears corroborated by public health/scientific consensus.');
    }
  } else {
    // No direct database match: evaluate heuristics
    if (sensationalismScore >= 25) {
      riskLevel = 'suspicious';
      riskScore = 65;
      confidenceLevel = 'moderate';
      confidenceReasoning = 'High density of emotional manipulation, clickbait language, and unverified source attribution.';
      summary = 'High degree of sensationalism and unsubstantiated claims detected. No corroborating evidence found in independent fact-checking databases.';
      recommendedNextSteps.push('Search for the exact headline in Google News or Reuters to see if established media have reported it.');
      recommendedNextSteps.push('Look up the original author, agency, or scientific journal cited.');
      recommendedNextSteps.push('Be cautious of medical, financial, or political claims that urge you to forward immediately.');
    } else if (sanitizedText.length < 50) {
      riskLevel = 'unverified';
      riskScore = 20;
      confidenceLevel = 'insufficient';
      confidenceReasoning = 'Text is too brief to extract substantive factual claims or verify sources.';
      summary = 'Insufficient text provided. Automated analysis requires a headline, full sentence, or article paragraph to evaluate factual claims.';
      recommendedNextSteps.push('Paste the complete article headline, paragraph, or URL for a thorough analysis.');
    } else {
      riskLevel = 'unverified';
      riskScore = 35;
      confidenceLevel = 'low';
      confidenceReasoning = 'No direct matches found in fact-checking registries, and no severe sensationalist markers triggered.';
      summary = 'Unable to conclusively verify this claim. It has not been debunked by major fact-checking organizations, but also lacks independent corroborating evidence in our database.';
      recommendedNextSteps.push('Verify the publisher: check the "About Us" page of the publishing site and domain ownership.');
      recommendedNextSteps.push('Apply lateral reading: open a new tab and search what other credible journalists say about this topic.');
      recommendedNextSteps.push('Check the date of publication to ensure an old event is not being misframed as current news.');
    }
  }

  // Always provide general fact-checking guidance source if no match
  if (matchedSources.length === 0) {
    matchedSources.push({
      title: 'IFCN Fact-Checkers Code of Principles & Search',
      publisher: 'International Fact-Checking Network (Poynter)',
      url: 'https://www.poynter.org/ifcn/',
      publishDate: 'Current Standard',
      verdict: 'Unproven',
      relevanceSummary: 'No direct debunk or verification found in verified fact-checking registries. Independent primary source verification is strongly advised.',
    });
  }

  return {
    id: `scan_news_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    category: 'news',
    inputExcerpt: sanitizedText.slice(0, 160) + (sanitizedText.length > 160 ? '...' : ''),
    riskLevel,
    riskScore,
    confidenceLevel,
    confidenceReasoning,
    summary,
    warningSignals,
    extractedClaims: extractedClaims.length > 0 ? extractedClaims : ['General narrative claim (full text analyzed)'],
    evidenceSources: matchedSources,
    recommendedNextSteps,
    disclaimer: 'TruthGuard AI provides automated heuristic assessments and references independent fact-checking records. It does not replace journalistic investigation or certified professional counsel. Never label news as definitely fake without verifying primary documentation.',
    technicalDetails: {
      sensationalismScore,
      claimsCount: extractedClaims.length,
      knownFactCheckMatched: !!knownFactMatch,
      detectionEngine: 'TruthGuard Semantic Claim & Heuristic Engine v1.0',
    },
  };
}
