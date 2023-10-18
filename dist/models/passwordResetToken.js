'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = require('mongoose');
const passwordResetTokenSchema = new mongoose_1.Schema({
  userId: {
    type: mongoose_1.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
const PasswordResetToken = (0, mongoose_1.model)(
  'PasswordResetToken',
  passwordResetTokenSchema
);
exports.default = PasswordResetToken;
