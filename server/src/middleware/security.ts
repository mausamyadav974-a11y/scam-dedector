import { Request, Response, NextFunction } from 'express';

/**
 * Privacy-First Zero-Retention Logging Middleware:
 * Explicitly blocks logging of sensitive request bodies, query params, or client IP addresses.
 * Only logs anonymous route hits and status codes for operational health metrics.
 */
export function zeroRetentionLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const method = req.method;
  const path = req.path;

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Note: Never log req.body, req.ip, or raw inputs to disk or external monitors.
    // Minimal ephemeral stdout only:
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[ANON-REQ] ${method} ${path} -> ${res.statusCode} (${duration}ms)`);
    }
  });

  next();
}

/**
 * Strict Input Size and Sanity Guard
 */
export function validateInputPayload(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type: Request must be application/json',
      });
    }

    // Safety checks on body
    const bodyStr = JSON.stringify(req.body || {});
    if (bodyStr.length > 60000) {
      return res.status(413).json({
        error: 'Payload Too Large: Content exceeds maximum safe evaluation size (50KB)',
      });
    }
  }
  next();
}
