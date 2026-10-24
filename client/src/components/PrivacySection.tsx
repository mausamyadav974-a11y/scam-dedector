import React from 'react';
import { ShieldCheck, EyeOff, Lock, Server, Cpu, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  return (
    <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in text-left">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>Privacy & Security Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy-First by Engineering, Not Just by Policy
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          TruthGuard AI is architected with zero retention and strict data minimization. Here is a transparent breakdown of how data flows through the application.
        </p>
      </div>

      {/* Core Privacy Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero Mandatory Accounts or Tracking</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You never need an email, password, or credit card to verify any news, message, or link. We do not use third-party tracking pixels (e.g., Google Analytics or Meta Pixel), and no advertising cookies are ever set on your browser.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-navy-800 text-[11px] text-teal-300 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>GDPR, CCPA & Indian DPDP Act Aligned</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero-Retention RAM Processing</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When a message or article is sent to the server for analysis, it is evaluated strictly in volatile RAM and immediately discarded upon responding. We do not write user submission text to persistent disks, database tables, or application log files.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-navy-800 text-[11px] text-sky-300 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>No Submission Logs or Text Database</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Client-Side PII Redaction</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our frontend contains an automated client-side sanitization engine that detects phone numbers, email addresses, credit cards, and national identity numbers (Aadhaar/SSN), giving you the option to scrub them before data ever leaves your computer.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-navy-800 text-[11px] text-purple-300 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Local Browser-Level Scrubbing</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Device-Only Local History</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Any scans you choose to save are kept purely in your web browser's private <code className="text-teal-300 font-mono">localStorage</code>. You can inspect or permanently delete your scan history with a single click at any time.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-navy-800 text-[11px] text-emerald-300 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>1-Click Complete Data Wipe</span>
          </div>
        </div>
      </div>

      {/* Technical Network & SSRF Security Policy */}
      <div className="p-7 rounded-3xl bg-navy-900/90 border border-navy-800 mb-10">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <span>Technical Security & SSRF Defense Implementation</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          URL scanning can expose servers to Server-Side Request Forgery (SSRF) and DNS rebinding attacks. TruthGuard implements strict defensive controls:
        </p>
        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-teal-400 font-bold">•</span>
            <span><strong>Private IP & Loopback Blocking:</strong> Requests to <code className="text-teal-300 font-mono">127.0.0.1</code>, <code className="text-teal-300 font-mono">localhost</code>, <code className="text-teal-300 font-mono">10.0.0.0/8</code>, <code className="text-teal-300 font-mono">172.16.0.0/12</code>, <code className="text-teal-300 font-mono">192.168.0.0/16</code>, and IPv6 <code className="text-teal-300 font-mono">::1</code> are rejected before network sockets open.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 font-bold">•</span>
            <span><strong>Cloud Metadata Defense:</strong> Endpoints like <code className="text-teal-300 font-mono">169.254.169.254</code> (AWS/GCP instance metadata) are strictly blocked to prevent cloud credential theft.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 font-bold">•</span>
            <span><strong>No Arbitrary Script Execution:</strong> TruthGuard never executes submitted HTML, JavaScript, or downloads executable attachments from scanned links.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 font-bold">•</span>
            <span><strong>Safe User Sandboxing:</strong> We never automatically trigger redirects or open untrusted URLs in your client browser.</span>
          </li>
        </ul>
      </div>

      {/* Honest Limitations & Transparent Disclaimers */}
      <div className="p-6 rounded-3xl bg-navy-950/90 border border-amber-500/30">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Honest Disclaimer on Network Metadata & Anonymity</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          TruthGuard AI never logs your IP address or submission payloads to our application databases. However, no internet service can claim 100% mathematical anonymity: standard underlying network routers, DNS resolvers, and hosting infrastructure providers process low-level TCP/IP packet headers to route web traffic. If you require absolute anonymity from your ISP, we recommend using the Tor Browser or a trustworthy VPN.
        </p>
      </div>

    </section>
  );
};
