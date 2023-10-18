'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.checkRole = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
// Middleware function to check if a user is authenticated by verifying the JWT token from the signed cookie.
const isAuthenticated = (req, res, next) => {
  const { authTokenCompleted } = req.signedCookies;
  if (!authTokenCompleted) {
    return res.status(401).json({ message: 'No token, Unauthorized.' });
  }
  try {
    const decoded = jsonwebtoken_1.default.verify(
      authTokenCompleted,
      String(process.env.SECRET_KEY)
    );
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid/expired token.' });
  }
};
exports.isAuthenticated = isAuthenticated;
const checkRole = (requiredRole) => (req, res, next) => {
  // Assuming you have already implemented an isAuthenticated middleware to check if the user is authenticated
  const userReq = req.user;
  if (!userReq) {
    return res.status(401).json({ message: 'No token, Unauthorized.' });
  }
  // Check if the user's role matches the required role
  if (userReq.role !== requiredRole) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // If the user has the required role, proceed to the next middleware/controller
  return next();
};
exports.checkRole = checkRole;
