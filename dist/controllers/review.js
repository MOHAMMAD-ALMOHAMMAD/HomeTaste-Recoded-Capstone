'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getReviews = exports.postReview = void 0;
const review_1 = __importDefault(require('../models/review'));
const postReview = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { foodId } = req.params;
      const { rating, comment, customerId, orderId } = req.body;
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: 'Rating must be between 1 and 5' });
      }
      const review = new review_1.default({
        rating,
        comment,
        customerId,
        dishId: foodId,
        orderId,
      });
      yield review.save();
      return res
        .status(201)
        .json({ message: 'Review created successfully', review });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  });
exports.postReview = postReview;
const getReviews = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { foodId } = req.params;
      const reviews = yield review_1.default.find({ dishId: foodId });
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });
exports.getReviews = getReviews;
