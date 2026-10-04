import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Check if SMTP credentials are configured in .env
 */
export const isSmtpConfigured = () => {
  const host = process.env.SMTP_HOST ? process.env.SMTP_HOST.trim() : '';
  const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : '';
  return Boolean(host && user && pass);
};

/**
 * Create and return Nodemailer transporter
 */
export const getTransporter = () => {
  const host = process.env.SMTP_HOST ? process.env.SMTP_HOST.trim() : 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false // Helps avoid self-signed cert errors on dev
    }
  });
};

/**
 * Send a generic email
 */
export const sendEmail = async ({ to, subject, html, text, from }) => {
  if (!isSmtpConfigured()) {
    console.log('[SMTP Notice] Email not sent: SMTP_USER or SMTP_PASS not set in .env');
    return { success: false, reason: 'SMTP not configured in .env' };
  }

  try {
    const transporter = getTransporter();
    const fromAddress = from || `"${process.env.SMTP_FROM_NAME || 'Edion Royal Guesthouse'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: text || '',
      html: html || text
    });

    console.log(`[SMTP Success] Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP Error] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification when a new booking enquiry / stay reservation is submitted
 */
export const sendBookingNotification = async (bookingData) => {
  const adminEmail = process.env.NOTIFICATION_RECEIVER_EMAIL || process.env.SMTP_USER || 'stay@edionroyal.co.za';
  const guestName = bookingData.name || bookingData.fullName || 'Guest';
  const guestEmail = bookingData.email || 'Not provided';
  const guestPhone = bookingData.phone || 'Not provided';
  const roomChoice = bookingData.room || bookingData.unitInterest || 'Any Room / Best Available';
  const checkIn = bookingData.checkIn ? (typeof bookingData.checkIn === 'string' ? bookingData.checkIn : new Date(bookingData.checkIn).toISOString().split('T')[0]) : 'Not specified';
  const checkOut = bookingData.checkOut ? (typeof bookingData.checkOut === 'string' ? bookingData.checkOut : new Date(bookingData.checkOut).toISOString().split('T')[0]) : 'Not specified';
  const message = bookingData.message || 'No special requests';

  // 1. Alert to Admin / Front Desk
  const adminSubject = `🏨 New Stay Enquiry: ${guestName} — ${roomChoice}`;
  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background: #0f172a; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: 0.5px;">EDION ROYAL GUESTHOUSE</h1>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">New Reservation Enquiry Notification</p>
      </div>

      <div style="padding: 24px 30px;">
        <p style="font-size: 15px; color: #334155; margin-top: 0;">
          A new booking inquiry has just been submitted on the website:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569; width: 150px;">Guest Name:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${guestName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Email:</td>
            <td style="padding: 10px 0; color: #0284c7;"><a href="mailto:${guestEmail}">${guestEmail}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Phone / WhatsApp:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;"><a href="tel:${guestPhone}">${guestPhone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Room Preference:</td>
            <td style="padding: 10px 0; color: #0f766e; font-weight: 700;">${roomChoice}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Check-in Date:</td>
            <td style="padding: 10px 0; color: #0f172a;">${checkIn}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #475569;">Check-out Date:</td>
            <td style="padding: 10px 0; color: #0f172a;">${checkOut}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #475569; vertical-align: top;">Message / Notes:</td>
            <td style="padding: 10px 0; color: #334155; line-height: 1.5;">${message}</td>
          </tr>
        </table>

        <div style="background: #f8fafc; border-left: 4px solid #06b6d4; padding: 12px 16px; margin: 24px 0; border-radius: 0 4px 4px 0;">
          <p style="margin: 0; font-size: 13px; color: #475569;">
            <strong>Outreach Desk Status:</strong> This lead has been automatically assigned to the <strong>Front Desk Manager</strong> in the Calling &amp; Outreach Desk.
          </p>
        </div>
      </div>

      <div style="background: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 12px; color: #64748b;">
        Edion Royal Guesthouse • 7 Arum Street, Milnerton, Cape Town, 7441
      </div>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: adminSubject,
    html: adminHtml
  });

  // 2. Friendly Confirmation Receipt to the Guest (if valid email provided)
  if (guestEmail && guestEmail.includes('@')) {
    const guestSubject = `Thank you for choosing Edion Royal Guesthouse — Reservation Enquiry Received`;
    const guestHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0f172a; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">EDION ROYAL GUESTHOUSE</h1>
          <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Milnerton · Cape Town</p>
        </div>

        <div style="padding: 28px 30px;">
          <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Dear ${guestName},</h2>
          <p style="font-size: 15px; color: #334155; line-height: 1.6;">
            Thank you for reaching out to Edion Royal Guesthouse. We have received your inquiry for <strong>${roomChoice}</strong> (${checkIn} to ${checkOut}).
          </p>

          <p style="font-size: 14px; color: #334155; line-height: 1.6;">
            Our reservations team is checking room availability and will contact you directly via phone, WhatsApp, or email shortly with our guaranteed best direct rate.
          </p>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #166534; font-weight: 700;">Need immediate assistance?</h3>
            <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
              Feel free to call or WhatsApp our 24-hour reception desk directly at <a href="tel:+27789724254" style="color: #15803d; font-weight: 700;">+27 78 972 4254</a> or reply to this email.
            </p>
          </div>

          <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
            Warm regards,<br />
            <strong>Front Desk &amp; Reservations Team</strong><br />
            Edion Royal Guesthouse
          </p>
        </div>

        <div style="background: #f8fafc; padding: 14px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          7 Arum Street, Milnerton, Cape Town, 7441 • stay@edionroyal.co.za
        </div>
      </div>
    `;

    await sendEmail({
      to: guestEmail,
      subject: guestSubject,
      html: guestHtml
    });
  }
};

/**
 * Send notification when a general contact form message is received
 */
export const sendContactNotification = async (contactData) => {
  const adminEmail = process.env.NOTIFICATION_RECEIVER_EMAIL || process.env.SMTP_USER || 'stay@edionroyal.co.za';
  const name = contactData.name || 'Guest';
  const email = contactData.email || 'Not provided';
  const phone = contactData.phone || 'Not provided';
  const subject = contactData.subject || 'Website Contact Form';
  const message = contactData.message || '';

  const adminSubject = `📩 New Website Message: ${name} — ${subject}`;
  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background: #0f172a; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">EDION ROYAL GUESTHOUSE</h1>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">New Contact Inquiry</p>
      </div>

      <div style="padding: 24px 30px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 600; color: #475569; width: 120px;">From:</td><td style="padding: 8px 0; font-weight: 700; color: #0f172a;">${name}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 600; color: #475569;">Email:</td><td style="padding: 8px 0; color: #0284c7;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 600; color: #475569;">Phone:</td><td style="padding: 8px 0; color: #0f172a;">${phone}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 600; color: #475569;">Subject:</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${subject}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #475569; vertical-align: top;">Message:</td><td style="padding: 8px 0; color: #334155; line-height: 1.5;">${message}</td></tr>
        </table>
      </div>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: adminSubject,
    html: adminHtml
  });
};
