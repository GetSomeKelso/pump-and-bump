import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendVerificationEmail(email, token, appUrl) {
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`;

  // If SMTP is not configured, log the link instead
  if (!process.env.SMTP_HOST) {
    console.log(`[EMAIL] Verification link for ${email}: ${verifyUrl}`);
    return;
  }

  const mail = getTransporter();
  await mail.sendMail({
    from: process.env.SMTP_FROM || '"Pump & Bump" <noreply@pumpandbump.app>',
    to: email,
    subject: 'Verify your Pump & Bump account',
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #2a2e1f; font-size: 24px;">Pump & Bump</h1>
        <p style="color: #6b6e5a;">Click below to verify your email and start tracking:</p>
        <a href="${verifyUrl}"
           style="display: inline-block; background: #556b2f; color: white; padding: 12px 24px;
                  border-radius: 12px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #7d8068; font-size: 12px; margin-top: 24px;">
          This link expires in 24 hours. If you didn't create this account, ignore this email.
        </p>
      </div>
    `,
  });
}
