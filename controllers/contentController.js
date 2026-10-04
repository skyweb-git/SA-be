import Content from '../models/Content.js';
import { DEFAULT_GUESTHOUSE_CONTENT } from '../config/defaultContent.js';

// @desc    Get website CMS content
// @route   GET /api/content
// @access  Public
export const getContent = async (req, res, next) => {
  try {
    let doc = await Content.findOne({ key: 'website_content' });
    if (!doc) {
      doc = await Content.create({
        key: 'website_content',
        data: DEFAULT_GUESTHOUSE_CONTENT
      });
    }

    res.status(200).json({
      success: true,
      data: doc.data
    });
  } catch (error) {
    // If DB fails or is offline, return fallback
    res.status(200).json({
      success: true,
      data: DEFAULT_GUESTHOUSE_CONTENT,
      fallback: true
    });
  }
};

// @desc    Save/Update website CMS content
// @route   PUT /api/content
// @access  Public / Admin
export const updateContent = async (req, res, next) => {
  try {
    const updatedData = req.body;

    const doc = await Content.findOneAndUpdate(
      { key: 'website_content' },
      { data: updatedData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Website content updated successfully',
      data: doc.data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset website content to factory defaults
// @route   POST /api/content/reset
// @access  Public / Admin
export const resetContent = async (req, res, next) => {
  try {
    const doc = await Content.findOneAndUpdate(
      { key: 'website_content' },
      { data: DEFAULT_GUESTHOUSE_CONTENT },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Website content reset to defaults',
      data: doc.data
    });
  } catch (error) {
    next(error);
  }
};
