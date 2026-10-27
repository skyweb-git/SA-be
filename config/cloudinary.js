import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

let cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
let api_key = (process.env.CLOUDINARY_API_KEY || '').trim();
let api_secret = (process.env.CLOUDINARY_API_SECRET || '').trim();

// Support parsing from CLOUDINARY_URL (cloudinary://api_key:api_secret@cloud_name) if individual variables are unset
if ((!cloud_name || !api_key || !api_secret) && process.env.CLOUDINARY_URL) {
  const match = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/([^:]+):([^@]+)@([^\/\s]+)/);
  if (match) {
    api_key = api_key || match[1];
    api_secret = api_secret || match[2];
    cloud_name = cloud_name || match[3];
  }
}

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
