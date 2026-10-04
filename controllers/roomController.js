import Room from '../models/Room.js';
import { uploadBufferToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by slug or ID
// @route   GET /api/rooms/:identifier
// @access  Public
export const getRoomByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let room = await Room.findOne({ slug: identifier });
    if (!room && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      room = await Room.findById(identifier);
    }

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a room (with optional Cloudinary image upload)
// @route   POST /api/rooms
// @access  Public (or Admin)
export const createRoom = async (req, res, next) => {
  try {
    const { slug, title, badge, description, features, pricePerNight, maxGuests, imageUrl } = req.body;

    if (!slug || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide slug, title, and description.'
      });
    }

    let finalImageUrl = imageUrl || '';
    const cloudinaryImages = [];

    // If an image file was uploaded via multer, upload it to Cloudinary
    if (req.file) {
      if (isCloudinaryConfigured()) {
        const result = await uploadBufferToCloudinary(req.file.buffer, 'edion_royal_guesthouse/rooms');
        finalImageUrl = result.secure_url;
        cloudinaryImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      } else {
        console.warn('[Cloudinary Warning] Upload requested but Cloudinary is not configured with valid API keys in .env');
      }
    }

    // Parse features if passed as JSON string or comma-separated string
    let parsedFeatures = [];
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = features.split(',').map((f) => f.trim()).filter(Boolean);
      }
    } else if (Array.isArray(features)) {
      parsedFeatures = features;
    }

    const room = await Room.create({
      slug,
      title,
      badge: badge || '',
      description,
      features: parsedFeatures,
      pricePerNight: pricePerNight ? Number(pricePerNight) : 0,
      maxGuests: maxGuests ? Number(maxGuests) : 2,
      imageUrl: finalImageUrl,
      cloudinaryImages
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Public (or Admin)
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Handle new Cloudinary upload if provided
    if (req.file && isCloudinaryConfigured()) {
      const result = await uploadBufferToCloudinary(req.file.buffer, 'edion_royal_guesthouse/rooms');
      req.body.imageUrl = result.secure_url;
      room.cloudinaryImages.push({
        url: result.secure_url,
        public_id: result.public_id
      });
    }

    // Parse features if string
    if (req.body.features && typeof req.body.features === 'string') {
      try {
        req.body.features = JSON.parse(req.body.features);
      } catch {
        req.body.features = req.body.features.split(',').map((f) => f.trim()).filter(Boolean);
      }
    }

    Object.assign(room, req.body);
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room (and its Cloudinary images if stored)
// @route   DELETE /api/rooms/:id
// @access  Public (or Admin)
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Clean up Cloudinary images if available
    if (room.cloudinaryImages && room.cloudinaryImages.length > 0 && isCloudinaryConfigured()) {
      for (const img of room.cloudinaryImages) {
        try {
          await deleteFromCloudinary(img.public_id);
        } catch (cErr) {
          console.error(`Failed to delete Cloudinary image: ${img.public_id}`, cErr.message);
        }
      }
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
