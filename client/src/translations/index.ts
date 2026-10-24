export interface Translations {
  nav: {
    home: string;
    check: string;
    learn: string;
    helplines: string;
    report: string;
    privacy: string;
    about: string;
    history: string;
    langSwitch: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    badgeFree: string;
    badgePrivacy: string;
    badgeNoAccount: string;
    ctaCheck: string;
    ctaLearn: string;
    statsScamsChecked: string;
    statsAccuracy: string;
    statsPrivacy: string;
  };
  checker: {
    tabNews: string;
    tabScam: string;
    tabUrl: string;
    placeholderNews: string;
    placeholderScam: string;
    placeholderUrl: string;
    checkBtn: string;
    checkingBtn: string;
    clearBtn: string;
    piiToggle: string;
    piiNotice: string;
    samplePillsTitle: string;
    offlineModeNotice: string;
  };
  results: {
    overallRisk: string;
    confidence: string;
    warningSigns: string;
    evidenceSources: string;
    claimsIdentified: string;
    nextSteps: string;
    disclaimerTitle: string;
    saveHistoryBtn: string;
    savedToHistory: string;
    copyReportBtn: string;
    copiedNotice: string;
    reportScamBtn: string;
    feedbackBtn: string;
    riskLevels: {
      trustworthy: string;
      suspicious: string;
      high_risk: string;
      unverified: string;
    };
    confidenceLevels: {
      high: string;
      moderate: string;
      low: string;
      insufficient: string;
    };
  };
}

