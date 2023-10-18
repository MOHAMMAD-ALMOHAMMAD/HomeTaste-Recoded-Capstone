'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const passwordReset_1 = __importDefault(
  require('../controllers/passwordReset')
);
const router = (0, express_1.Router)();
// Route to request a password reset
router.post(
  '/request-password-reset',
  passwordReset_1.default.requestPasswordReset
);
// Route to reset the password using the token
router.post('/reset-password', passwordReset_1.default.resetPassword);
exports.default = router;
