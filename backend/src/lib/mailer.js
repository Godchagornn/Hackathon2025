const nodemailer = require('nodemailer');

let cachedTransporter = null;

function isConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM_EMAIL);
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (!isConfigured()) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

  return cachedTransporter;
}

async function sendMail({ to, subject, html, text }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      '[mailer] SMTP not configured. Set SMTP_HOST and SMTP_FROM_EMAIL to enable email delivery.',
    );
    return { delivered: false, reason: 'mailer_not_configured' };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });

  return { delivered: true };
}

module.exports = {
  isConfigured,
  sendMail,
};
