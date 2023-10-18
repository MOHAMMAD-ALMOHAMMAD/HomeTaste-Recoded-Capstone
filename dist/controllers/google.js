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
const user_1 = __importDefault(require('../models/user'));
const auth_1 = require('../utils/auth');
const saveGoogle = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userReq = req.user;
      const googleId = `google-${userReq._json.sub}`;
      const user = yield user_1.default.findOne({ providerId: googleId });
      // User does not exist with Google authentication
      if (!user) {
        const existingUserWithEmail = yield user_1.default.findOne({
          email: userReq._json.email,
        });
        // Create a new user with Google authentication if user does not exist with the same email address
        if (!existingUserWithEmail) {
          const newUser = yield user_1.default.create({
            firstName: userReq._json.given_name,
            lastName: userReq._json.family_name,
            email: userReq._json.email,
            providerId: googleId,
            isConfirmed: true,
          });
          // Set authToken
          (0, auth_1.setTokenCookie)({
            userId: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            res,
          });
          res.status(200).json({
            message: 'User successfully signed in',
            user: {
              id: newUser._id,
              fullName: newUser.fullName,
              email: newUser.email,
            },
          });
        } else if (existingUserWithEmail.providerId) {
          res.status(400).send({
            error:
              'User already exists with Facebook. Please sign in with your Facebook account.',
          });
        } else {
          res.status(400).send({
            error:
              'User already exists with Email and Password. Please sign in with your registered email and password.',
          });
        }
      } else if (user.isRegistrationComplete) {
        // If the user's registration is complete (logged in Google authentication)
        // Generate a new token for the authenticated user and set it as the authTokenCompleted
        const userIdString = user._id.toString();
        (0, auth_1.setCompletedTokenCookie)({
          userId: userIdString,
          role: user.role,
          fullName: user.fullName,
          res,
        });
        // Store the user information in req.user
        req.user = {
          id: user._id,
          fullName: user.fullName,
          role: user.role,
        };
        // Return the response
        res.status(200).json({
          message: 'User successfully logged in',
          user: req.user,
        });
      } else {
        // If the user's registration is not complete
        // Generate a new token for the authenticated user and set it as the authToken
        const userIdString = user._id.toString();
        (0, auth_1.setTokenCookie)({
          userId: userIdString,
          fullName: user.fullName,
          email: user.email,
          res,
        });
        // Store the user information in req.user
        req.user = {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        };
        res.status(200).json({
          message: 'User successfully logged in',
          user: req.user,
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
exports.default = saveGoogle;
