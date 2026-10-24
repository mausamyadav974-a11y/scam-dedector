import { Router, Request, Response } from 'express';
import { checkNewsContent } from '../services/newsChecker';
import { checkScamMessage } from '../services/scamChecker';
import { checkUrlSafety } from '../services/urlChecker';

export const checkRouter = Router();

/**
 * POST /api/check/news
 * Analyzes news claim, article excerpt, or headline.
 */
checkRouter.post('/news', (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'Missing or invalid "text" field in request body.',
    });
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({
      error: 'Text input cannot be empty.',
    });
  }

  try {
    const result = checkNewsContent(trimmed);
    return res.json(result);
  } catch (err: any) {
    // Secure error handling: do not leak internal stack traces
    return res.status(500).json({
      error: 'An internal error occurred while analyzing news content.',
    });
  }
});

/**
 * POST /api/check/scam
 * Evaluates message, SMS, email, or job offer text for fraud indicators.
 */
checkRouter.post('/scam', (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'Missing or invalid "text" field in request body.',
    });
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({
      error: 'Text input cannot be empty.',
    });
  }

  try {
    const result = checkScamMessage(trimmed);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: 'An internal error occurred while evaluating scam patterns.',
    });
  }
});

/**
 * POST /api/check/url
 * Evaluates URL for threat indicators, homoglyphs, typosquatting, and SSRF safety.
 */
checkRouter.post('/url', async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      error: 'Missing or invalid "url" field in request body.',
    });
  }

  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({
      error: 'URL cannot be empty.',
    });
  }

  try {
    const result = await checkUrlSafety(trimmed);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: 'An internal error occurred while validating URL safety.',
    });
  }
});
