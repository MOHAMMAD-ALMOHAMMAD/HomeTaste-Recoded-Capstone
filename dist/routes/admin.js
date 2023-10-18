'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const admin_1 = __importDefault(require('../controllers/admin'));
const isAuth_1 = require('../middlewares/isAuth');
const router = express_1.default.Router();
router.get(
  '/cooker',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('admin'),
  admin_1.default.getCooker
);
router.get(
  '/customers',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('admin'),
  admin_1.default.getCustomers
);
exports.default = router;
