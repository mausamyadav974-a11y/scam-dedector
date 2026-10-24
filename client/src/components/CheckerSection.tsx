import React, { useState } from 'react';
import { Newspaper, MessageSquareWarning, Link as LinkIcon, Sparkles, X, EyeOff } from 'lucide-react';
import { AnalysisCategory } from '../types';
import { sanitizePiiClient } from '../services/sanitizer';
import { translations } from '../translations';

interface CheckerSectionProps {
  lang: 'en' | 'hi';
  activeCategory: AnalysisCategory;
  onSelectCategory: (cat: AnalysisCategory) => void;
  onRunCheck: (category: AnalysisCategory, input: string) => void;
  isLoading: boolean;
}

interface SamplePreset {
  label: string;
  category: AnalysisCategory;
  text: string;
}

const PRESETS: SamplePreset[] = [
  {
    category: 'message',
    label: '🚨 Digital Arrest Scam',
    text: 'URGENT: This is Cyber Cell Police. A digital arrest warrant has been issued against your name for a parcel seized by customs containing narcotics. Join Skype video call immediately for verification or your bank accounts will be seized.',
  },
  {
    category: 'news',
    label: '🍋 Miracle Cancer Cure',
    text: 'Drinking hot lemon water kills cancer cells 1,000 times better than chemotherapy! Mainstream doctors and pharma companies are hiding this simple cure from the public. Share before deleted!',
  },
  {
    category: 'url',
    label: '🔗 Brand Typosquat Link',
    text: 'https://paypal-security-account-verification.xyz/login/confirm?user=secure',
  },
  {
    category: 'message',
    label: '💼 Fake YouTube Task Job',
    text: 'Part-time Work From Home Job! Earn Rs 4,500 daily by simply liking YouTube videos and rating hotels on Google Maps. No experience needed. Contact recruiter on Telegram @easy_income_daily.',
  },
  {
    category: 'news',
    label: '💻 Free Government Laptop',
    text: 'Government is distributing free laptops and 500,000 rupees to all students under Prime Minister Universal Digital Scheme. Pay 500 rupees registration fee to claim your device today.',
  },
  {
    category: 'url',
    label: '🛡️ Legitimate Authority URL',
    text: 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public',
  },
  {
    category: 'message',
    label: '✅ Safe Personal Message',
    text: 'Hi Sarah, the team meeting has been rescheduled to tomorrow at 10:30 AM in Conference Room B. Please review the quarterly slides when you have a moment.',
  },
];

