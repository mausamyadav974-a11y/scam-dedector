import { Router, Request, Response } from 'express';
import { reportStore } from '../services/reportStore';
import { AnonymousReportInput } from '../types';

export const reportRouter = Router();

/**
 * POST /api/report
 * Submits an anonymous report with client-scrubbed details.
 */
reportRouter.post('/', (req: Request, res: Response) => {
  const { category, content, suspicionReason, sourceChannel, reportedUrl, consentTimestamp } = req.body;

  if (!category || !content || !suspicionReason) {
    return res.status(400).json({
      error: 'Missing required report fields: category, content, and suspicionReason.',
    });
  }

  const reportInput: AnonymousReportInput = {
    category,
    content: String(content).slice(0, 5000),
    suspicionReason: String(suspicionReason).slice(0, 500),
    sourceChannel: sourceChannel ? String(sourceChannel).slice(0, 100) : undefined,
    reportedUrl: reportedUrl ? String(reportedUrl).slice(0, 500) : undefined,
    consentTimestamp: consentTimestamp || new Date().toISOString(),
  };

  try {
    const saved = reportStore.addReport(reportInput);
    return res.status(201).json({
      success: true,
      message: 'Anonymous report submitted successfully with zero personal data logged.',
      reportId: saved.id,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Failed to record anonymous report.',
    });
  }
});

/**
 * GET /api/reports/recent
 * Returns sanitized community scam alerts.
 */
reportRouter.get('/recent', (_req: Request, res: Response) => {
  try {
    const alerts = reportStore.getRecentReports(10);
    return res.json({ alerts });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Failed to retrieve recent scam alerts.',
    });
  }
});
