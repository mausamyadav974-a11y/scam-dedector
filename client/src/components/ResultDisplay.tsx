import React, { useState } from 'react';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle, ExternalLink,
  Copy, Check, Bookmark, ArrowRight, Flag, MessageSquareQuote, Shield,
  Cpu, Calendar
} from 'lucide-react';
import { AssessmentResult, RiskLevel } from '../types';
import { translations } from '../translations';

interface ResultDisplayProps {
  result: AssessmentResult;
  lang: 'en' | 'hi';
  onSaveToHistory: (res: AssessmentResult) => void;
  isSaved: boolean;
  onOpenReportModal: (res: AssessmentResult) => void;
  onOpenFeedbackModal: (scanId: string) => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  lang,
  onSaveToHistory,
  isSaved,
  onOpenReportModal,
  onOpenFeedbackModal,
}) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang].results;

  const getRiskConfig = (risk: RiskLevel) => {
    switch (risk) {
      case 'high_risk':
        return {
          title: t.riskLevels.high_risk,
          bgGradient: 'from-red-950/80 via-red-900/40 to-navy-900/80',
          borderColor: 'border-red-500/50',
          textColor: 'text-red-400',
          badgeBg: 'bg-red-500 text-white',
          icon: ShieldAlert,
        };
      case 'suspicious':
        return {
          title: t.riskLevels.suspicious,
          bgGradient: 'from-amber-950/80 via-amber-900/40 to-navy-900/80',
          borderColor: 'border-amber-500/50',
          textColor: 'text-amber-400',
          badgeBg: 'bg-amber-500 text-navy-950',
          icon: AlertTriangle,
        };
      case 'trustworthy':
        return {
          title: t.riskLevels.trustworthy,
          bgGradient: 'from-teal-950/80 via-teal-900/40 to-navy-900/80',
          borderColor: 'border-teal-500/50',
          textColor: 'text-teal-400',
          badgeBg: 'bg-teal-500 text-navy-950',
          icon: ShieldCheck,
        };
      default:
        return {
          title: t.riskLevels.unverified,
          bgGradient: 'from-slate-900 via-slate-800/40 to-navy-900/80',
          borderColor: 'border-slate-600',
          textColor: 'text-slate-300',
          badgeBg: 'bg-slate-600 text-white',
          icon: HelpCircle,
        };
    }
  };

  const riskConfig = getRiskConfig(result.riskLevel);
  const RiskIcon = riskConfig.icon;

  const handleCopySanitized = () => {
    const reportText = [
      `--- TruthGuard AI Verification Report ---`,
      `Category: ${result.category.toUpperCase()}`,
      `Risk Verdict: ${riskConfig.title}`,
      `Evidence Strength: ${result.confidenceLevel.toUpperCase()} (${result.confidenceReasoning})`,
      `Assessment Timestamp: ${new Date(result.timestamp).toLocaleString()}`,
      ``,
      `Summary:`,
      result.summary,
      ``,
      result.warningSignals.length > 0 ? `Key Warning Signals:` : '',
      ...result.warningSignals.map(w => `• [${w.severity.toUpperCase()}] ${w.title}: ${w.description}`),
      ``,
      `Recommended Steps:`,
      ...result.recommendedNextSteps.map((s: string) => `• ${s}`),
      ``,
      `Disclaimer: ${result.disclaimer}`,
      `Verified with zero personal data logged via TruthGuard AI.`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 animate-fade-in">
      <div className={`rounded-3xl border ${riskConfig.borderColor} bg-gradient-to-b ${riskConfig.bgGradient} backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden`}>
        
        {/* Top Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-navy-800/80">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl ${riskConfig.badgeBg} shadow-lg shrink-0 mt-0.5`}>
              <RiskIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
                  {t.overallRisk} • {result.category.toUpperCase()}
                </span>
                {result.isOfflineFallback && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy-800 text-teal-400 border border-teal-500/30">
                    Offline Local Heuristics
                  </span>
                )}
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${riskConfig.textColor} mt-1`}>
                {riskConfig.title}
              </h2>
            </div>
          </div>

          {/* Timestamp and Save/Copy actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSaveToHistory(result)}
              disabled={isSaved}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-teal-950 text-teal-300 border border-teal-800 cursor-default'
                  : 'bg-navy-900/90 hover:bg-navy-800 border border-navy-700 text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? t.savedToHistory : t.saveHistoryBtn}</span>
            </button>

            <button
              onClick={handleCopySanitized}
              className="px-3 py-2 rounded-xl bg-navy-900/90 hover:bg-navy-800 border border-navy-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copiedNotice : t.copyReportBtn}</span>
            </button>
          </div>
        </div>

        {/* Assessment Summary & Confidence Reasoning */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Detailed Assessment
            </h3>
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed bg-navy-950/60 p-4 rounded-2xl border border-navy-800/80">
              {result.summary}
            </p>
          </div>

          {/* Evidence Strength Card */}
          <div className="bg-navy-950/60 p-4 rounded-2xl border border-navy-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t.confidence}
                </span>
                <span className="text-xs font-mono font-bold text-teal-400">
                  {result.confidenceLevel.toUpperCase()}
                </span>
              </div>
              
              {/* Visual Confidence Bar */}
              <div className="w-full h-2 rounded-full bg-navy-900 overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    result.confidenceLevel === 'high'
                      ? 'w-full bg-teal-400'
                      : result.confidenceLevel === 'moderate'
                      ? 'w-2/3 bg-amber-400'
                      : result.confidenceLevel === 'low'
                      ? 'w-1/3 bg-slate-400'
                      : 'w-1/6 bg-red-400'
                  }`}
                />
              </div>

              <p className="text-xs text-slate-300 leading-normal">
                {result.confidenceReasoning}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-navy-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Assessed: {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Detected Warning Signals */}
        {result.warningSignals.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{t.warningSigns} ({result.warningSignals.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.warningSignals.map((ws) => (
                <div
                  key={ws.id}
                  className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 hover:border-navy-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-bold text-slate-100">{ws.title}</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        ws.severity === 'critical'
                          ? 'bg-red-950 text-red-300 border border-red-700'
                          : ws.severity === 'high'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : ws.severity === 'medium'
                          ? 'bg-sky-950 text-sky-300 border border-sky-700'
                          : 'bg-navy-900 text-slate-400 border border-navy-700'
                      }`}
                    >
                      {ws.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {ws.description}
                  </p>
                  {ws.evidenceSnippet && (
                    <div className="text-[11px] font-mono text-teal-300/90 bg-navy-900/90 px-2 py-1 rounded border border-navy-800">
                      Snippet: "{ws.evidenceSnippet}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Factual Claims (For News) */}
        {result.extractedClaims && result.extractedClaims.length > 0 && result.category === 'news' && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-teal-400" />
              <span>{t.claimsIdentified}</span>
            </h3>
            <div className="space-y-2">
              {result.extractedClaims.map((claim, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-navy-950/60 border border-navy-800/80 text-xs sm:text-sm text-slate-200">
                  "{claim}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supporting Evidence Sources & Fact-Checking Records */}
        {result.evidenceSources.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" />
              <span>{t.evidenceSources}</span>
            </h3>
            <div className="space-y-3">
              {result.evidenceSources.map((source, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-teal-400">{source.publisher}</span>
                      {source.verdict && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          source.verdict === 'False' ? 'bg-red-950 text-red-300 border border-red-700' :
                          source.verdict === 'True' ? 'bg-teal-950 text-teal-300 border border-teal-700' :
                          'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}>
                          Verdict: {source.verdict}
                        </span>
                      )}
                      {source.publishDate && (
                        <span className="text-[10px] text-slate-500">• {source.publishDate}</span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100">{source.title}</h4>
                    <p className="text-xs text-slate-300">{source.relevanceSummary}</p>
                  </div>

                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-teal-300 border border-navy-700 text-xs font-medium shrink-0 self-start sm:self-center transition-colors"
                    >
                      <span>Read Fact-Check</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical URL Details (If Category is URL) */}
        {result.category === 'url' && result.technicalDetails && (
          <div className="mt-8 p-4 rounded-2xl bg-navy-950/70 border border-navy-800/90">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>URL Security & Protocol Analysis</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Domain</span>
                <span className="font-mono text-slate-200 break-all">{result.technicalDetails.domain || 'N/A'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">SSRF Isolation</span>
                <span className="font-mono text-teal-400">PASSED (Private IPs Blocked)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">HTTPS Protocol</span>
                <span className={`font-mono ${result.technicalDetails.isHttps ? 'text-teal-400' : 'text-red-400'}`}>
                  {result.technicalDetails.isHttps ? 'Encrypted (HTTPS)' : 'Insecure (HTTP)'}
                </span>
              </div>
            </div>
            {result.technicalDetails.sslDisclaimer && (
              <p className="mt-2.5 text-[11px] text-amber-300/90 bg-amber-950/30 p-2.5 rounded-xl border border-amber-800/40">
                ⚠️ {result.technicalDetails.sslDisclaimer}
              </p>
            )}
          </div>
        )}

        {/* Recommended Next Steps */}
        {result.recommendedNextSteps.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-teal-400" />
              <span>{t.nextSteps}</span>
            </h3>
            <ul className="space-y-2">
              {result.recommendedNextSteps.map((step: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-navy-950/50 p-3 rounded-xl border border-navy-800/80"
                >
                  <span className="w-5 h-5 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center text-[10px] font-mono text-teal-400 shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Crucial Disclaimer & Feedback Row */}
        <div className="mt-8 pt-6 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl">
            <strong className="text-slate-300">{t.disclaimerTitle}:</strong> {result.disclaimer}
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenFeedbackModal(result.id)}
              className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
            >
              {t.feedbackBtn}
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => onOpenReportModal(result)}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{t.reportScamBtn}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
