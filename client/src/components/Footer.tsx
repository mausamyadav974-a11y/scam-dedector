import React from 'react';
import { Shield, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-navy-950 border-t border-navy-800/80 pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-navy-950">
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                TruthGuard <span className="text-teal-400 font-mono">AI</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              A free, privacy-first cybersecurity and digital literacy initiative empowering individuals to identify disinformation, phishing traps, and fraudulent schemes before falling victim.
            </p>
            <div className="flex items-center gap-2 text-teal-400/90 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero Account Required • Zero-Retention Architecture</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-teal-300 transition-colors">
                  Home & Quick Check
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('check')} className="hover:text-teal-300 transition-colors">
                  Full Verification Suite
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn')} className="hover:text-teal-300 transition-colors">
                  Scam Prevention & Quiz
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('helplines')} className="hover:text-teal-300 transition-colors">
                  Cybercrime Helplines (1930 / IC3)
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Transparency
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-teal-300 transition-colors">
                  Privacy Policy & Data Flows
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-teal-300 transition-colors">
                  Methodology & Limitations
                </button>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors"
                >
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ic3.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors"
                >
                  <span>FBI IC3 Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-navy-800/60 text-slate-400 text-[11px] leading-relaxed space-y-2">
          <p>
            <strong>Disclaimer:</strong> TruthGuard AI evaluations are automated heuristic risk assessments designed for educational and decision-support purposes. They do not constitute certified legal, financial, or cybersecurity warranties. Always verify sensitive information through accredited primary sources or certified counsel before taking financial or legal action.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-slate-400">
            <span>© {new Date().getFullYear()} TruthGuard AI. Open & Free for Public Benefit.</span>
            <span className="flex items-center gap-1">
              Built with privacy & care for global digital safety.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
