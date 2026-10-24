import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CheckerSection } from './components/CheckerSection';
import { ResultDisplay } from './components/ResultDisplay';
import { LocalHistoryModal } from './components/LocalHistoryModal';
import { LearnSection } from './components/LearnSection';
import { RegionalResources } from './components/RegionalResources';
import { AnonymousReportModal } from './components/AnonymousReportModal';
import { FeedbackModal } from './components/FeedbackModal';
import { PrivacySection } from './components/PrivacySection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

import { AnalysisCategory, AssessmentResult, ScanHistoryItem } from './types';
import { checkNewsApi, checkScamApi, checkUrlApi } from './services/api';
import {
  getScanHistory,
  saveScanToHistory,
  deleteScanFromHistory,
  clearAllScanHistory,
  getStoredLanguage,
  setStoredLanguage,
} from './services/storage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [activeCategory, setActiveCategory] = useState<AnalysisCategory>('news');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  
  // Modals & Drawers
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportPrefill, setReportPrefill] = useState<{ text?: string; category?: AnalysisCategory }>({});
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const [feedbackScanId, setFeedbackScanId] = useState<string>('');

  // Local storage history state
  const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>([]);
  const [savedScanIds, setSavedScanIds] = useState<Set<string>>(new Set());

  // Load initial settings
  useEffect(() => {
    setLang(getStoredLanguage());
    const stored = getScanHistory();
    setHistoryItems(stored);
    setSavedScanIds(new Set(stored.map(i => i.id)));
  }, []);

  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    setStoredLanguage(nextLang);
  };

  const handleRunCheck = async (category: AnalysisCategory, input: string) => {
    setIsLoading(true);
    setCurrentResult(null);

    let res: AssessmentResult;
    try {
      if (category === 'news') {
        res = await checkNewsApi(input);
      } else if (category === 'message') {
        res = await checkScamApi(input);
      } else {
        res = await checkUrlApi(input);
      }
      setCurrentResult(res);

      // Smooth scroll to results if on home/check
      setTimeout(() => {
        const el = document.getElementById('results-view');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Scan execution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToHistory = (res: AssessmentResult) => {
    const historyItem: ScanHistoryItem = {
      id: res.id,
      timestamp: res.timestamp,
      category: res.category,
      title: res.inputExcerpt.slice(0, 50) || 'Scan result',
      riskLevel: res.riskLevel,
      summarySnippet: res.summary.slice(0, 100),
      result: res,
    };
    saveScanToHistory(historyItem);
    const updated = getScanHistory();
    setHistoryItems(updated);
    setSavedScanIds(new Set(updated.map(i => i.id)));
  };

  const handleDeleteHistoryItem = (id: string) => {
    deleteScanFromHistory(id);
    const updated = getScanHistory();
    setHistoryItems(updated);
    setSavedScanIds(new Set(updated.map(i => i.id)));
  };

  const handleClearAllHistory = () => {
    clearAllScanHistory();
    setHistoryItems([]);
    setSavedScanIds(new Set());
  };

  const handleSelectHistoryScan = (item: ScanHistoryItem) => {
    setCurrentResult(item.result);
    setActiveCategory(item.category);
    setCurrentTab('check');
    setTimeout(() => {
      const el = document.getElementById('results-view');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleOpenReportWithPrefill = (res: AssessmentResult) => {
    setReportPrefill({
      text: res.inputExcerpt,
      category: res.category,
    });
    setReportModalOpen(true);
  };

  const handleOpenFeedback = (scanId: string) => {
    setFeedbackScanId(scanId);
    setFeedbackModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 font-sans selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        onToggleLang={handleToggleLang}
        historyCount={historyItems.length}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenReport={() => {
          setReportPrefill({});
          setReportModalOpen(true);
        }}
      />

      {/* Main Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <Hero
              lang={lang}
              onStartChecking={() => {
                const el = document.getElementById('checker-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreLearn={() => {
                setCurrentTab('learn');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <CheckerSection
              lang={lang}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onRunCheck={handleRunCheck}
              isLoading={isLoading}
            />

            {currentResult && (
              <div id="results-view">
                <ResultDisplay
                  result={currentResult}
                  lang={lang}
                  onSaveToHistory={handleSaveToHistory}
                  isSaved={savedScanIds.has(currentResult.id)}
                  onOpenReportModal={handleOpenReportWithPrefill}
                  onOpenFeedbackModal={handleOpenFeedback}
                />
              </div>
            )}

            {/* Quick Teasers on Homepage */}
            <div className="py-8 bg-navy-900/40 border-t border-navy-800/60">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Empowering Digital Self-Defense</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mb-6">
                  Cybercrime and viral health misinformation exploit hesitation and fear. Equip yourself and your family with verified knowledge.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentTab('learn');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-teal-300 text-xs font-semibold transition-all"
                  >
                    Take Interactive Scam Quiz
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('helplines');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-emerald-300 text-xs font-semibold transition-all"
                  >
                    View Emergency Helplines (1930 / IC3)
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {currentTab === 'check' && (
          <div className="pt-8">
            <div className="text-center max-w-2xl mx-auto px-4 mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Full Verification Suite</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select your category below and paste untrusted text or links for instant heuristic evaluation.
              </p>
            </div>

            <CheckerSection
              lang={lang}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onRunCheck={handleRunCheck}
              isLoading={isLoading}
            />

            {currentResult && (
              <div id="results-view">
                <ResultDisplay
                  result={currentResult}
                  lang={lang}
                  onSaveToHistory={handleSaveToHistory}
                  isSaved={savedScanIds.has(currentResult.id)}
                  onOpenReportModal={handleOpenReportWithPrefill}
                  onOpenFeedbackModal={handleOpenFeedback}
                />
              </div>
            )}
          </div>
        )}

        {currentTab === 'learn' && <LearnSection />}

        {currentTab === 'helplines' && <RegionalResources />}

        {currentTab === 'privacy' && <PrivacySection />}

        {currentTab === 'about' && <AboutSection />}
      </main>

      {/* Global Modals */}
      <LocalHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={historyItems}
        onSelectScan={handleSelectHistoryScan}
        onDeleteScan={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      <AnonymousReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        prefillContent={reportPrefill.text}
        prefillCategory={reportPrefill.category}
      />

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        scanId={feedbackScanId}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};
