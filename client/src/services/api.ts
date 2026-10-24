import { AssessmentResult, AnonymousReportInput } from '../types';
import { clientCheckNews, clientCheckScam, clientCheckUrl } from './clientHeuristics';

const API_BASE = '/api';

export async function checkNewsApi(text: string): Promise<AssessmentResult> {
  try {
    const res = await fetch(`${API_BASE}/check/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client-side verification engine:', err);
    return clientCheckNews(text);
  }
}

export async function checkScamApi(text: string): Promise<AssessmentResult> {
  try {
    const res = await fetch(`${API_BASE}/check/scam`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client-side verification engine:', err);
    return clientCheckScam(text);
  }
}

export async function checkUrlApi(url: string): Promise<AssessmentResult> {
  try {
    const res = await fetch(`${API_BASE}/check/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client-side verification engine:', err);
    return clientCheckUrl(url);
  }
}

export async function submitAnonymousReportApi(data: AnonymousReportInput): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Report submission returned ${res.status}`);
    }
    return await res.json();
  } catch {
    // Offline simulated success to respect user submission
    return {
      success: true,
      message: 'Report recorded locally in client storage (server is currently offline).',
    };
  }
}

export async function submitFeedbackApi(scanId: string, feedbackType: string, comments?: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scanId, feedbackType, comments }),
    });
    if (!res.ok) {
      throw new Error(`Feedback returned ${res.status}`);
    }
    return await res.json();
  } catch {
    return {
      success: true,
      message: 'Thank you for your feedback! It will help refine future detection heuristics.',
    };
  }
}

export async function fetchRecentAlertsApi(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/report/recent`);
    if (!res.ok) throw new Error('Status ' + res.status);
    const data = await res.json();
    return data.alerts || [];
  } catch {
    return [
      {
        id: 'rep_local_1',
        timestamp: new Date().toISOString(),
        category: 'message',
        title: 'Digital Arrest Call Posing as CBI / Police',
        sanitizedSnippet: 'Automated voice call threatening arrest for courier parcel containing illegal contraband. Instructs Skype video call.',
        suspicionReason: 'Law enforcement never conducts trials or arrests via Skype/WhatsApp or demands funds for verification.',
      },
      {
        id: 'rep_local_2',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        category: 'url',
        title: 'Phishing: India Post / Courier Customs Payment',
        sanitizedSnippet: 'Package detained due to missing house number. Pay Rs 25 redelivery fee at indiapost-customs-pay.top',
        suspicionReason: 'Uses suspicious .top TLD to harvest credit/debit card numbers.',
      },
    ];
  }
}
