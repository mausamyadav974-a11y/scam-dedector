import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { checkRouter } from './routes/checkRoutes';
import { reportRouter } from './routes/reportRoutes';
import { feedbackRouter } from './routes/feedbackRoutes';
import { zeroRetentionLogger, validateInputPayload } from './middleware/security';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Strict Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS configuration (allows development client or configured origin)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours preflight cache
  })
);

// 3. Rate Limiter (Abuse Prevention & DoS Mitigation)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // Max 120 requests per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this client. Please wait a few minutes before trying again.',
  },
});
app.use('/api/', apiLimiter);

// 4. Strict Payload Size Limit (50 KB max to prevent buffer overflow/DoS)
app.use(express.json({ limit: '50kb' }));

// 5. Zero-Retention Middleware & Payload Validator
app.use(zeroRetentionLogger);
app.use(validateInputPayload);

// 6. API Route Handlers
app.use('/api/check', checkRouter);
app.use('/api/report', reportRouter);
app.use('/api/feedback', feedbackRouter);

// 7. Health & Privacy Attestation Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'TruthGuard AI Zero-Retention API',
    version: '1.0.0',
    privacyGuarantee: {
      zeroRetention: true,
      dataSold: false,
      trackingCookies: false,
      piiScrubbingActive: true,
      ssrfProtectionActive: true,
    },
    timestamp: new Date().toISOString(),
  });
});

// 8. Global 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Endpoint not found. Refer to TruthGuard AI API specification.',
  });
});

// 9. Global Error Handler (sanitized, zero internal stack trace exposure)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred.',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛡️  TruthGuard AI Server running on http://localhost:${PORT}`);
    console.log(`🔒  Privacy Mode: ZERO-RETENTION (No DB logs, No PII storage)`);
    console.log(`🛡️  SSRF Defense: ACTIVE`);
    console.log(`====================================================`);
  });
}

export default app;
