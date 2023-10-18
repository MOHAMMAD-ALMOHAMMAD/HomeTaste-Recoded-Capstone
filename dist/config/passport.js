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
const passport_1 = __importDefault(require('passport'));
const passport_google_oauth20_1 = __importDefault(
  require('passport-google-oauth20')
);
const passport_facebook_1 = __importDefault(require('passport-facebook'));
const dotenv_1 = __importDefault(require('dotenv'));
const user_1 = __importDefault(require('../models/user'));
const auth_1 = require('../utils/auth');
dotenv_1.default.config();
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BASE_URL,
  CLIENT_ID_FB,
  CLIENT_SECRET_FB,
} = process.env;
// Configure Passport to use Google Strategy for authentication.
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
passport_1.default.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, cb) =>
      __awaiter(void 0, void 0, void 0, function* () {
        try {
          // Call the callback with the user profile data
          cb(null, profile);
        } catch (error) {
          cb(null, error);
        }
      })
  )
);
// Configure Passport to use Facebook Strategy for authentication.
const FacebookStrategy = passport_facebook_1.default.Strategy;
passport_1.default.use(
  new FacebookStrategy(
    {
      clientID: CLIENT_ID_FB,
      clientSecret: CLIENT_SECRET_FB,
      callbackURL: `${BASE_URL}/api/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'email', 'name'],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) =>
      __awaiter(void 0, void 0, void 0, function* () {
        try {
          const existingUser = yield user_1.default.findOne({
            providerId: profile.id,
          });
          // Check if user has a facebook provider id
          if (existingUser) {
            let newToken;
            // Check if user completed /register2
            if (existingUser.isRegistrationComplete) {
              newToken = (0, auth_1.setCompletedTokenCookie)({
                userId: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                role: existingUser.role,
              });
            } else {
              newToken = (0, auth_1.setTokenCookie)({
                userId: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
              });
            }
            return done(null, newToken);
          }
          // if a user doesnt have a facebook provider id, check the email info from the profile
          const existingEmailUser = yield user_1.default.findOne({
            email: profile._json.email,
          });
          // if user exists with this email, the login attempt will be unsuccesful
          if (existingEmailUser) {
            return done(null, false);
          }
          // Else, create a new user and make a new token for them.
          let createdUser = null;
          if (profile && profile.name) {
            createdUser = yield user_1.default.create({
              email: profile._json.email,
              providerId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              profileImage: `https://graph.facebook.com/${profile.id}/picture?type=large`,
              isConfirmed: true,
            });
          }
          if (!createdUser) {
            throw new Error(
              'Cant make a new account due to a database issue, please try again later'
            );
          }
          const token = (0, auth_1.setTokenCookie)({
            userId: createdUser._id,
            fullName: createdUser.fullName,
            email: createdUser.email,
          });
          return done(null, token);
        } catch (err) {
          return done(err);
        }
      })
  )
);
exports.default = passport_1.default;