export const CheckerSection: React.FC<CheckerSectionProps> = ({
  lang,
  activeCategory,
  onSelectCategory,
  onRunCheck,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [piiScrubEnabled, setPiiScrubEnabled] = useState(true);
  const [sanitizedPreview, setSanitizedPreview] = useState<{ text: string; count: number; types: string[] } | null>(null);

  const t = translations[lang].checker;

  const handleTextChange = (val: string) => {
    setInputText(val);
    if (piiScrubEnabled && activeCategory === 'message' && val.length > 5) {
      const res = sanitizePiiClient(val);
      setSanitizedPreview({ text: res.sanitizedText, count: res.redactedCount, types: res.redactedTypes });
    } else {
      setSanitizedPreview(null);
    }
  };

  const handleSelectPreset = (preset: SamplePreset) => {
    onSelectCategory(preset.category);
    setInputText(preset.text);
    if (piiScrubEnabled && preset.category === 'message') {
      const res = sanitizePiiClient(preset.text);
      setSanitizedPreview({ text: res.sanitizedText, count: res.redactedCount, types: res.redactedTypes });
    } else {
      setSanitizedPreview(null);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    let textToSend = inputText.trim();
    if (piiScrubEnabled && activeCategory === 'message' && sanitizedPreview?.count) {
      textToSend = sanitizedPreview.text;
    }

    onRunCheck(activeCategory, textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section id="checker-section" className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Category Tabs */}
      <div className="flex rounded-2xl bg-navy-900/90 p-1.5 border border-navy-800 shadow-xl max-w-2xl mx-auto mb-6">
        <button
          onClick={() => {
            onSelectCategory('news');
            setSanitizedPreview(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeCategory === 'news'
              ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-navy-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>{t.tabNews}</span>
        </button>

        <button
          onClick={() => onSelectCategory('message')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeCategory === 'message'
              ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-navy-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
          }`}
        >
          <MessageSquareWarning className="w-4 h-4" />
          <span>{t.tabScam}</span>
        </button>

        <button
          onClick={() => {
            onSelectCategory('url');
            setSanitizedPreview(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeCategory === 'url'
              ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-navy-950 shadow-md font-bold'
              : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>{t.tabUrl}</span>
        </button>
      </div>

      {/* Main Checker Card */}
      <div className="bg-navy-900/80 backdrop-blur-xl border border-navy-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl relative">
        <form onSubmit={handleSubmit}>
          
          {/* Header area of input */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <label htmlFor="checker-input" className="text-xs sm:text-sm font-medium text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              {activeCategory === 'news' && 'Paste Headline, Article Excerpt, or Claim:'}
              {activeCategory === 'message' && 'Paste Message, SMS, Email, or Job Details:'}
              {activeCategory === 'url' && 'Enter Target Website Address / URL:'}
            </label>

            {inputText && (
              <button
                type="button"
                onClick={() => {
                  setInputText('');
                  setSanitizedPreview(null);
                }}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.clearBtn}</span>
              </button>
            )}
          </div>

          {/* Textarea or Single line for URL */}
          <div className="relative">
            <textarea
              id="checker-input"
              rows={activeCategory === 'url' ? 3 : 5}
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeCategory === 'news'
                  ? t.placeholderNews
                  : activeCategory === 'message'
                  ? t.placeholderScam
                  : t.placeholderUrl
              }
              className="w-full bg-navy-950/80 border border-navy-700/80 rounded-2xl p-4 text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all resize-y font-sans leading-relaxed"
            />
          </div>

          {/* PII Scrubbing Assistant for Messages */}
          {activeCategory === 'message' && (
            <div className="mt-3 p-3 rounded-xl bg-navy-950/50 border border-navy-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={piiScrubEnabled}
                  onChange={(e) => {
                    setPiiScrubEnabled(e.target.checked);
                    if (e.target.checked && inputText) {
                      const res = sanitizePiiClient(inputText);
                      setSanitizedPreview({ text: res.sanitizedText, count: res.redactedCount, types: res.redactedTypes });
                    } else {
                      setSanitizedPreview(null);
                    }
                  }}
                  className="rounded border-navy-700 text-teal-500 focus:ring-teal-500 w-4 h-4"
                />
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-teal-400" />
                  {t.piiToggle}
                </span>
              </label>

              {sanitizedPreview && sanitizedPreview.count > 0 && (
                <span className="text-teal-400 font-medium px-2 py-0.5 rounded bg-teal-950/80 border border-teal-800/50">
                  🛡️ {sanitizedPreview.count} personal {sanitizedPreview.count === 1 ? 'item' : 'items'} ({sanitizedPreview.types.join(', ')}) will be redacted
                </span>
              )}
            </div>
          )}

          {/* Submit Row */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{inputText.length} characters</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-slate-500">Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-navy-800 text-[11px] font-mono border border-navy-700">Ctrl+Enter</kbd></span>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                !inputText.trim() || isLoading
                  ? 'bg-navy-800 text-slate-500 cursor-not-allowed border border-navy-700'
                  : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-navy-950 shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>{t.checkingBtn}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.checkBtn}</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Quick Sample Presets */}
        <div className="mt-6 pt-5 border-t border-navy-800/70">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            {t.samplePillsTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="px-3 py-1.5 rounded-lg bg-navy-950/70 hover:bg-navy-800 border border-navy-800 hover:border-teal-500/40 text-slate-300 hover:text-teal-300 text-xs font-medium transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
