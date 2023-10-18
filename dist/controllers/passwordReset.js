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
const bcrypt_1 = __importDefault(require('bcrypt'));
const user_1 = __importDefault(require('../models/user'));
const passwordResetToken_1 = __importDefault(
  require('../models/passwordResetToken')
);
const confirmation_1 = require('../utils/confirmation');
const email_1 = __importDefault(require('../utils/email'));
const sendPasswordResetEmail = (email, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const resetToken = (0, confirmation_1.generateResetToken)();
    const apiUrl = process.env.API_URL;
    const subject = 'Password Reset';
    const link = `${apiUrl}/reset-password/${resetToken}`;
    yield (0, email_1.default)(email, subject, link, res);
  });
const requestPasswordReset = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email } = req.body;
      const user = yield user_1.default.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Generate reset token and store it in the database
      const resetToken = (0, confirmation_1.generateResetToken)();
      const expirationTime = Date.now() + 3600000; // 1 hour expiration time
      const passwordResetToken = new passwordResetToken_1.default({
        userId: user._id,
        token: resetToken,
        expiresAt: expirationTime,
      });
      yield passwordResetToken.save();
      yield sendPasswordResetEmail(email, res);
      return res.json({ message: 'Password reset email sent' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
// Controller to reset the password using the token
const resetPassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { token, password } = req.body;
      const passwordResetToken = yield passwordResetToken_1.default.findOne({
        token,
      });
      if (
        !passwordResetToken ||
        passwordResetToken.expiresAt.getTime() < Date.now()
      ) {
        return res
          .status(400)
          .json({ error: 'Invalid or expired reset token' });
      }
      // Find the corresponding user using the userId stored in the passwordResetToken
      const user = yield user_1.default.findById(passwordResetToken.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Generate a hashed password using bcrypt
      const hashedPassword = yield bcrypt_1.default.hash(password, 10);
      // Update the user's password and save
      user.password = hashedPassword;
      yield user.save();
      // Delete the used passwordResetToken from the database
      yield passwordResetToken_1.default.deleteOne({
        _id: passwordResetToken._id,
      });
      return res.json({ message: 'Password reset successful' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
exports.default = {
  requestPasswordReset,
  sendPasswordResetEmail,
  resetPassword,
};
