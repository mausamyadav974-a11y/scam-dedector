import React, { useState } from 'react';
import { X, Flag, EyeOff, Check } from 'lucide-react';
import { AnalysisCategory, AnonymousReportInput } from '../types';
import { sanitizePiiClient } from '../services/sanitizer';
import { submitAnonymousReportApi } from '../services/api';

interface AnonymousReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillContent?: string;
  prefillCategory?: AnalysisCategory;
}

export const AnonymousReportModal: React.FC<AnonymousReportModalProps> = ({
  isOpen,
  onClose,
  prefillContent = '',
  prefillCategory = 'message',
}) => {
  const [category, setCategory] = useState<AnalysisCategory>(prefillCategory);
  const [content, setContent] = useState(prefillContent);
  const [reason, setReason] = useState('');
  const [channel, setChannel] = useState('SMS / WhatsApp');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const sanitized = sanitizePiiClient(content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !reason.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const payload: AnonymousReportInput = {
      category,
      content: sanitized.sanitizedText,
      suspicionReason: reason,
      sourceChannel: channel,
      consentTimestamp: new Date().toISOString(),
    };

    await submitAnonymousReportApi(payload);
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-navy-950 border border-navy-800 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Anonymous Scam Reporting</h3>
            <p className="text-xs text-slate-400">Help alert the community without disclosing your identity</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400 mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Report Submitted Anonymously</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Thank you! All personal identifiers were scrubbed and zero IP logs were stored. Your report helps refine community threat intelligence.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Report Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'message', label: 'Scam Message' },
                  { id: 'url', label: 'Phishing URL' },
                  { id: 'news', label: 'Fake News' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as AnalysisCategory)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      category === item.id
                        ? 'bg-teal-500 text-navy-950 border-teal-400 font-bold'
                        : 'bg-navy-900 text-slate-300 border-navy-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Source channel */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Received via (Channel)
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full bg-navy-900 border border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-teal-500"
              >
                <option value="WhatsApp / SMS">WhatsApp / SMS</option>
                <option value="Email">Email</option>
                <option value="Telegram">Telegram</option>
                <option value="Instagram / Social Media">Instagram / Social Media</option>
                <option value="Phone Call (Voice/IVR)">Phone Call (Voice/IVR)</option>
                <option value="Website / Browser Pop-up">Website / Browser Pop-up</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Scam Content */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Content or Link
              </label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the message text, scam script, or URL..."
                className="w-full bg-navy-900 border border-navy-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500"
              />
            </div>

            {/* Suspicion Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Why is this suspicious?
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Asked for OTP, threatened digital arrest, or offered $500/day job"
                className="w-full bg-navy-900 border border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500"
              />
            </div>

            {/* Data Minimization Transparency Preview */}
            <div className="p-3 rounded-2xl bg-navy-900/90 border border-navy-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                <EyeOff className="w-3.5 h-3.5" />
                <span>Zero-PII Data Minimization Active</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Before this report reaches the server, all telephone numbers, email addresses, and credit cards are scrubbed. Your IP address is never stored in any database.
              </p>
              {sanitized.redactedCount > 0 && (
                <div className="text-[11px] text-teal-300 font-mono bg-navy-950 p-2 rounded-lg border border-navy-800">
                  {sanitized.redactedCount} personal item(s) will be masked in preview.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim() || !reason.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Submitting Anonymously...' : 'Submit Anonymous Report'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
