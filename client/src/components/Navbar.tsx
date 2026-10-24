import React, { useState } from 'react';
import { Shield, History, Globe, Menu, X, BookOpen, PhoneCall, Flag, Lock, Info } from 'lucide-react';
import { translations } from '../translations';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  lang,
  onToggleLang,
  historyCount,
  onOpenHistory,
  onOpenReport,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang].nav;

  const handleNav = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-navy-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center space-x-2.5 focus:outline-none group text-left"
            aria-label="TruthGuard AI Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-navy-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                TruthGuard <span className="text-teal-400 font-mono text-sm px-1.5 py-0.5 rounded bg-teal-950/80 border border-teal-800/60">AI</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Verify Before You Trust</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'home' ? 'text-teal-400 bg-navy-900 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-navy-900/60'
              }`}
            >
              {t.home}
            </button>
            <button
              onClick={() => handleNav('check')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'check' ? 'text-teal-400 bg-navy-900 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-navy-900/60'
              }`}
            >
              {t.check}
            </button>
            <button
              onClick={() => handleNav('learn')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'learn' ? 'text-teal-400 bg-navy-900 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-navy-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-400/80" />
              {t.learn}
            </button>
            <button
              onClick={() => handleNav('helplines')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'helplines' ? 'text-teal-400 bg-navy-900 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-navy-900/60'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-emerald-400/80" />
              {t.helplines}
            </button>
            <button
              onClick={() => handleNav('privacy')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'privacy' ? 'text-teal-400 bg-navy-900 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-navy-900/60'
              }`}
            >
              <Lock className="w-4 h-4 text-slate-400" />
              {t.privacy}
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'about' ? 'text-teal-400 bg-navy-900 border border-teal-500/20' : 'text-slate-300 hover:text-white hover:bg-navy-900/60'
              }`}
            >
              <Info className="w-4 h-4 text-slate-400" />
              {t.about}
            </button>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-lg border border-navy-700 bg-navy-900 text-slate-300 hover:text-teal-300 hover:border-teal-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.langSwitch}</span>
            </button>

            {/* Local History Drawer Toggle */}
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-lg border border-navy-700 bg-navy-900 text-slate-300 hover:text-white hover:border-navy-600 transition-colors"
              title={t.history}
              aria-label={t.history}
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 text-[10px] font-bold text-navy-950 flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Report Scam Action Button */}
            <button
              onClick={onOpenReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-700/60 text-red-200 text-xs font-semibold transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-red-400" />
              <span>{t.report}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-900/95 border-b border-navy-800 px-4 pt-2 pb-5 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'home' ? 'text-teal-400 bg-navy-800' : 'text-slate-300'
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNav('check')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'check' ? 'text-teal-400 bg-navy-800' : 'text-slate-300'
            }`}
          >
            {t.check}
          </button>
          <button
            onClick={() => handleNav('learn')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'learn' ? 'text-teal-400 bg-navy-800' : 'text-slate-300'
            }`}
          >
            {t.learn}
          </button>
          <button
            onClick={() => handleNav('helplines')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'helplines' ? 'text-teal-400 bg-navy-800' : 'text-slate-300'
            }`}
          >
            {t.helplines}
          </button>
          <button
            onClick={() => handleNav('privacy')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'privacy' ? 'text-teal-400 bg-navy-800' : 'text-slate-300'
            }`}
          >
            {t.privacy}
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === 'about' ? 'text-teal-400 bg-navy-800' : 'text-slate-300'
            }`}
          >
            {t.about}
          </button>
          <div className="pt-2 border-t border-navy-800 flex justify-between items-center">
            <button
              onClick={() => {
                onOpenReport();
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-700/60 text-red-200 text-xs font-semibold"
            >
              <Flag className="w-3.5 h-3.5 text-red-400" />
              <span>{t.report}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
