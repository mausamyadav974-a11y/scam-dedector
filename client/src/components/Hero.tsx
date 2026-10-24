import React from 'react';
import { ShieldCheck, EyeOff, UserCheck, ArrowRight, BookOpen, AlertTriangle, Cpu, CheckCircle2 } from 'lucide-react';
import { translations } from '../translations';

interface HeroProps {
  lang: 'en' | 'hi';
  onStartChecking: () => void;
  onExploreLearn: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onStartChecking, onExploreLearn }) => {
  const t = translations[lang].hero;

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-navy-800/60 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-sky-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Privacy & Trust Guarantee Pills */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.badgeFree}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-700 text-slate-300 text-xs font-medium">
            <EyeOff className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.badgePrivacy}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-700 text-slate-300 text-xs font-medium">
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.badgeNoAccount}</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          {t.headline}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          {t.subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStartChecking}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-navy-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>{t.ctaCheck}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreLearn}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-900/90 hover:bg-navy-800 border border-navy-700 hover:border-slate-600 text-slate-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>{t.ctaLearn}</span>
          </button>
        </div>

        {/* Three Value Pillars */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 sm:p-5 rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm hover:border-navy-700 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-base mb-1">Accredited Evidence</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Cross-references claims with accredited IFCN fact-checkers (Reuters, AP, Snopes, PIB, Alt News). We never invent conclusions.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm hover:border-navy-700 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-red-950/80 border border-red-500/30 flex items-center justify-center text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-base mb-1">Multi-Vector Scam Defense</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Detects Digital Arrest coercion, OTP harvesting, fake job task traps, and brand typosquatting with plain-language explanations.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm hover:border-navy-700 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-base mb-1">SSRF & Privacy Hardened</h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Protected against SSRF, internal network scanning, and private IP leaks. Client-side PII scrubber protects your identity before submission.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
