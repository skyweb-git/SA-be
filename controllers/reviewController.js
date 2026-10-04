import Review from '../models/Review.js';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a new guest review
// @route   POST /api/reviews
// @access  Public
export const createReview = async (req, res, next) => {
  try {
    const { name, location, rating, quote, initials } = req.body;

    if (!name || !quote) {
      return res.status(400).json({
        success: false,
        message: 'Name and review content/quote are required.'
      });
    }

    const review = await Review.create({
      name,
      location: location || '',
      rating: rating ? Number(rating) : 5,
      quote,
      initials: initials || ''
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your review! It has been recorded.',
      data: review
    });
  } catch (error) {
    next(error);
  }
};
