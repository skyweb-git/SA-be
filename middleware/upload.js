import multer from 'multer';

// Use memory storage so we can stream directly to Cloudinary without creating temp files on disk
const storage = multer.memoryStorage();

// File filter to ensure only image files are allowed
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max per file
  },
  fileFilter
});

export const uploadSingleImage = upload.single('image');
export const uploadMultipleImages = upload.array('images', 8);

export default upload;
