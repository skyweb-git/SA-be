import express from 'express';
import { uploadImage, uploadMultiple, deleteImage } from '../controllers/uploadController.js';
import { uploadSingleImage, uploadMultipleImages } from '../middleware/upload.js';

const router = express.Router();

// POST /api/upload - Single image upload to Cloudinary (form field name: 'image')
router.post('/', uploadSingleImage, uploadImage);

// POST /api/upload/multiple - Multiple images upload to Cloudinary (form field name: 'images')
router.post('/multiple', uploadMultipleImages, uploadMultiple);

// DELETE /api/upload/:public_id - Remove image from Cloudinary
router.delete('/:public_id', deleteImage);

export default router;
