'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const passport_1 = __importDefault(require('../config/passport'));
const authentication_1 = require('../middlewares/authentication');
const auth_1 = __importDefault(require('../controllers/auth'));
const google_1 = __importDefault(require('../controllers/google'));
const facebook_1 = __importDefault(require('../controllers/facebook'));
const router = express_1.default.Router();
router.post('/register1', auth_1.default.register1);
router.post('/register2', auth_1.default.completedRegister);
router.post('/login', auth_1.default.login);
router.get('/logout', auth_1.default.logout);
router.get('/verify/:confirmationToken', auth_1.default.verifyEmail);
router.get('/register1', (req, res) => {
  res.render('register1');
});
router.get('/register2', (req, res) => {
  res.render('register2');
});
router.get('/login', (req, res) => {
  res.render('login');
});
/**
 * Initiates the Google authentication process.
 * Redirects the user to the Google authentication page.
 */
router.get(
  '/google',
  authentication_1.preventMultiLogin,
  passport_1.default.authenticate('google', {
    scope: ['openid', 'email', 'profile'],
  })
);
/**
 * Callback route for Google authentication.
 * Handles the authentication callback from Google after successful authentication.
 * If authentication fails, redirects the user back to the Google authentication page.
 * If authentication succeeds, saves the user data and generates a JSON Web Token (JWT).
 */
router.get(
  '/google/callback',
  authentication_1.preventMultiLogin,
  passport_1.default.authenticate('google', {
    failureRedirect: '/api/auth/google',
    session: false,
  }),
  google_1.default
);
router.get('/facebook', facebook_1.default.fBAuthenticate);
router.get(
  '/facebook/callback',
  facebook_1.default.fbCallBackAuthenticate,
  facebook_1.default.afterFbCallback
);
router.get('/facebook/failure', facebook_1.default.fBAuthFailure);
router.get('/facebook/success', facebook_1.default.fbAuthSuccess);
exports.default = router;
