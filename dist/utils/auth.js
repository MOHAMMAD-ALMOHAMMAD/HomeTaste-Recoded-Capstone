'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.setCompletedTokenCookie = exports.setTokenCookie = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const setTokenCookie = ({ userId, fullName, email, res }) => {
  const payload = {
    _id: userId,
    fullName,
    email,
  };
  const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14 days',
  });
  res === null || res === void 0
    ? void 0
    : res.cookie('authToken', token, {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        secure: false,
        // We should add them when we are going to deploy our app
        // secure: process.env.DEPLOYED === 'yes',
        // sameSite: 'none',
      });
  return token;
};
exports.setTokenCookie = setTokenCookie;
const setCompletedTokenCookie = ({ userId, role, fullName, email, res }) => {
  const payload = {
    _id: userId,
    fullName,
    role,
    email,
  };
  const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14 days',
  });
  res === null || res === void 0
    ? void 0
    : res.cookie('authTokenCompleted', token, {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        secure: false,
        // We should add them when we are going to deploy our app
        // secure: process.env.DEPLOYED === 'yes',
        // sameSite: 'none',
      });
  return token;
};
exports.setCompletedTokenCookie = setCompletedTokenCookie;
