import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    badge: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    features: {
      type: [String],
      default: []
    },
    pricePerNight: {
      type: Number,
      default: 0
    },
    maxGuests: {
      type: Number,
      default: 2
    },
    imageUrl: {
      type: String,
      default: ''
    },
    // Array of Cloudinary uploaded images with public_id and secure URL
    cloudinaryImages: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
