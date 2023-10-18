'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const user_1 = __importDefault(require('../controllers/user'));
const multer_1 = require('../middlewares/multer');
const isAuth_1 = require('../middlewares/isAuth');
const router = express_1.default.Router();
router.get('/profile', isAuth_1.isAuthenticated, user_1.default.getUserProfile);
router.patch(
  '/profile/edit',
  isAuth_1.isAuthenticated,
  (req, res, next) => {
    // Adding error handling for multer upload
    multer_1.upload.single('profileImage')(req, res, (err) => {
      (0, multer_1.fileSizeLimitErrorHandler)(err, req, res, next);
    });
  },
  user_1.default.updateUserProfile
);
exports.default = router;
