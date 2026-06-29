import nodemailer from 'nodemailer';

export interface ContactMailOptions {
  visitorName: string;
  visitorEmail: string;
  subject: string;
  message: string;
}

let transporter: nodemailer.Transporter | null = null;

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function getTransporter() {
  if (!import.meta.env.ZOHO_SMTP_USER || !import.meta.env.ZOHO_SMTP_PASS) {
    throw new Error('Zoho SMTP credentials are not configured.');
  }

  transporter ??= nodemailer.createTransport({
    host: import.meta.env.ZOHO_SMTP_HOST ?? 'smtppro.zoho.com',
    port: parseInt(import.meta.env.ZOHO_SMTP_PORT ?? '465', 10),
    secure: import.meta.env.ZOHO_SMTP_SECURE !== 'false',
    auth: {
      user: import.meta.env.ZOHO_SMTP_USER,
      pass: import.meta.env.ZOHO_SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendContactEmail(opts: ContactMailOptions): Promise<void> {
  const mailer = getTransporter();

  const { visitorName, visitorEmail, subject, message } = opts;
  const from = import.meta.env.CONTACT_FROM_EMAIL ?? 'connect@amitupadhyay.com';
  const to = import.meta.env.CONTACT_TO_EMAIL ?? 'connect@amitupadhyay.com';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Amit Upadhyay Contact</title></head>
<body style="font-family:Arial,sans-serif;color:#111827;max-width:640px;margin:0 auto;padding:24px;background:#f8fafc">
  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;padding:26px">
    <div style="font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:#06b6d4;font-weight:800">Amit Upadhyay</div>
    <h1 style="margin:10px 0 18px;font-size:26px;color:#111827">New portfolio enquiry</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr><td style="padding:8px 0;color:#6b7280;width:90px">Name</td><td style="padding:8px 0;font-weight:700">${escapeHtml(visitorName)}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0">${escapeHtml(visitorEmail)}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0">${escapeHtml(subject)}</td></tr>
    </table>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;font-size:15px;line-height:1.65">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
  </div>
</body>
</html>`;

  await mailer.sendMail({
    from: `Amit Upadhyay <${from}>`,
    to,
    replyTo: visitorEmail,
    subject: `[Portfolio] ${subject}`,
    text: `Name: ${visitorName}\nEmail: ${visitorEmail}\nSubject: ${subject}\n\n${message}`,
    html,
  });
}

export async function sendContactWelcomeEmail(opts: ContactMailOptions): Promise<void> {
  const mailer = getTransporter();

  const { visitorName, visitorEmail, subject } = opts;
  const from = import.meta.env.CONTACT_FROM_EMAIL ?? 'connect@amitupadhyay.com';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Thanks for contacting Amit Upadhyay</title></head>
<body style="margin:0;background:#07111f;padding:24px;font-family:Arial,sans-serif;color:#e5e7eb">
  <table role="presentation" style="width:100%;max-width:620px;margin:0 auto;border-collapse:collapse">
    <tr>
      <td style="padding:30px;border:1px solid rgba(255,255,255,.12);border-radius:20px;background:#101827">
        <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#22d3ee;font-weight:800">Amit Upadhyay</div>
        <h1 style="margin:14px 0 10px;font-size:28px;line-height:1.2;color:#ffffff">Thanks for reaching out, ${escapeHtml(visitorName)}.</h1>
        <p style="margin:0 0 18px;color:#a8b3c7;font-size:16px;line-height:1.7">Your enquiry has reached Amit. I read these messages personally and will reply when I have useful context to share.</p>
        <div style="margin:22px 0;padding:16px;border-radius:14px;background:#07111f;border:1px solid rgba(255,255,255,.1)">
          <p style="margin:0 0 6px;color:#7c879a;font-size:12px;text-transform:uppercase;letter-spacing:.14em">Your topic</p>
          <p style="margin:0;color:#ffffff;font-size:16px;font-weight:700">${escapeHtml(subject)}</p>
        </div>
        <p style="margin:0;color:#a8b3c7;font-size:15px;line-height:1.7">You can also explore my writing and AI engineering notes at <a href="https://aiwisdom.dev" style="color:#22d3ee;text-decoration:none">aiwisdom.dev</a>.</p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,.1);margin:24px 0 14px">
        <p style="margin:0;color:#7c879a;font-size:12px;line-height:1.6">This confirmation was sent because you submitted the enquiry form at amitupadhyay.com. If this was not you, you can ignore this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await mailer.sendMail({
    from: `Amit Upadhyay <${from}>`,
    to: visitorEmail,
    replyTo: from,
    subject: 'Thanks for contacting Amit Upadhyay',
    text: `Hi ${visitorName},\n\nThanks for reaching out. Your enquiry about "${subject}" has reached Amit, and I will reply when I have useful context to share.\n\nIf this was not you, you can ignore this email.`,
    html,
  });
}
