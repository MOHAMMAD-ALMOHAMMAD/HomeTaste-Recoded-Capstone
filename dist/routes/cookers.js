'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const multer_1 = __importDefault(require('multer'));
const multer_storage_cloudinary_1 = require('multer-storage-cloudinary');
const cloudinary_1 = require('cloudinary');
const cooker_1 = require('../controllers/cooker');
const isAuth_1 = require('../middlewares/isAuth');
cloudinary_1.v2.config({
  cloud_name: process.env.STORAGE_NAME,
  api_key: process.env.STORAGE_API_KEY,
  api_secret: process.env.STORAGE_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
  cloudinary: cloudinary_1.v2,
  params: () => ({ folder: 'food-image' }),
});
const parser = (0, multer_1.default)({ storage });
const cookerRouter = express_1.default.Router();
cookerRouter.post(
  '/:cookerId/dish',
  parser.single('image'),
  isAuth_1.isAuthenticated,
  cooker_1.createDish
);
cookerRouter.put(
  '/:cookerId/:dishId',
  isAuth_1.isAuthenticated,
  cooker_1.updateDish
);
cookerRouter.delete(
  '/:cookerId/:dishId',
  isAuth_1.isAuthenticated,
  cooker_1.deleteDish
);
cookerRouter.get('/:cookerId/dishes', cooker_1.getDishes);
cookerRouter.patch(
  '/orders/changeStatus',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('cooker'),
  cooker_1.updateOrderStatus
);
exports.default = cookerRouter;
