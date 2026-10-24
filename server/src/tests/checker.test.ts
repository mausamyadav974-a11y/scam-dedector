import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sanitizePii } from '../services/piiSanitizer';
import { checkNewsContent } from '../services/newsChecker';
import { checkScamMessage } from '../services/scamChecker';
import { checkUrlSafety, isPrivateOrReservedIp, checkHomoglyphOrPunycode } from '../services/urlChecker';

describe('TruthGuard Security & Verification Test Suite', () => {

  describe('1. PII Sanitizer', () => {
    it('should redact emails, phone numbers, and credit cards', () => {
      const input = 'Call me at 9876543210 or email test.user@example.com with card 4111 2222 3333 4444';
      const result = sanitizePii(input);
      assert.strictEqual(result.sanitizedText.includes('test.user@example.com'), false);
      assert.strictEqual(result.sanitizedText.includes('4111 2222 3333 4444'), false);
      assert.strictEqual(result.sanitizedText.includes('[REDACTED_EMAIL]'), true);
      assert.strictEqual(result.sanitizedText.includes('[REDACTED_CARD_NUMBER]'), true);
      assert.ok(result.redactedCount >= 2);
    });

    it('should redact Aadhaar and SSN numbers', () => {
      const input = 'My SSN is 123-45-6789 and Aadhaar is 1234 5678 9012';
      const result = sanitizePii(input);
      assert.strictEqual(result.sanitizedText.includes('123-45-6789'), false);
      assert.strictEqual(result.sanitizedText.includes('1234 5678 9012'), false);
      assert.strictEqual(result.sanitizedText.includes('[REDACTED_SSN]'), true);
      assert.strictEqual(result.sanitizedText.includes('[REDACTED_AADHAAR]'), true);
    });
  });

  describe('2. Scam Message Checker', () => {
    it('should flag Digital Arrest scams as critical/high_risk', () => {
      const scamMsg = 'URGENT: This is Cyber Cell Police. A digital arrest warrant is issued against your name for narcotics parcel seized by customs. You must join Skype video call immediately.';
      const res = checkScamMessage(scamMsg);
      assert.strictEqual(res.riskLevel, 'high_risk');
      assert.ok(res.riskScore >= 60);
      assert.ok(res.warningSignals.some(w => w.id === 'digital_arrest_scam'));
    });

    it('should flag OTP & credential theft as high_risk', () => {
      const otpMsg = 'Dear customer, your SBI account is suspended. Update KYC immediately or account will be permanently closed. Share the OTP sent to verify.';
      const res = checkScamMessage(otpMsg);
      assert.strictEqual(res.riskLevel, 'high_risk');
      assert.ok(res.warningSignals.some(w => w.id === 'otp_password_request'));
    });

    it('should flag fake job task scams', () => {
      const jobMsg = 'Part-time job liking YouTube videos! Earn Rs 5000 per day from home. Contact recruiter on Telegram.';
      const res = checkScamMessage(jobMsg);
      assert.ok(res.riskLevel === 'suspicious' || res.riskLevel === 'high_risk');
      assert.ok(res.warningSignals.some(w => w.id === 'fake_job_task_scam'));
    });

    it('should identify legitimate messages as trustworthy', () => {
      const safeMsg = 'Hi Mom, I will be home by 6 PM for dinner. Can you please pick up some milk if you go to the store? Thanks!';
      const res = checkScamMessage(safeMsg);
      assert.strictEqual(res.riskLevel, 'trustworthy');
      assert.strictEqual(res.warningSignals.length, 0);
    });
  });

  describe('3. News Verification Checker', () => {
    it('should detect debunked health misinformation (Lemon Cancer Cure)', () => {
      const news = 'Drinking hot lemon water kills cancer cells 1000 times better than chemotherapy. Doctors hide this secret!';
      const res = checkNewsContent(news);
      assert.strictEqual(res.riskLevel, 'high_risk');
      assert.ok(res.evidenceSources.length > 0);
      assert.strictEqual(res.evidenceSources[0].verdict, 'False');
      assert.ok(res.evidenceSources[0].publisher.includes('Reuters'));
    });

    it('should flag extreme clickbait sensationalism as suspicious', () => {
      const clickbait = 'SHOCKING truth revealed! Government secretly banned this miracle cure! Forward before it is deleted!';
      const res = checkNewsContent(clickbait);
      assert.strictEqual(res.riskLevel, 'suspicious');
      assert.ok(res.warningSignals.some(w => w.title.includes('Sensationalist')));
    });

    it('should mark uncorroborated brief text as unverified without false accusations', () => {
      const unverified = 'The local council discussed a new park construction proposal during their annual meeting.';
      const res = checkNewsContent(unverified);
      assert.strictEqual(res.riskLevel, 'unverified');
    });
  });

  describe('4. URL & SSRF Security Defense', () => {
    it('should block localhost and loopback interfaces (SSRF defense)', async () => {
      const res1 = await checkUrlSafety('http://localhost:8080/admin');
      assert.strictEqual(res1.riskLevel, 'high_risk');
      assert.ok(res1.summary.includes('SSRF'));

      const res2 = await checkUrlSafety('http://127.0.0.1:3000/secret');
      assert.strictEqual(res2.riskLevel, 'high_risk');
      assert.ok(res2.summary.includes('SSRF'));
    });

    it('should block AWS/Cloud metadata IP (169.254.169.254)', async () => {
      const res = await checkUrlSafety('http://169.254.169.254/latest/meta-data/');
      assert.strictEqual(res.riskLevel, 'high_risk');
      assert.ok(res.summary.includes('SSRF') || res.summary.includes('Private'));
    });

    it('should detect homoglyph / punycode domains', () => {
      const puny = checkHomoglyphOrPunycode('xn--pple-43d.com');
      assert.strictEqual(puny.hasHomoglyph, true);
      assert.strictEqual(puny.punycode, true);
    });

    it('should flag typosquatting of known brands', async () => {
      const res = await checkUrlSafety('http://paypal-security-account-update.xyz/login');
      assert.strictEqual(res.riskLevel, 'high_risk');
      assert.ok(res.warningSignals.some(w => w.id.includes('typosquatting')));
    });

    it('should verify known safe domains and clarify HTTPS caveat', async () => {
      const res = await checkUrlSafety('https://wikipedia.org');
      assert.strictEqual(res.riskLevel, 'trustworthy');
      assert.ok(res.technicalDetails?.sslDisclaimer?.includes('HTTPS'));
    });
  });
});
