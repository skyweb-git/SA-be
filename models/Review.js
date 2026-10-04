import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true
    },
    location: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5.0
    },
    initials: {
      type: String,
      default: ''
    },
    quote: {
      type: String,
      required: [true, 'Review quote/content is required'],
      trim: true
    },
    approved: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate initials if not provided
reviewSchema.pre('save', function (next) {
  if (!this.initials && this.name) {
    const parts = this.name.trim().split(' ');
    if (parts.length >= 2) {
      this.initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else {
      this.initials = parts[0].substring(0, 2).toUpperCase();
    }
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
