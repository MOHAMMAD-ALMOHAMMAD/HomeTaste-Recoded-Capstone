'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const isAuth_1 = require('../middlewares/isAuth');
const cart_1 = __importDefault(require('../controllers/cart'));
const router = express_1.default.Router();
router.get(
  '/',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('customer'),
  cart_1.default.getCart
);
router.post(
  '/',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('customer'),
  cart_1.default.addDishToCart
);
router.get(
  '/deleteAll',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('customer'),
  cart_1.default.emptyCart
);
router.delete(
  '/',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('customer'),
  cart_1.default.deleteItem
);
router.put(
  '/',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('customer'),
  cart_1.default.changeQuantity
);
exports.default = router;
