/**
 * Extracts contact information (emails, phone numbers) from text content
 */

// Email regex - captures most valid email formats
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

// Phone regex - captures various US phone formats
const PHONE_REGEX = /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

// Common non-contact emails to filter out
const EXCLUDED_EMAIL_DOMAINS = [
  'example.com',
  'test.com',
  'email.com',
  'domain.com',
  'sentry.io',
  'wixpress.com',
  'w3.org',
  'schema.org',
  'google.com',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'linkedin.com',
  'youtube.com',
  'pinterest.com',
];

const EXCLUDED_EMAIL_PREFIXES = [
  'noreply',
  'no-reply',
  'donotreply',
  'support@',
  'info@example',
  'admin@example',
  'test@',
];

export interface ExtractedContacts {
  emails: string[];
  phones: string[];
  hasContacts: boolean;
}

/**
 * Cleans and validates an email address
 */
function isValidEmail(email: string): boolean {
  const lowerEmail = email.toLowerCase();
  
  // Check excluded domains
  if (EXCLUDED_EMAIL_DOMAINS.some(domain => lowerEmail.endsWith(`@${domain}`))) {
    return false;
  }
  
  // Check excluded prefixes
  if (EXCLUDED_EMAIL_PREFIXES.some(prefix => lowerEmail.startsWith(prefix))) {
    return false;
  }
  
  // Basic validation
  if (email.length < 5 || email.length > 100) {
    return false;
  }
  
  return true;
}

/**
 * Cleans and validates a phone number
 */
function cleanPhoneNumber(phone: string): string | null {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Must have 10 or 11 digits (with country code)
  if (digits.length < 10 || digits.length > 11) {
    return null;
  }
  
  // Format as (XXX) XXX-XXXX
  const last10 = digits.slice(-10);
  return `(${last10.slice(0, 3)}) ${last10.slice(3, 6)}-${last10.slice(6)}`;
}

/**
 * Extracts contact information from text content
 */
export function extractContacts(content: string): ExtractedContacts {
  if (!content) {
    return { emails: [], phones: [], hasContacts: false };
  }
  
  // Extract emails
  const rawEmails = content.match(EMAIL_REGEX) || [];
  const emails = [...new Set(
    rawEmails
      .map(e => e.toLowerCase())
      .filter(isValidEmail)
  )].slice(0, 5); // Limit to 5 emails
  
  // Extract phones
  const rawPhones = content.match(PHONE_REGEX) || [];
  const phones = [...new Set(
    rawPhones
      .map(cleanPhoneNumber)
      .filter((p): p is string => p !== null)
  )].slice(0, 5); // Limit to 5 phones
  
  return {
    emails,
    phones,
    hasContacts: emails.length > 0 || phones.length > 0,
  };
}

/**
 * Formats extracted contacts for display
 */
export function formatContactsForDisplay(contacts: ExtractedContacts): string {
  const parts: string[] = [];
  
  if (contacts.emails.length > 0) {
    parts.push(`📧 ${contacts.emails.join(', ')}`);
  }
  
  if (contacts.phones.length > 0) {
    parts.push(`📞 ${contacts.phones.join(', ')}`);
  }
  
  return parts.join('\n');
}
