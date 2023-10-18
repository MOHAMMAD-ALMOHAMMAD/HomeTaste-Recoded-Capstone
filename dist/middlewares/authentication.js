'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.preventMultiLogin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const authenticate = (req, res, next) => {
  try {
    const { authTokenCompleted } = req.signedCookies;
    if (!authTokenCompleted) {
      res.redirect(301, '/');
    }
    const verified = jsonwebtoken_1.default.verify(
      authTokenCompleted,
      String(process.env.SECRET_KEY)
    );
    if (typeof verified === 'object' && 'role' in verified) {
      req.userCookie = {
        role: verified === null || verified === void 0 ? void 0 : verified.role,
      };
    }
    next();
  } catch (err) {
    res.redirect(301, '/');
  }
};
exports.authenticate = authenticate;
const preventMultiLogin = (req, res, next) => {
  const { authTokenCompleted } = req.cookies;
  if (authTokenCompleted) {
    res.redirect(301, '/');
  }
  next();
};
exports.preventMultiLogin = preventMultiLogin;
