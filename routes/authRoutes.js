import express from 'express';
import {
  login,
  verifyOtp,
  resendOtp,
  requestPasscodeResetOtp,
  verifyPasscodeReset,
  requestEmailChangeOtp,
  verifyEmailChange,
  sendVerificationCode
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.all('/send-code', sendVerificationCode);
router.post('/request-passcode-reset-otp', requestPasscodeResetOtp);
router.post('/verify-passcode-reset', verifyPasscodeReset);
router.post('/request-email-change-otp', requestEmailChangeOtp);
router.post('/verify-email-change', verifyEmailChange);

export default router;
