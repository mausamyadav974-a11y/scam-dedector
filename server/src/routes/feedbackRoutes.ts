import { Router, Request, Response } from 'express';
import { reportStore } from '../services/reportStore';
import { FeedbackInput } from '../types';

export const feedbackRouter = Router();

/**
 * POST /api/feedback
 * Submits feedback on scan results (e.g. false positive, false negative) without requiring identity.
 */
feedbackRouter.post('/', (req: Request, res: Response) => {
  const { scanId, feedbackType, comments } = req.body;

  if (!scanId || !feedbackType) {
    return res.status(400).json({
      error: 'Missing required feedback fields: scanId and feedbackType.',
    });
  }

  const validTypes = ['false_positive', 'false_negative', 'helpful', 'unhelpful'];
  if (!validTypes.includes(feedbackType)) {
    return res.status(400).json({
      error: `Invalid feedbackType. Must be one of: ${validTypes.join(', ')}`,
    });
  }

  const feedback: FeedbackInput = {
    scanId: String(scanId).slice(0, 100),
    feedbackType,
    comments: comments ? String(comments).slice(0, 500) : undefined,
  };

  try {
    reportStore.addFeedback(feedback);
    return res.json({
      success: true,
      message: 'Feedback received anonymously. Thank you for helping improve TruthGuard detection models.',
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Failed to record feedback.',
    });
  }
});
