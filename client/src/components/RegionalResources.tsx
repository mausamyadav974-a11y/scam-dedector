import React, { useState } from 'react';
import { PhoneCall, ExternalLink, Copy, Check, AlertCircle } from 'lucide-react';

interface HelplineResource {
  country: 'India' | 'USA' | 'UK' | 'Canada' | 'Australia' | 'Global';
  agency: string;
  serviceType: string;
  phoneNumber?: string;
  website: string;
  emailOrSms?: string;
  note: string;
  isEmergencyLine?: boolean;
}

const RESOURCES: HelplineResource[] = [
  {
    country: 'India',
    agency: 'National Cyber Crime Reporting Portal',
    serviceType: 'Financial Cyber Fraud Emergency & Complaint Portal',
    phoneNumber: '1930',
    website: 'https://cybercrime.gov.in',
    note: 'The "1930" Citizen Financial Cyber Fraud Reporting System operates 24x7 to freeze stolen money before withdrawal.',
    isEmergencyLine: true,
  },
  {
    country: 'India',
    agency: 'DoT Sanchar Saathi (Chakshu Portal)',
    serviceType: 'Suspected Fraud Call & WhatsApp / SMS Reporting',
    website: 'https://sancharsaathi.gov.in/sfc/',
    note: 'Department of Telecommunications portal for reporting fraudulent calls, WhatsApp impersonation, and fake lottery SMS.',
  },
  {
    country: 'USA',
    agency: 'FBI Internet Crime Complaint Center (IC3)',
    serviceType: 'Federal Cyber Fraud & Wire Scam Registry',
    website: 'https://www.ic3.gov',
    note: 'Official US federal reporting portal for cyber fraud, investment scams, BEC, and ransomware.',
  },
  {
    country: 'USA',
    agency: 'Federal Trade Commission (FTC)',
    serviceType: 'Consumer Fraud & Identity Theft',
    phoneNumber: '1-877-FTC-HELP (1-877-382-4357)',
    website: 'https://reportfraud.ftc.gov',
    note: 'For identity theft, imposter scams, and deceptive business practices.',
  },
  {
    country: 'UK',
    agency: 'Action Fraud (City of London Police)',
    serviceType: 'National Fraud & Cyber Crime Reporting Centre',
    phoneNumber: '0300 123 2040',
    website: 'https://www.actionfraud.police.uk',
    emailOrSms: 'Suspicious Email: report@phishing.gov.uk',
    note: 'Primary reporting contact in England, Wales, and Northern Ireland.',
  },
  {
    country: 'Canada',
    agency: 'Canadian Anti-Fraud Centre (CAFC)',
    serviceType: 'Royal Canadian Mounted Police (RCMP) Fraud Bureau',
    phoneNumber: '1-888-495-8501',
    website: 'https://antifraudcentre-centreantifraude.ca',
    note: 'National repository for fraud intelligence and victim assistance.',
  },
  {
    country: 'Australia',
    agency: 'Scamwatch & Australian Cyber Security Centre (ACSC)',
    serviceType: 'National Cyber Threat & Fraud Assistance',
    phoneNumber: '1300 292 371',
    website: 'https://www.cyber.gov.au',
    note: 'Report cybercrime and receive technical security guidance from ASD.',
  },
  {
    country: 'Global',
    agency: 'APWG (Anti-Phishing Working Group)',
    serviceType: 'Global Phishing Feed & Infrastructure Takedown',
    website: 'https://apwg.org',
    emailOrSms: 'reportphishing@apwg.org',
    note: 'International coalition collecting phishing domain data to trigger browser blocklists.',
  },
];

export const RegionalResources: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const filtered = selectedRegion === 'All'
    ? RESOURCES
    : RESOURCES.filter(r => r.country === selectedRegion);

  const handleCopy = (phone: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2500);
    });
  };

  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Official Regional Helplines</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Where to Report Cybercrime & Fraud
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          If you have lost money or received criminal extortion threats, contacting official law enforcement portals immediately is vital for freezing transactions.
        </p>

        {/* Region Filter Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['All', 'India', 'USA', 'UK', 'Canada', 'Australia', 'Global'].map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedRegion === region
                  ? 'bg-teal-500 text-navy-950 shadow-md font-bold'
                  : 'bg-navy-900 border border-navy-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Immediate Action Checklist Card */}
      <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-red-950/60 via-navy-900 to-navy-950 border border-red-500/30">
        <h3 className="text-base sm:text-lg font-bold text-red-300 flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span>Emergency Steps: If You Transferred Money or Leaked Passwords Right Now</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
            <strong className="text-white block mb-1">1. Call Bank Immediately</strong>
            <span className="text-slate-300">Call the fraud number on the back of your debit/credit card to freeze the card or transaction.</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
            <strong className="text-white block mb-1">2. Dial Cyber Helpline</strong>
            <span className="text-slate-300">In India dial <strong>1930</strong>; in UK dial <strong>0300 123 2040</strong>; in US file on <strong>ic3.gov</strong>.</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
            <strong className="text-white block mb-1">3. Reset Passwords</strong>
            <span className="text-slate-300">Change master passwords from a clean device and enable authenticator app 2FA.</span>
          </div>
          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800">
            <strong className="text-white block mb-1">4. Uninstall Remote Apps</strong>
            <span className="text-slate-300">Delete AnyDesk, TeamViewer, or QuickSupport if instructed to install them.</span>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl bg-navy-900/80 border transition-all flex flex-col justify-between ${
              item.isEmergencyLine
                ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                : 'border-navy-800/80 hover:border-navy-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-navy-950 text-teal-400 border border-navy-800 font-bold">
                  {item.country}
                </span>
                {item.isEmergencyLine && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                    24x7 Emergency Line
                  </span>
                )}
              </div>

              <h4 className="text-lg font-bold text-white mb-1">{item.agency}</h4>
              <p className="text-xs text-slate-400 mb-3">{item.serviceType}</p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.note}</p>
            </div>

            <div className="pt-4 border-t border-navy-800/80 flex flex-wrap items-center justify-between gap-3">
              {item.phoneNumber ? (
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${item.phoneNumber.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-bold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call {item.phoneNumber}</span>
                  </a>
                  <button
                    onClick={() => handleCopy(item.phoneNumber!)}
                    className="p-1.5 rounded-lg border border-navy-700 bg-navy-950 text-slate-400 hover:text-white transition-colors"
                    title="Copy phone number"
                  >
                    {copiedPhone === item.phoneNumber ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-mono">Web Portal Reporting</span>
              )}

              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-navy-950 hover:bg-navy-800 border border-navy-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3 h-3 text-teal-400" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
