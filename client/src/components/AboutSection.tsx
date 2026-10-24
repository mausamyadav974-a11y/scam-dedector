import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How does TruthGuard AI verify fake news claims?',
    a: 'We extract declarative assertions and cross-reference them against verified fact-checking records published by International Fact-Checking Network (IFCN) signatories such as Reuters, AP Fact Check, Snopes, PIB Fact Check, and Alt News. We also evaluate stylistic clickbait markers and sensationalist emotional triggers. If no verifiable independent records exist, we return "Unverified" rather than guessing.',
  },
  {
    q: 'Why does TruthGuard say "HTTPS does not mean safe"?',
    a: 'HTTPS only guarantees that data traveling between your device and the server is encrypted against eavesdroppers. It does not verify the moral character of the website owner. Today, automated free SSL certificate authorities (like Let\'s Encrypt) provide certificates to anyone in seconds, and more than 80% of active phishing websites operate over HTTPS.',
  },
  {
    q: 'What is the difference between "Confidence Level" and "Probability of Fraud"?',
    a: 'Many AI tools show arbitrary numbers like "87.3% likely scam" which are pseudo-scientific guesses. In TruthGuard AI, our Confidence Level represents Evidence Strength: how much empirical data or authoritative fact-checking corroboration exists for the verdict. We never present uncalibrated machine learning outputs as definitive statistical probabilities.',
  },
  {
    q: 'Can TruthGuard AI make mistakes?',
    a: 'Yes. Automated systems are decision-support tools, not omniscient judges. Sophisticated targeted scams evolve novel language patterns, and breaking news takes time for investigative reporters to verify. That is why we provide transparent reasoning, links to source articles, and an anonymous feedback option to correct errors.',
  },
  {
    q: 'Is TruthGuard AI free to use?',
    a: 'Yes, 100% free with no subscription tiers, no account requirements, and zero advertising trackers.',
  },
];

export const AboutSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in text-left">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
          <Info className="w-3.5 h-3.5" />
          <span>About TruthGuard AI</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Transparency & Methodology
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          Our mission is to arm ordinary citizens with transparent, evidence-based verification tools to protect families from digital extortion and online deception.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800">
          <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Evidence-Based Logic</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We prioritize accredited journalism, regulatory advisories, and empirical primary records over black-box AI generative guesses.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800">
          <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Public Good Service</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Free forever for everyone. No corporate paywalls, no mandatory phone numbers, and no selling submission data for monetization.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Responsible Humility</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We never accuse named individuals of crimes based on automated scores, and we provide clear disclaimers of automated analysis limits.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3 max-w-3xl mx-auto">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-navy-900/80 border border-navy-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-semibold text-sm sm:text-base text-slate-100 hover:text-teal-300 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-navy-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
