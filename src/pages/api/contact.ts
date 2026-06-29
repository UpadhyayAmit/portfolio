import type { APIRoute } from 'astro';
import { resolveMx } from 'node:dns/promises';
import { sendContactEmail, sendContactWelcomeEmail } from '../../lib/server/mail';

export const prerender = false;

const BLOCKED_DOMAINS = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'yopmail.com',
  ...csv(import.meta.env.BLOCKED_EMAIL_DOMAINS),
]);

const BLOCKED_EMAILS = new Set(csv(import.meta.env.BLOCKED_EMAILS));
const ALLOWED_SUBJECTS = new Set(['AI Architecture Advisory', 'Technical Collaboration', 'Speaking Opportunity', 'General Inquiry']);
const SPAM_PATTERNS = [/\bcasino\b/i, /\bcrypto\b/i, /\bforex\b/i, /\bloan\b/i, /\bviagra\b/i, /\bbacklinks?\b/i, /\bseo\s+services?\b/i, /\bwhatsapp\s+marketing\b/i];
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function csv(value?: string) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown';
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getDomain(email: string) {
  return email.split('@')[1]?.toLowerCase() ?? '';
}

function tooManyLinks(value: string) {
  const links = value.match(/https?:\/\/|www\.|\.com\b|\.net\b|\.org\b/gi);
  return (links?.length ?? 0) > 2;
}

function hasSpamContent(value: string) {
  return SPAM_PATTERNS.some((pattern) => pattern.test(value)) || /(.)\1{12,}/.test(value);
}

async function hasMxRecord(domain: string) {
  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (!checkRateLimit(getIp(request))) {
    return json({ ok: false, error: 'Too many requests. Please wait a few minutes.' }, 429);
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const { name, email, subject, message, website, startedAt } = body;
  if (website) return json({ ok: true });
  if (startedAt && Date.now() - Number(startedAt) < 2500) return json({ ok: true });

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) return json({ ok: false, error: 'Invalid name.' }, 400);
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ ok: false, error: 'Invalid email address.' }, 400);
  if (!subject || typeof subject !== 'string' || !ALLOWED_SUBJECTS.has(subject.trim()) || subject.length > 150) return json({ ok: false, error: 'Invalid subject.' }, 400);
  if (!message || typeof message !== 'string' || message.trim().length < 20 || message.length > 3000) return json({ ok: false, error: 'Message must be 20-3000 characters.' }, 400);

  const visitorEmail = normalizeEmail(email);
  const domain = getDomain(visitorEmail);
  if (BLOCKED_EMAILS.has(visitorEmail) || BLOCKED_DOMAINS.has(domain)) return json({ ok: false, error: 'This email address cannot be used for enquiries.' }, 400);
  if (!(await hasMxRecord(domain))) return json({ ok: false, error: 'Please use a valid email address that can receive replies.' }, 400);
  if (tooManyLinks(message) || hasSpamContent(`${name}\n${subject}\n${message}`)) return json({ ok: false, error: 'This enquiry looks like spam. Please remove promotional links or suspicious wording.' }, 400);

  const mailOptions = {
    visitorName: name.trim(),
    visitorEmail,
    subject: subject.trim(),
    message: message.trim(),
  };

  const results = await Promise.allSettled([
    sendContactEmail(mailOptions),
    import.meta.env.CONTACT_AUTO_REPLY_DISABLED === 'true' ? Promise.resolve() : sendContactWelcomeEmail(mailOptions),
  ]);

  const ownerMailFailed = results[0].status === 'rejected';
  if (ownerMailFailed) {
    console.error('[contact] notification mail error:', results[0].reason);
    return json({ ok: false, error: 'Failed to send email. Please try again.' }, 500);
  }
  if (results[1].status === 'rejected') console.error('[contact] welcome mail error:', results[1].reason);

  return json({ ok: true });
};
