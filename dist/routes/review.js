'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const review_1 = require('../controllers/review');
const isAuth_1 = require('../middlewares/isAuth');
const reviewRouter = express_1.default.Router();
reviewRouter.post('/:foodId', isAuth_1.isAuthenticated, review_1.postReview);
reviewRouter.get('/:foodId', review_1.getReviews);
exports.default = reviewRouter;
