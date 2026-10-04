import express from 'express';
import { submitContact, getContacts } from '../controllers/contactController.js';

const router = express.Router();

router.route('/')
  .post(submitContact)
  .get(getContacts);

export default router;
