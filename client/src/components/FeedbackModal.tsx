import React, { useState } from 'react';
import { X, MessageSquare, Check } from 'lucide-react';
import { submitFeedbackApi } from '../services/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanId: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  scanId,
}) => {
  const [feedbackType, setFeedbackType] = useState<'false_positive' | 'false_negative' | 'helpful' | 'unhelpful'>('false_positive');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitFeedbackApi(scanId, feedbackType, comments);
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-navy-950 border border-navy-800 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-white">Assessment Feedback</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Report inaccuracies anonymously to help tune detection algorithms. Zero identity data collected.
        </p>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400 mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Thank You!</h4>
            <p className="text-xs text-slate-300">Your feedback has been anonymously registered.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Feedback Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFeedbackType('false_positive')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    feedbackType === 'false_positive'
                      ? 'bg-amber-950/80 border-amber-500/60 text-amber-200 font-bold'
                      : 'bg-navy-900 border-navy-800 text-slate-300'
                  }`}
                >
                  <span className="block font-semibold">False Positive</span>
                  <span className="text-[10px] text-slate-400">Safe content flagged as risk</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('false_negative')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    feedbackType === 'false_negative'
                      ? 'bg-red-950/80 border-red-500/60 text-red-200 font-bold'
                      : 'bg-navy-900 border-navy-800 text-slate-300'
                  }`}
                >
                  <span className="block font-semibold">False Negative</span>
                  <span className="text-[10px] text-slate-400">Scam missed or scored safe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('helpful')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    feedbackType === 'helpful'
                      ? 'bg-teal-950/80 border-teal-500/60 text-teal-200 font-bold'
                      : 'bg-navy-900 border-navy-800 text-slate-300'
                  }`}
                >
                  <span className="block font-semibold">Accurate & Helpful</span>
                  <span className="text-[10px] text-slate-400">Saved me from a scam</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType('unhelpful')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    feedbackType === 'unhelpful'
                      ? 'bg-navy-800 border-slate-600 text-slate-200 font-bold'
                      : 'bg-navy-900 border-navy-800 text-slate-300'
                  }`}
                >
                  <span className="block font-semibold">Unclear Explanation</span>
                  <span className="text-[10px] text-slate-400">Needs simpler guidance</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="What details did the analysis miss or get wrong?"
                className="w-full bg-navy-900 border border-navy-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Send Anonymous Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