export const translations: Record<'en' | 'hi', Translations> = {
  en: {
    nav: {
      home: 'Home',
      check: 'Verify Now',
      learn: 'Learn & Quiz',
      helplines: 'Helplines',
      report: 'Report Scam',
      privacy: 'Privacy & Security',
      about: 'About',
      history: 'Local History',
      langSwitch: 'हिन्दी',
    },
    hero: {
      headline: 'Verify Before You Trust.',
      subheadline: 'A free, privacy-first detector for fake news, fraudulent messages, job scams, and phishing websites. Zero logs, no registration required, transparent analysis.',
      badgeFree: '100% Free Forever',
      badgePrivacy: 'Zero-Retention Privacy',
      badgeNoAccount: 'No Sign-Up Needed',
      ctaCheck: 'Start Free Verification',
      ctaLearn: 'Scam Prevention Guide',
      statsScamsChecked: 'Verification Engine',
      statsAccuracy: 'Evidence-Based',
      statsPrivacy: 'Client-Side Redaction',
    },
    checker: {
      tabNews: 'Fake News & Claims',
      tabScam: 'Scam Messages & Emails',
      tabUrl: 'Suspicious URLs & Sites',
      placeholderNews: 'Paste a news headline, viral claim, article excerpt, or rumor to fact-check against accredited databases...',
      placeholderScam: 'Paste suspicious SMS, WhatsApp message, email, job offer, or payment request. Turn on PII Scrubbing to hide phone & email...',
      placeholderUrl: 'Enter website URL (e.g., https://example-bank-verify.xyz/login) for SSRF-safe security inspection...',
      checkBtn: 'Verify Now',
      checkingBtn: 'Analyzing Signals...',
      clearBtn: 'Clear',
      piiToggle: 'Auto-Scrub Personal Info (Phone, Email, Cards) Before Sending',
      piiNotice: 'Client-side redaction protects your privacy by masking sensitive numbers before transmission.',
      samplePillsTitle: 'Try a sample case:',
      offlineModeNotice: 'Working in browser offline mode. Checks run locally with zero server transmission.',
    },
    results: {
      overallRisk: 'Assessment Verdict',
      confidence: 'Confidence in Analysis',
      warningSigns: 'Detected Warning Signals',
      evidenceSources: 'Supporting Evidence & Fact-Checks',
      claimsIdentified: 'Extracted Factual Claims',
      nextSteps: 'Recommended Next Steps',
      disclaimerTitle: 'Verification Disclaimer',
      saveHistoryBtn: 'Save to Device',
      savedToHistory: 'Saved in Local History',
      copyReportBtn: 'Copy Sanitized Summary',
      copiedNotice: 'Summary Copied to Clipboard!',
      reportScamBtn: 'Report New Scam',
      feedbackBtn: 'Report Incorrect Result',
      riskLevels: {
        trustworthy: 'Likely Trustworthy',
        suspicious: 'Suspicious — Further Verification Recommended',
        high_risk: 'High Risk — Strong Indicators of Fraud or Phishing',
        unverified: 'Unverified — Insufficient Evidence',
      },
      confidenceLevels: {
        high: 'High Evidence Strength',
        moderate: 'Moderate Evidence Strength',
        low: 'Low Evidence Strength',
        insufficient: 'Insufficient Data for Confident Assessment',
      },
    },
  },
  hi: {
    nav: {
      home: 'होम',
      check: 'जांच करें',
      learn: 'सुरक्षा मार्गदर्शिका',
      helplines: 'हेल्पलाइन नंबर',
      report: 'स्कैम रिपोर्ट करें',
      privacy: 'गोपनीयता व सुरक्षा',
      about: 'हमारे बारे में',
      history: 'लोकल इतिहास',
      langSwitch: 'English',
    },
    hero: {
      headline: 'विश्वास करने से पहले जांचें।',
      subheadline: 'फर्जी खबरों, भ्रामक दावों, साइबर धोखाधड़ी, नौकरी के घोटालों और फ़िशिंग वेबसाइटों की पहचान करने वाला मुफ़्त, सुरक्षित और पारदर्शी AI टूल। कोई खाता या पंजीकरण आवश्यक नहीं।',
      badgeFree: 'सभी के लिए 100% मुफ़्त',
      badgePrivacy: 'शून्य डेटा संग्रह (Zero Retention)',
      badgeNoAccount: 'लॉगिन की आवश्यकता नहीं',
      ctaCheck: 'अभी निःशुल्क जांचें',
      ctaLearn: 'स्कैम से बचाव सीखें',
      statsScamsChecked: 'सत्यापन इंजन',
      statsAccuracy: 'तथ्य-आधारित जांच',
      statsPrivacy: 'स्थानीय डेटा सुरक्षा',
    },
    checker: {
      tabNews: 'फेक न्यूज़ और दावे',
      tabScam: 'धोखाधड़ी संदेश व ईमेल',
      tabUrl: 'संदिग्ध लिंक व वेबसाइट',
      placeholderNews: 'कोई भी वायरल खबर, दावा, संदेश या लेख यहां पेस्ट करें ताकि स्वतंत्र तथ्य-जांचकर्ताओं से मिलान किया जा सके...',
      placeholderScam: 'संदिग्ध SMS, व्हाट्सएप मैसेज, नौकरी का ऑफर या बैंक संबंधी संदेश यहां पेस्ट करें...',
      placeholderUrl: 'संदिग्ध लिंक या वेबसाइट दर्ज करें (जैसे: https://sbi-kyc-update.xyz)...',
      checkBtn: 'सत्यापित करें',
      checkingBtn: 'जांच की जा रही है...',
      clearBtn: 'हटाएं',
      piiToggle: 'भेजने से पहले व्यक्तिगत जानकारी (फोन नंबर, ईमेल, कार्ड) छुपाएं',
      piiNotice: 'ब्राउज़र में संवेदनशील नंबर स्वतः छिप जाते हैं ताकि आपकी गोपनीयता सुरक्षित रहे।',
      samplePillsTitle: 'उदाहरण आज़माएं:',
      offlineModeNotice: 'ब्राउज़र ऑफ़लाइन मोड में चल रहा है। सभी जांच आपके डिवाइस पर सुरक्षित रूप से की जा रही हैं।',
    },
    results: {
      overallRisk: 'सत्यापन परिणाम',
      confidence: 'विश्लेषण का विश्वास स्तर',
      warningSigns: 'पहचाने गए चेतावनी संकेत',
      evidenceSources: 'सहायक साक्ष्य और तथ्य-जांच स्रोत',
      claimsIdentified: 'निकाले गए प्रमुख दावे',
      nextSteps: 'सुझाए गए अगले कदम',
      disclaimerTitle: 'सत्यापन अस्वीकरण (Disclaimer)',
      saveHistoryBtn: 'डिवाइस में सहेजें',
      savedToHistory: 'इतिहास में सहेजा गया',
      copyReportBtn: 'रिपोर्ट कॉपी करें',
      copiedNotice: 'रिपोर्ट कॉपी हो गई!',
      reportScamBtn: 'नया स्कैम रिपोर्ट करें',
      feedbackBtn: 'गलत परिणाम की शिकायत',
      riskLevels: {
        trustworthy: 'संभवतः विश्वसनीय (विश्वस्त)',
        suspicious: 'संदिग्ध — आगे सत्यापन की सलाह',
        high_risk: 'उच्च जोखिम — धोखाधड़ी के पुख्ता संकेत',
        unverified: 'असत्यापित — अपर्याप्त साक्ष्य',
      },
      confidenceLevels: {
        high: 'उच्च साक्ष्य मजबूती',
        moderate: 'मध्यम साक्ष्य मजबूती',
        low: 'कम साक्ष्य मजबूती',
        insufficient: 'स्पष्ट निष्कर्ष के लिए अपर्याप्त डेटा',
      },
    },
  },
};
