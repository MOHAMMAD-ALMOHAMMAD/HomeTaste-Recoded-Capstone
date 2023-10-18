'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const auth_1 = __importDefault(require('./auth'));
const users_1 = __importDefault(require('./users'));
const review_1 = __importDefault(require('./review'));
const passwordReset_1 = __importDefault(require('./passwordReset'));
const foods_1 = __importDefault(require('./foods'));
const cookers_1 = __importDefault(require('./cookers'));
const cart_1 = __importDefault(require('./cart'));
const orders_1 = __importDefault(require('./orders'));
const admin_1 = __importDefault(require('./admin'));
const router = express_1.default.Router();
router.use('/auth', auth_1.default);
router.use('/auth', passwordReset_1.default);
router.use('/users', users_1.default);
router.use('/foods', foods_1.default);
router.use('/cooker', cookers_1.default);
router.use('/cart', cart_1.default);
router.use('/review', review_1.default);
router.use('/orders', orders_1.default);
router.use('/admin', admin_1.default);
exports.default = router;
