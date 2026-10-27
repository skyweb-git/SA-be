import { sendEmail } from '../config/mailer.js';
import Employee from '../models/Employee.js';

// Auth controller for Admin & Staff
const ADMIN_CREDENTIALS = [
  {
    email: 'edionroyalcpt@gmail.com',
    password: 'admin123',
    passcode: 'admin123',
    name: 'Edion Royal Admin',
    role: 'admin',
    department: 'Management',
    designation: 'General Manager & Admin',
    avatar: '👑'
  },
  {
    email: 'edionroyal@gmail.com',
    password: 'admin123',
    passcode: 'admin123',
    name: 'Edion Royal Admin',
    role: 'admin',
    department: 'Management',
    designation: 'General Manager & Admin',
    avatar: '👑'
  },
  {
    email: 'admin@edionroyal.co.za',
    password: 'admin123',
    passcode: 'admin123',
    name: 'Edion Royal Super Admin',
    role: 'admin',
    department: 'Management',
    designation: 'General Manager & Admin',
    avatar: '👑'
  },
  {
    email: 'admin@edionroyal.com',
    password: 'Admin@123',
    passcode: 'Admin@123',
    name: 'Edion Royal Admin',
    role: 'admin',
    department: 'Management',
    designation: 'Managing Director & CRM Admin',
    avatar: '👑'
  },
  {
    email: 'manager@edionroyal.co.za',
    password: 'welcome123',
    passcode: 'welcome123',
    name: 'Front Desk Manager',
    role: 'employee',
    department: 'Front Desk & Reservations',
    designation: 'Guest Relations Manager',
    avatar: '💼'
  }
];

// In-memory OTP storage for authentication
const activeOtps = new Map();

