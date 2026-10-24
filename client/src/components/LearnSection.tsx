import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Award, CheckCircle2, XCircle, ArrowRight, Lightbulb, Lock, HelpCircle } from 'lucide-react';

interface QuizQuestion {
  id: number;
  scenario: string;
  sender: string;
  isScam: boolean;
  explanation: string;
  clue: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    sender: 'SMS from "SBI-ALERT"',
    scenario: 'Dear customer, your SBI account will be blocked within 24 hours. Click sbi-kyc-update.xyz to verify your Aadhaar and PAN immediately.',
    isScam: true,
    clue: 'Look closely at the domain (.xyz instead of official sbi.co.in) and the artificial 24-hour urgency deadline.',
    explanation: 'Scam! Legitimate banks never use .xyz domains or threaten 24-hour account suspension via SMS links.',
  },
  {
    id: 2,
    sender: 'WhatsApp Recruiter (+62...)',
    scenario: 'Hello! Our global marketing firm pays $150 per day for liking YouTube travel videos. No interview required. Reply YES to start.',
    isScam: true,
    clue: 'Unsolicited international number, unrealistically high pay for trivial tasks, and lack of interview.',
    explanation: 'Scam! This is a classic prepaid task scam. They pay small amounts initially, then demand thousands in "prepaid merchant deposits" to unlock your balance.',
  },
  {
    id: 3,
    sender: 'Google Account (no-reply@accounts.google.com)',
    scenario: 'New sign-in from Windows in Delhi, India. If this was you, you can ignore this alert. If not, check your security activity at myaccount.google.com/security.',
    isScam: false,
    clue: 'Sent from genuine official domain, directs you to the official domain without high-pressure panic or asking for OTP/passwords.',
    explanation: 'Legitimate! Official Google security alerts specify your actual device/location and point strictly to verified google.com endpoints without asking for credentials.',
  },
  {
    id: 4,
    sender: 'Phone Call: "CBI / Telecom Ministry"',
    scenario: 'A caller states your mobile number was registered with a SIM card used for human trafficking, and you are under "Digital Arrest". You must stay on video call.',
    isScam: true,
    clue: '"Digital Arrest" does not exist under Indian or international legal systems. Law enforcement does not conduct trials on Skype.',
    explanation: 'Scam! The Supreme Court and Ministry of Home Affairs have explicitly declared "Digital Arrest" to be 100% fraudulent. Disconnect immediately.',
  },
];

