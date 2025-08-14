const cloudinary = require('cloudinary').v2; // Cloudinary SDK
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Multer storage engine for Cloudinary

// Configure Cloudinary using environment variables (from .env)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',           // Cloudinary folder to store uploads
    allowedFormats: ["png", "jpg", "jpeg"] // Accepted file formats
    // you can add transformation options here if needed
  },
});

module.exports = {
    cloudinary,
    storage
}
