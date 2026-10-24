export type RiskLevel = 'trustworthy' | 'suspicious' | 'high_risk' | 'unverified';

export type AnalysisCategory = 'news' | 'message' | 'url';

export type ConfidenceLevel = 'high' | 'moderate' | 'low' | 'insufficient';

export interface WarningSignal {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  evidenceSnippet?: string;
}

export interface EvidenceSource {
  title: string;
  publisher: string;
  url?: string;
  publishDate?: string;
  verdict?: 'True' | 'Mostly True' | 'Misleading' | 'False' | 'Unproven' | 'Satire' | 'Outdated';
  relevanceSummary: string;
}

export interface AssessmentResult {
  id: string;
  timestamp: string;
  category: AnalysisCategory;
  inputExcerpt: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100 internal score for gauge
  confidenceLevel: ConfidenceLevel;
  confidenceReasoning: string;
  summary: string;
  warningSignals: WarningSignal[];
  extractedClaims?: string[];
  evidenceSources: EvidenceSource[];
  recommendedNextSteps: string[];
  disclaimer: string;
  technicalDetails?: {
    domain?: string;
    ipAddress?: string;
    isHttps?: boolean;
    sslDisclaimer?: string;
    homographDetected?: boolean;
    typosquattingTarget?: string;
    tldRisk?: string;
    ssrfSafe?: boolean;
    threatDatabaseMatches?: string[];
    piiRedactedCount?: number;
    detectionEngine?: string;
    [key: string]: any;
  };
  isOfflineFallback?: boolean;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  category: AnalysisCategory;
  title: string;
  riskLevel: RiskLevel;
  summarySnippet: string;
  result: AssessmentResult;
}

export interface AnonymousReportInput {
  category: AnalysisCategory;
  content: string;
  suspicionReason: string;
  sourceChannel?: string;
  reportedUrl?: string;
  consentTimestamp: string;
}
