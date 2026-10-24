import { AnonymousReportInput, FeedbackInput } from '../types';
import { sanitizePii } from './piiSanitizer';

export interface StoredAnonymousReport {
  id: string;
  timestamp: string;
  category: string;
  title: string;
  sanitizedSnippet: string;
  suspicionReason: string;
  sourceChannel?: string;
  reportedUrlDomain?: string;
}

// Initial community alerts demonstrating real-world scam trends
const initialAlerts: StoredAnonymousReport[] = [
  {
    id: 'rep_demo_1',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    category: 'message',
    title: 'Digital Arrest Call Posing as Telecom & CBI',
    sanitizedSnippet: 'Automated IVR call stating SIM will be disconnected in 2 hours for illegal narcotics parcel, press 9 to connect to police officer.',
    suspicionReason: 'Demanded Skype video call and threatened immediate arrest without formal warrant.',
    sourceChannel: 'WhatsApp / Cellular Voice',
  },
  {
    id: 'rep_demo_2',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    category: 'url',
    title: 'Phishing SMS: India Post / Courier Customs Duty',
    sanitizedSnippet: 'Package [REDACTED_CODE] detained due to missing house number. Pay Rs 25 redelivery fee at indiapost-update-address.top',
    suspicionReason: 'Domain used .top TLD and asked for full debit card CVV for a 25 rupee payment.',
    sourceChannel: 'SMS',
    reportedUrlDomain: 'indiapost-update-address.top',
  },
  {
    id: 'rep_demo_3',
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    category: 'message',
    title: 'Work from Home Hotel Review Scam',
    sanitizedSnippet: 'Earn Rs 4500 per day by giving 5-star reviews on Google Maps. Join Telegram VIP task group [REDACTED_LINK].',
    suspicionReason: 'After 3 free tasks, demanded Rs 2000 deposit to unlock "merchant level 2" payouts.',
    sourceChannel: 'Telegram / WhatsApp',
  },
  {
    id: 'rep_demo_4',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    category: 'news',
    title: 'Viral WhatsApp Medical Forward on Hot Lemon Cancer Cure',
    sanitizedSnippet: 'Hot lemon water kills cancer cells 10,000 times better than chemo, doctors keep it secret. Forward to all groups.',
    suspicionReason: 'Debunked medical misinformation circulating on family groups with zero peer-reviewed citation.',
    sourceChannel: 'WhatsApp',
  },
];

class ReportStore {
  private reports: StoredAnonymousReport[] = [...initialAlerts];
  private feedbacks: Array<FeedbackInput & { id: string; timestamp: string }> = [];

  public addReport(input: AnonymousReportInput): StoredAnonymousReport {
    const { sanitizedText } = sanitizePii(input.content);
    const id = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    let domain = '';
    if (input.reportedUrl) {
      try {
        const u = new URL(input.reportedUrl.startsWith('http') ? input.reportedUrl : `https://${input.reportedUrl}`);
        domain = u.hostname;
      } catch {
        domain = input.reportedUrl.slice(0, 30);
      }
    }

    const newReport: StoredAnonymousReport = {
      id,
      timestamp: new Date().toISOString(),
      category: input.category,
      title: input.suspicionReason.slice(0, 60) || 'Community Reported Suspicious Activity',
      sanitizedSnippet: sanitizedText.slice(0, 180),
      suspicionReason: input.suspicionReason,
      sourceChannel: input.sourceChannel || 'Unspecified',
      reportedUrlDomain: domain || undefined,
    };

    // Prepend and limit store to 100 entries to prevent memory exhaustion
    this.reports.unshift(newReport);
    if (this.reports.length > 100) {
      this.reports.pop();
    }

    return newReport;
  }

  public getRecentReports(limit: number = 10): StoredAnonymousReport[] {
    return this.reports.slice(0, limit);
  }

  public addFeedback(feedback: FeedbackInput): { success: boolean } {
    this.feedbacks.unshift({
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...feedback,
    });
    if (this.feedbacks.length > 200) {
      this.feedbacks.pop();
    }
    return { success: true };
  }
}

export const reportStore = new ReportStore();