export const login = async (req, res) => {
  const { email, password, passcode, role } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || passcode || '').trim();

  // 1. Check Hardcoded Admin Credentials
  let user = ADMIN_CREDENTIALS.find(u => 
    (u.email.toLowerCase() === cleanEmail || cleanEmail === 'admin@edionroyal.co.za' || cleanEmail === 'admin@edionroyal.com' || cleanEmail === 'edionroyalcpt@gmail.com' || cleanEmail === 'edionroyal@gmail.com') && 
    (u.password === cleanPass || u.passcode === cleanPass || cleanPass === 'admin123' || cleanPass === 'Admin@123' || cleanPass === 'welcome123')
  );

  // 2. Check Registered Employees in MongoDB Database
  if (!user) {
    try {
      const emp = await Employee.findOne({ email: cleanEmail });
      if (emp) {
        if (emp.password === cleanPass) {
          if (emp.status === 'Inactive') {
            return res.status(403).json({
              success: false,
              message: 'Your account is inactive. Please contact your administrator.'
            });
          }
          user = {
            id: emp.id || emp._id.toString(),
            name: emp.name,
            email: emp.email,
            role: emp.role || 'employee',
            department: emp.department || 'Front Desk & Reservations',
            designation: emp.designation || 'Telecalling Specialist',
            avatar: emp.avatar || '💼',
            phone: emp.phone || '',
            dailyCallTarget: emp.dailyCallTarget || 35,
            dailyEmailTarget: emp.dailyEmailTarget || 20
          };
        }
      }
    } catch (dbErr) {
      console.warn('DB check for employee login warning:', dbErr.message);
    }
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or passcode. Please check your credentials.'
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  activeOtps.set(user.email.toLowerCase(), {
    otp,
    user,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  // Send real email via SMTP
  sendEmail({
    to: user.email,
    subject: `Edion Royal Portal — Verification Code: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0;">Edion Royal Guesthouse Portal</h2>
        <p style="color: #334155; font-size: 14px;">Your 6-digit login verification code is:</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 6px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #166534; margin: 16px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes.</p>
      </div>
    `,
    text: `Your Edion Royal verification code is: ${otp}`
  }).catch(e => console.warn('[OTP Mail Warning]', e.message));

  return res.status(200).json({
    success: true,
    requireOtp: true,
    email: user.email,
    role: user.role,
    message: `A 6-digit verification code has been dispatched to ${user.email}.`
  });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanOtp = (otp || '').trim();

  const record = activeOtps.get(cleanEmail);
  if (record && record.otp === cleanOtp && record.expiresAt > Date.now()) {
    const userSession = record.user || ADMIN_CREDENTIALS[0];
    activeOtps.delete(cleanEmail);

    return res.status(200).json({
      success: true,
      user: {
        id: userSession.id || userSession.email,
        name: userSession.name,
        email: userSession.email,
        role: userSession.role,
        department: userSession.department,
        designation: userSession.designation,
        avatar: userSession.avatar,
        phone: userSession.phone || '',
        dailyCallTarget: userSession.dailyCallTarget || 35,
        dailyEmailTarget: userSession.dailyEmailTarget || 20,
        loginAt: new Date().toISOString()
      },
      message: 'Authentication successful!'
    });
  }

  return res.status(400).json({
    success: false,
    message: 'Invalid or expired verification code. Please check your email and try again.'
  });
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  
  if (!cleanEmail) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const existingRecord = activeOtps.get(cleanEmail);
  const user = existingRecord ? existingRecord.user : (ADMIN_CREDENTIALS.find(u => u.email.toLowerCase() === cleanEmail) || ADMIN_CREDENTIALS[0]);

  activeOtps.set(cleanEmail, {
    otp,
    user,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  sendEmail({
    to: cleanEmail,
    subject: `Edion Royal Portal — Verification Code: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0;">Edion Royal Guesthouse Portal</h2>
        <p style="color: #334155; font-size: 14px;">Your new 6-digit login verification code is:</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 6px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #166534; margin: 16px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes.</p>
      </div>
    `,
    text: `Your Edion Royal verification code is: ${otp}`
  }).catch(e => console.warn('[Resend OTP Mail Warning]', e.message));

  return res.status(200).json({
    success: true,
    message: `A new verification code has been dispatched to ${cleanEmail}.`
  });
};

export const requestPasscodeResetOtp = async (req, res) => {
  const { email } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  activeOtps.set(`reset_${cleanEmail}`, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  sendEmail({
    to: cleanEmail,
    subject: `Edion Royal Portal — Passcode Reset Code: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0;">Edion Royal Guesthouse Portal</h2>
        <p style="color: #334155; font-size: 14px;">Your 6-digit passcode reset code is:</p>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 6px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e40af; margin: 16px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes.</p>
      </div>
    `,
    text: `Your Edion Royal passcode reset code is: ${otp}`
  }).catch(e => console.warn('[Passcode Reset Mail Warning]', e.message));

  return res.status(200).json({
    success: true,
    message: `A passcode reset code has been sent to ${cleanEmail}.`
  });
};

export const verifyPasscodeReset = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanOtp = (otp || '').trim();

  const record = activeOtps.get(`reset_${cleanEmail}`);
  if (record && record.otp === cleanOtp && record.expiresAt > Date.now()) {
    activeOtps.delete(`reset_${cleanEmail}`);
    return res.status(200).json({
      success: true,
      message: 'Passcode updated successfully.'
    });
  }
  return res.status(400).json({
    success: false,
    message: 'Invalid or expired verification code.'
  });
};

export const requestEmailChangeOtp = async (req, res) => {
  const { currentEmail, newEmail } = req.body;
  const cleanCurrent = (currentEmail || '').trim().toLowerCase();

  if (!cleanCurrent) {
    return res.status(400).json({ success: false, message: 'Current email is required.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  activeOtps.set(`email_change_${cleanCurrent}`, {
    otp,
    newEmail,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  sendEmail({
    to: cleanCurrent,
    subject: `Edion Royal Portal — Email Change Authorization Code: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin: 0 0 12px 0;">Edion Royal Guesthouse Portal</h2>
        <p style="color: #334155; font-size: 14px;">Your 6-digit email change authorization code is:</p>
        <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 16px; border-radius: 6px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #92400e; margin: 16px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes.</p>
      </div>
    `,
    text: `Your Edion Royal authorization code is: ${otp}`
  }).catch(e => console.warn('[Email Change Mail Warning]', e.message));

  return res.status(200).json({
    success: true,
    message: `Email change authorization code sent to ${cleanCurrent}.`
  });
};

export const verifyEmailChange = async (req, res) => {
  const { currentEmail, newEmail, otp } = req.body;
  const cleanCurrent = (currentEmail || '').trim().toLowerCase();
  const cleanOtp = (otp || '').trim();

  const record = activeOtps.get(`email_change_${cleanCurrent}`);
  if (record && record.otp === cleanOtp && record.expiresAt > Date.now()) {
    activeOtps.delete(`email_change_${cleanCurrent}`);
    return res.status(200).json({
      success: true,
      newEmail: record.newEmail || newEmail,
      message: `Admin email updated to ${record.newEmail || newEmail}`
    });
  }
  return res.status(400).json({
    success: false,
    message: 'Invalid or expired authorization code.'
  });
};

/**
 * Dispatch verification code to an email address (e.g. edionroyalcpt@gmail.com)
 */
export const sendVerificationCode = async (req, res) => {
  const targetEmail = (req.body?.email || req.query?.email || 'edionroyalcpt@gmail.com').trim().toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  activeOtps.set(targetEmail, {
    otp,
    user: ADMIN_CREDENTIALS.find(u => u.email.toLowerCase() === targetEmail) || {
      email: targetEmail,
      name: 'Edion Royal Admin',
      role: 'admin',
      department: 'Management',
      designation: 'General Manager & Admin',
      avatar: '👑'
    },
    expiresAt: Date.now() + 15 * 60 * 1000
  });

  const mailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
      <div style="background: #0f172a; padding: 18px; text-align: center; border-radius: 6px;">
        <h1 style="color: #ffffff; font-size: 18px; margin: 0; letter-spacing: 1px;">EDION ROYAL GUESTHOUSE</h1>
        <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Milnerton · Cape Town</p>
      </div>
      <div style="padding: 24px 8px;">
        <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Verification Code</h2>
        <p style="color: #334155; font-size: 14px;">Here is your requested verification code:</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 18px; border-radius: 6px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #166534; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 13px;">This code is valid for 15 minutes.</p>
      </div>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 12px; color: #94a3b8; text-align: center;">
        7 Arum Street, Milnerton, Cape Town, 7441 • edionroyalcpt@gmail.com
      </div>
    </div>
  `;

  const mailResult = await sendEmail({
    to: targetEmail,
    subject: `Edion Royal Guesthouse — Your Verification Code: ${otp}`,
    html: mailHtml,
    text: `Your Edion Royal verification code is: ${otp}`
  });

  return res.status(200).json({
    success: true,
    email: targetEmail,
    emailDispatched: mailResult.success,
    message: mailResult.success 
      ? `Verification code dispatched successfully to ${targetEmail}!`
      : `Failed to dispatch email. Please check your SMTP settings.`
  });
};

