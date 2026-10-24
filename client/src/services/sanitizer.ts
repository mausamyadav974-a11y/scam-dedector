/**
 * Client-Side PII Sanitizer
 * Strips phone numbers, emails, credit cards, national IDs locally in the browser
 * before transmitting data.
 */

export interface SanitizationResult {
  sanitizedText: string;
  redactedCount: number;
  redactedTypes: string[];
}

export function sanitizePiiClient(text: string): SanitizationResult {
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
    typesSet.add('Email');
    return '[REDACTED_EMAIL]';
  });

  // 2. Credit/Debit Card Numbers
  const cardRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b|\b\d{4}[ -]?\d{6}[ -]?\d{4,5}\b/g;
  sanitized = sanitized.replace(cardRegex, () => {
    count++;
    typesSet.add('Card Number');
    return '[REDACTED_CARD_NUMBER]';
  });

  // 3. Aadhaar (India: 12 digits, XXXX XXXX XXXX) - before phone
  const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/g;
  sanitized = sanitized.replace(aadhaarRegex, () => {
    count++;
    typesSet.add('Aadhaar ID');
    return '[REDACTED_AADHAAR]';
  });

  // 4. SSN (US: XXX-XX-XXXX) - before phone
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  sanitized = sanitized.replace(ssnRegex, () => {
    count++;
    typesSet.add('National ID / SSN');
    return '[REDACTED_SSN]';
  });

  // 5. Phone numbers (10 digits, international +91, +1, etc.)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;
  sanitized = sanitized.replace(phoneRegex, (match) => {
    const digitsOnly = match.replace(/\D/g, '');
    if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
      count++;
      typesSet.add('Phone Number');
      return '[REDACTED_PHONE]';
    }
    return match;
  });

  return {
    sanitizedText: sanitized,
    redactedCount: count,
    redactedTypes: Array.from(typesSet),
  };
}
