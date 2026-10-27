import express from 'express';
import path from 'path';
import fs from 'fs';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { uploadSingleImage } from '../middleware/upload.js';
import { uploadBufferToCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import Room from '../models/Room.js';

const router = express.Router();

// In-memory or database media items
const uploadedMedia = [
  {
    key: 'media-01',
    name: 'Guesthouse Hero 1',
    url: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096036/edion_royal_guesthouse/backgrounds/hero_custom_798129955.jpg',
    category: 'hero',
    createdAt: new Date().toISOString()
  },
  {
    key: 'media-02',
    name: 'Estate Exterior',
    url: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096037/edion_royal_guesthouse/backgrounds/hero_estate_513927625.jpg',
    category: 'hero',
    createdAt: new Date().toISOString()
  },
  {
    key: 'media-03',
    name: 'Ambient 3D View',
    url: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096038/edion_royal_guesthouse/backgrounds/hero_surreal_798153808.jpg',
    category: 'hero',
    createdAt: new Date().toISOString()
  },
  {
    key: 'media-04',
    name: 'Location Map Banner',
    url: 'https://res.cloudinary.com/ps3hwvnw/image/upload/v1793096039/edion_royal_guesthouse/backgrounds/bg_location.jpg',
    category: 'location',
    createdAt: new Date().toISOString()
  }
];

// GET /api/media
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    const roomMedia = [];
    rooms.forEach(r => {
      if (r.imageUrl) {
        roomMedia.push({
          key: 'room-' + r._id,
          name: r.title,
          url: r.imageUrl,
          category: 'rooms',
          createdAt: r.createdAt
        });
      }
    });

    const allMedia = [...uploadedMedia, ...roomMedia];
    res.status(200).json({
      success: true,
      data: allMedia
    });
  } catch (err) {
    res.status(200).json({
      success: true,
      data: uploadedMedia
    });
  }
});

// POST /api/media/upload
router.post('/upload', uploadSingleImage, async (req, res) => {
  try {
    let finalUrl = '';
    const originalName = req.file?.originalname || 'Uploaded Image';

    if (req.file && req.file.buffer) {
      // 1. Try Cloudinary if configured
      if (isCloudinaryConfigured()) {
        try {
          const folder = req.body.category ? `edion_royal_guesthouse/${req.body.category}` : 'edion_royal_guesthouse';
          const cloudRes = await uploadBufferToCloudinary(req.file.buffer, folder);
          if (cloudRes && cloudRes.secure_url) {
            finalUrl = cloudRes.secure_url;
          }
        } catch (cloudErr) {
          console.warn('[Cloudinary Warning] Upload to Cloudinary failed, falling back to local storage:', cloudErr.message);
        }
      }

      // 2. Fallback to local storage if Cloudinary wasn't configured or threw an error
      if (!finalUrl) {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const ext = path.extname(originalName) || '.jpg';
        const filename = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, req.file.buffer);
        const host = req.get('host') || 'localhost:5001';
        const protocol = req.protocol || 'http';
        finalUrl = `${protocol}://${host}/uploads/${filename}`;
      }

      const item = {
        key: 'media-' + Date.now(),
        name: originalName,
        url: finalUrl,
        category: req.body.category || 'general',
        createdAt: new Date().toISOString()
      };
      uploadedMedia.unshift(item);
      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: item
      });
    }

    if (req.body && req.body.url) {
      const item = {
        key: 'media-' + Date.now(),
        name: req.body.name || 'Direct Image',
        url: req.body.url,
        category: req.body.category || 'general',
        createdAt: new Date().toISOString()
      };
      uploadedMedia.unshift(item);
      return res.status(200).json({
        success: true,
        data: item
      });
    }

    res.status(400).json({ success: false, message: 'No file or image URL provided' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/media/:key
router.delete('/:key', (req, res) => {
  const { key } = req.params;
  const idx = uploadedMedia.findIndex(m => m.key === key);
  if (idx !== -1) {
    uploadedMedia.splice(idx, 1);
  }
  res.status(200).json({ success: true, message: 'Media removed' });
});

export default router;
