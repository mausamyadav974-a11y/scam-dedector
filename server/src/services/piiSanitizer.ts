/**
 * PII Sanitizer — Privacy-First Zero-Retention Utility
 * Removes sensitive personal information (emails, phone numbers, card numbers, national IDs)
 * before any analysis or reporting is executed.
 */

export interface SanitizationResult {
  sanitizedText: string;
  redactedCount: number;
  redactedTypes: string[];
}

export function sanitizePii(text: string): SanitizationResult {
  if (!text) {
    return { sanitizedText: '', redactedCount: 0, redactedTypes: [] };
  }

  let sanitized = text;
  let count = 0;
  const typesSet = new Set<string>();

  // 1. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  sanitized = sanitized.replace(emailRegex, () => {
    count++;
    typesSet.add('email');
    return '[REDACTED_EMAIL]';
  });

  // 2. Credit/Debit Card Numbers (13-19 digits with optional spaces or dashes)
  const cardRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b|\b\d{4}[ -]?\d{6}[ -]?\d{4,5}\b/g;
  sanitized = sanitized.replace(cardRegex, () => {
    count++;
    typesSet.add('credit_card');
    return '[REDACTED_CARD_NUMBER]';
  });

  // 3. Aadhaar (India: 12 digits, XXXX XXXX XXXX) - check before phone
  const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/g;
  sanitized = sanitized.replace(aadhaarRegex, () => {
    count++;
    typesSet.add('aadhaar_id');
    return '[REDACTED_AADHAAR]';
  });

  // 4. SSN (US) / National ID pattern (XXX-XX-XXXX) - check before phone
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  sanitized = sanitized.replace(ssnRegex, () => {
    count++;
    typesSet.add('national_id');
    return '[REDACTED_SSN]';
  });

  // 5. Phone numbers (international, Indian 10-digit, US/UK formats)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;
  sanitized = sanitized.replace(phoneRegex, (match) => {
    // avoid matching isolated 3-4 digit numbers or years like 2024
    const digitsOnly = match.replace(/\D/g, '');
    if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
      count++;
      typesSet.add('phone_number');
      return '[REDACTED_PHONE]';
    }
    return match;
  });

  // 6. Cryptographic private keys / seeds / passwords
  const keyRegex = /\b(?:0x[a-fA-F0-9]{40,64}|xprv[a-zA-Z0-9]{100,})\b/g;
  sanitized = sanitized.replace(keyRegex, () => {
    count++;
    typesSet.add('crypto_key');
    return '[REDACTED_KEY]';
  });

  return {
    sanitizedText: sanitized,
    redactedCount: count,
    redactedTypes: Array.from(typesSet),
  };
}
