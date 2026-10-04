import path from 'path';
import fs from 'fs';
import { uploadBufferToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

// @desc    Upload single image to Cloudinary (with local fallback)
// @route   POST /api/upload
// @access  Public
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided in request.'
      });
    }

    const folder = req.body.folder || 'edion_royal_guesthouse';
    let url = '';
    let public_id = '';

    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadBufferToCloudinary(req.file.buffer, folder);
        if (result && result.secure_url) {
          url = result.secure_url;
          public_id = result.public_id;
          return res.status(200).json({
            success: true,
            message: 'Image uploaded successfully to Cloudinary',
            data: {
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes
            }
          });
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload error, using local fallback:', cloudErr.message);
      }
    }

    // Local fallback
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = path.extname(req.file.originalname || '') || '.jpg';
    const filename = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), req.file.buffer);
    const host = req.get('host') || 'localhost:5001';
    const protocol = req.protocol || 'http';
    url = `${protocol}://${host}/uploads/${filename}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to local storage',
      data: {
        url,
        public_id: filename
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload/multiple
// @access  Public
export const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided in request.'
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env'
      });
    }

    const folder = req.body.folder || 'edion_royal_guesthouse';
    const uploadPromises = req.files.map((file) => uploadBufferToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    const uploadedData = results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    }));

    res.status(200).json({
      success: true,
      count: uploadedData.length,
      message: 'Images uploaded successfully to Cloudinary',
      data: uploadedData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:public_id
// @access  Public
export const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.params;

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary is not configured in backend/.env'
      });
    }

    const result = await deleteFromCloudinary(public_id);

    res.status(200).json({
      success: true,
      message: 'Cloudinary asset deleted',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
