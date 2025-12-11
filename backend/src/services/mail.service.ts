import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.FROM_EMAIL;
const contactEmailTo = process.env.CONTACT_EMAIL_TO;

if (!sendgridApiKey) {
  console.warn('SENDGRID_API_KEY is not set. Contact form emails will not be sent.');
} else {
  sgMail.setApiKey(sendgridApiKey);
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHtmlTemplate(payload: ContactEmailPayload): string {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const subject = escapeHtml(payload.subject || 'New Contact Form Message');
  const message = escapeHtml(payload.message).replace(/\n/g, '<br />');

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f4f5fb; padding: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); overflow: hidden;">
        <tr>
          <td style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #4f46e5, #06b6d4); color: #ffffff;">
            <h1 style="margin: 0; font-size: 20px;">New Contact Form Message</h1>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">A new message was submitted from the Focus Flow Timer contact form.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 24px 8px;">
            <h2 style="margin: 0 0 12px; font-size: 16px; color: #111827;">Details</h2>
            <table cellpadding="0" cellspacing="0" style="width: 100%; font-size: 14px; color: #374151;">
              <tr>
                <td style="padding: 4px 0; width: 120px; font-weight: 600; color: #6b7280;">Name</td>
                <td style="padding: 4px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; width: 120px; font-weight: 600; color: #6b7280;">Email</td>
                <td style="padding: 4px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 4px 0; width: 120px; font-weight: 600; color: #6b7280;">Subject</td>
                <td style="padding: 4px 0;">${subject}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 24px 20px;">
            <h2 style="margin: 0 0 8px; font-size: 16px; color: #111827;">Message</h2>
            <div style="padding: 12px 14px; border-radius: 8px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #111827; font-size: 14px; line-height: 1.6;">${message}</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 24px 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
            <p style="margin: 0;">This email was sent automatically from your Focus Flow Timer contact form.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  if (!sendgridApiKey || !fromEmail || !contactEmailTo) {
    console.warn('SendGrid or email configuration missing. Skipping contact email send.');
    throw new Error('Email configuration is not set up on the server.');
  }

  const subject = payload.subject && payload.subject.trim().length > 0
    ? `[Contact] ${payload.subject.trim()}`
    : 'New Contact Form Message';

  const html = buildHtmlTemplate(payload);

  const msg = {
    to: contactEmailTo,
    from: fromEmail,
    subject,
    html,
    replyTo: {
      email: payload.email,
      name: payload.name,
    },
  };

  await sgMail.send(msg);
}
