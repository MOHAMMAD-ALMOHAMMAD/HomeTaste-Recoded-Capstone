'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const isAuth_1 = require('../middlewares/isAuth');
const order_1 = __importDefault(require('../controllers/order'));
const router = express_1.default.Router();
router.get(
  '/',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('customer'),
  order_1.default.getOrders
);
router.post(
  '/create',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('customer'),
  order_1.default.createOrder
);
router.put(
  '/:orderId/cancel',
  isAuth_1.isAuthenticated,
  (0, isAuth_1.checkRole)('customer'),
  order_1.default.cancelOrder
);
exports.default = router;
