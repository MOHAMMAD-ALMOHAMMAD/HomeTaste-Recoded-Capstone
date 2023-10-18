'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ReviewSchema = void 0;
const mongoose_1 = require('mongoose');
exports.ReviewSchema = new mongoose_1.Schema({
  rating: Number,
  comment: String,
  customerId: {
    type: mongoose_1.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  dishId: {
    type: mongoose_1.Schema.Types.ObjectId,
    required: true,
    ref: 'Food',
  },
  orderId: {
    type: mongoose_1.Schema.Types.ObjectId,
    required: true,
    ref: 'Order',
  },
});
// makes sure each review record has a comment and/or rating, we cant have a review without both a rating AND a comment
exports.ReviewSchema.pre('save', function checkReviewComment(next) {
  return this.rating && this.comment
    ? next()
    : 'cant save a review without a comment and/or rating';
});
const Review = (0, mongoose_1.model)('Review', exports.ReviewSchema);
exports.default = Review;
