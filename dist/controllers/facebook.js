'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const dotenv_1 = __importDefault(require('dotenv'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const passport_1 = __importDefault(require('../config/passport'));
const auth_1 = require('../utils/auth');
dotenv_1.default.config();
// Facebook Authentication Controller Class That Containes All The Routes
class FacebookAuthController {}
FacebookAuthController.fBAuthenticate = passport_1.default.authenticate(
  'facebook',
  {
    scope: ['public_profile', 'email'],
  }
);
FacebookAuthController.fbCallBackAuthenticate = passport_1.default.authenticate(
  'facebook',
  {
    session: false,
    failureRedirect: `${process.env.BASE_URL}/api/auth/facebook/failure`,
  }
);
FacebookAuthController.afterFbCallback = (req, res) => {
  const token = req.user;
  const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
  if ('role' in verified) {
    (0, auth_1.setCompletedTokenCookie)({
      userId: verified._id,
      fullName: verified.fullName,
      role: verified.role,
      email: verified.email,
      res,
    });
  } else {
    (0, auth_1.setTokenCookie)({
      userId: verified._id,
      fullName: verified.fullName,
      email: verified.email,
      res,
    });
  }
  res.redirect(`${process.env.BASE_URL}/api/auth/facebook/success`);
};
FacebookAuthController.fBAuthFailure = (req, res) => {
  res.json('facebook auth failed,please try again');
};
FacebookAuthController.fbAuthSuccess = (req, res) => {
  res.json('facebook auth is successful');
};
exports.default = FacebookAuthController;
