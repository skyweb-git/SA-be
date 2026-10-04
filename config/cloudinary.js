import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const api_key = (process.env.CLOUDINARY_API_KEY || '').trim();
const api_secret = (process.env.CLOUDINARY_API_SECRET || '').trim();

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true
});

/**
 * Check if Cloudinary credentials are set up
 */
export const isCloudinaryConfigured = () => {
  return Boolean(
    cloud_name &&
    cloud_name !== 'your_cloud_name' &&
    api_key &&
    api_key !== 'your_api_key' &&
    api_secret &&
    api_secret !== 'your_api_secret'
  );
};

/**
 * Upload a file buffer directly to Cloudinary using a readable stream
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} folder - Folder name in Cloudinary
 * @param {object} customOptions - Extra Cloudinary upload options
 * @returns {Promise<object>} Result from Cloudinary (secure_url, public_id, etc.)
 */
export const uploadBufferToCloudinary = (buffer, folder = 'edion_royal_guesthouse', customOptions = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        ...customOptions
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete an asset from Cloudinary
 * @param {string} publicId - The public ID of the asset
 */
export const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