export const LearnSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guides' | 'quiz'>('guides');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQuizIndex];

  const handleAnswer = (userSaidScam: boolean) => {
    setSelectedAnswer(userSaidScam);
    if (userSaidScam === currentQ.isScam) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Digital Literacy & Scam Prevention</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How to Spot Deception Like a Pro
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          Scammers prey on fear, urgency, and misplaced trust. Learn the universal psychological triggers and test your instincts in the interactive simulator.
        </p>

        {/* Tab switch between Guides and Interactive Quiz */}
        <div className="mt-6 inline-flex rounded-xl bg-navy-900 p-1 border border-navy-800">
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'guides' ? 'bg-teal-500 text-navy-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tactical Security Guides
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'quiz' ? 'bg-teal-500 text-navy-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive Scam Quiz ({QUIZ_QUESTIONS.length} Questions)
          </button>
        </div>
      </div>

      {activeTab === 'guides' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Guide 1: Digital Arrest */}
          <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800/80 hover:border-red-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">The "Digital Arrest" Trap</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Criminals pose as police, CBI, or customs officials claiming your Aadhaar or phone was involved in money laundering or narcotics parcels. They threaten immediate arrest and force victims onto Skype video calls.
              </p>
              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-teal-300 font-medium">
                💡 <strong>Reality:</strong> Police never conduct interrogations via Skype/WhatsApp or demand money for "verification". Hang up immediately.
              </div>
            </div>
          </div>

          {/* Guide 2: Task-based Job Scams */}
          <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Work-From-Home Task Scams</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Offers of $50-$200 daily for liking YouTube videos, rating Google Maps locations, or hotel bookings. After paying a tiny reward, they lure victims into Telegram groups demanding prepaid deposits.
              </p>
              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-teal-300 font-medium">
                💡 <strong>Reality:</strong> Legitimate companies never charge employees money to unlock their salary.
              </div>
            </div>
          </div>

          {/* Guide 3: The HTTPS Myth */}
          <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800/80 hover:border-teal-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">The HTTPS / Padlock Myth</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Many believe a green padlock or "https://" proves a website is trustworthy. In reality, free SSL certificates allow 80%+ of modern phishing sites to use HTTPS.
              </p>
              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-teal-300 font-medium">
                💡 <strong>Reality:</strong> HTTPS only encrypts the wire between you and the server; it does NOT ensure the server isn't run by a scammer.
              </div>
            </div>
          </div>

          {/* Guide 4: Fake Couriers / Customs Fee */}
          <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800/80 hover:border-sky-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400 mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fake Courier Redelivery Fees</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Pretends to be FedEx, DHL, or India Post: "Package detained due to missing address. Pay $1.50 redelivery fee". The link leads to a clone site stealing credit cards.
              </p>
              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-teal-300 font-medium">
                💡 <strong>Reality:</strong> Always navigate directly to the courier's official tracking portal, never click unsolicited links.
              </div>
            </div>
          </div>

          {/* Guide 5: Lateral Reading for News */}
          <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800/80 hover:border-teal-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-4">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Lateral Reading Technique</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Professional fact-checkers don't stay on a suspicious website to assess its honesty. They immediately open 3 new tabs to see what other reputable news outlets report about that site.
              </p>
              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-teal-300 font-medium">
                💡 <strong>Reality:</strong> If a dramatic world event has happened, it will be independently covered by Reuters, AP, or BBC within minutes.
              </div>
            </div>
          </div>

          {/* Guide 6: The Golden Hour Rule */}
          <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">The "Golden Hour" If Scammed</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                If you transferred money to a scammer, reporting within the first 1–2 hours allows banks and cyber police (e.g. 1930 in India) to freeze funds before they are withdrawn at an ATM or converted to crypto.
              </p>
              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-teal-300 font-medium">
                💡 <strong>Action:</strong> Immediately call your bank fraud line and dial national cybercrime helplines.
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Interactive Quiz */
        <div className="max-w-2xl mx-auto bg-navy-900/90 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {!quizCompleted ? (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-navy-800 text-xs text-slate-400">
                <span>Question {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                <span className="font-mono text-teal-400 font-bold">Current Score: {quizScore}</span>
              </div>

              <div className="mt-6">
                <div className="text-xs font-mono uppercase text-slate-400 mb-1">
                  Sender: <strong className="text-slate-200">{currentQ.sender}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-navy-950/90 border border-navy-800 text-slate-100 text-sm sm:text-base leading-relaxed my-4">
                  "{currentQ.scenario}"
                </div>

                {selectedAnswer === null ? (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="py-3.5 px-4 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span>This is a Scam / Phishing</span>
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="py-3.5 px-4 rounded-xl bg-teal-950/60 hover:bg-teal-900 border border-teal-700/60 text-teal-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>This is Legitimate</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className={`p-4 rounded-2xl border ${
                      selectedAnswer === currentQ.isScam
                        ? 'bg-teal-950/60 border-teal-500/50 text-teal-200'
                        : 'bg-red-950/60 border-red-500/50 text-red-200'
                    }`}>
                      <div className="flex items-center gap-2 font-bold text-sm mb-1">
                        {selectedAnswer === currentQ.isScam ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-teal-400" />
                            <span>Correct! Well spotted.</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span>Incorrect. Be careful!</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-slate-200 mt-1">
                        {currentQ.explanation}
                      </p>
                      <p className="text-[11px] text-teal-300/90 mt-2 font-mono">
                        Key Clue: {currentQ.clue}
                      </p>
                    </div>

                    <button
                      onClick={handleNextQuiz}
                      className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <span>{currentQuizIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'View Final Score'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400 mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
              <p className="text-slate-300 text-base mb-4">
                You scored <strong className="text-teal-400">{quizScore}</strong> out of {QUIZ_QUESTIONS.length}!
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                {quizScore === QUIZ_QUESTIONS.length
                  ? 'Outstanding! You have sharp cyber situational awareness and know how to avoid high-pressure traps.'
                  : 'Good practice! Review the tactical guides above to master deceptive URL schemes and impersonation vectors.'}
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-sm transition-all"
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

    </section>
  );
};
