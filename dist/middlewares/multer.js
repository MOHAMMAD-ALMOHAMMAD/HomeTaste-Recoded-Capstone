'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.upload = exports.fileSizeLimitErrorHandler = void 0;
const multer_1 = __importDefault(require('multer'));
const cloudinary_1 = __importDefault(require('../config/cloudinary'));
// Error handling middleware for file size limit
const fileSizeLimitErrorHandler = (err, req, res, next) => {
  // If the error is a MulterError
  if (err instanceof multer_1.default.MulterError) {
    res.status(413).json({ error: 'The image size exceeds 5 MB limit' });
  }
  // If there is a different type of error => Invalid file type
  else if (err) {
    res.status(400).json({ error: err.message });
  } else {
    next();
  }
};
exports.fileSizeLimitErrorHandler = fileSizeLimitErrorHandler;
// Multer configuration for file upload
exports.upload = (0, multer_1.default)({
  storage: cloudinary_1.default,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB in bytes
  },
  // Define a file filter to allow only 'image/' MIME types
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});
