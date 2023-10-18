'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const cloudinary_1 = require('cloudinary');
const multer_storage_cloudinary_1 = require('multer-storage-cloudinary');
/*
The provided code sets up a Cloudinary configuration and creates a Cloudinary storage instance
for handling user profile images with Multer Middleware.
*/
cloudinary_1.v2.config({
  cloud_name: process.env.STORAGE_NAME,
  api_key: process.env.STORAGE_API_KEY,
  api_secret: process.env.STORAGE_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
  cloudinary: cloudinary_1.v2,
  params: () => ({ folder: 'user-profiles' }),
});
exports.default = storage;
