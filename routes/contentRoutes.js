import express from 'express';
import {
  getContent,
  updateContent,
  resetContent
} from '../controllers/contentController.js';

const router = express.Router();

router.route('/')
  .get(getContent)
  .put(updateContent);

router.post('/reset', resetContent);

export default router;
