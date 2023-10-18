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
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const auth_1 = require('../utils/auth');
const user_1 = __importDefault(require('../models/user'));
const email_1 = __importDefault(require('../utils/email'));
const confirmation_1 = require('../utils/confirmation');
const cart_1 = __importDefault(require('../models/cart'));
// Register1 contains => (fullName, email, password)
const register1 = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, password, fullName } = req.body;
      // Perform validation checks on the request data
      if (!fullName || !email || !password) {
        return res.status(400).send({ error: 'Missing required fields' });
      }
      // Check if the email already exists in the database
      const existingUser = yield user_1.default.findOne({ email });
      if (existingUser && Object.keys(existingUser).length > 0) {
        return res.status(409).send({ error: 'User already exists' });
      }
      // Generate a hashed password using bcrypt
      const hashedPassword = yield bcrypt_1.default.hash(password, 10);
      // Create a new user instance using the User model
      const savedUser = yield user_1.default.create({
        fullName,
        email,
        password: hashedPassword,
      });
      // Save the new user to the database
      const userIdString = savedUser._id.toString();
      // Set the token as a cookie in the response
      (0, auth_1.setTokenCookie)({
        userId: userIdString,
        fullName: savedUser.fullName,
        email: savedUser.email,
        res,
      });
      req.user = savedUser;
      const subject = 'Email Verification';
      const apiUrl = process.env.API_URL;
      const confirmationToken = (0, confirmation_1.encrypt)(email);
      const link = `${apiUrl}/verify/${confirmationToken}`;
      yield (0, email_1.default)(email, subject, link, res);
      // Return the response
      return res.status(201).json({
        message: 'User successfully signed up',
        user: {
          id: savedUser._id,
          fullName: savedUser.fullName,
          email: savedUser.email,
        },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  });
const verifyEmail = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Get the confirmation token
      const { confirmationToken } = req.params;
      // Decrypt the username
      const email = (0, confirmation_1.decrypt)(confirmationToken);
      const user = yield user_1.default.findOne({ email });
      if (user) {
        // If there is anyone, mark them as confirmed account
        user.isConfirmed = true;
        yield user.save();
        // Return the created user data
        res
          .status(201)
          .json({ message: 'User verified successfully', data: user });
      } else {
        res.status(409).send('User Not Found');
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });
// completedRegister contains => (address,phone,role)
const completedRegister = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // const { address, phone, role } = req.body as Register2Request;
      const {
        phone,
        role,
        streetName,
        streetNumber,
        city,
        state,
        flatNumber,
        district,
        zip,
      } = req.body;
      const address = {
        streetName,
        streetNumber,
        state,
        city,
        flatNumber,
        district,
        zip,
      };
      const { authToken } = req.signedCookies;
      if (!phone || !address || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      if (role === 'admin') {
        return res.status(400).json({
          error: 'Cannot register as an admin during user registration.',
        });
      }
      // Extract user data from the authToken
      const decodedToken = jsonwebtoken_1.default.verify(
        authToken,
        process.env.SECRET_KEY
      );
      const { _id: userId } = decodedToken;
      // Find the user based on the user ID
      const user = yield user_1.default.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Add the address and phone to the user object
      user.address = address;
      user.phone = phone;
      user.role = role;
      user.isRegistrationComplete = true;
      // Save the updated user to the database
      yield user.save();
      // Clear the existing cookie
      res.clearCookie('authToken');
      // Set the new token as a cookie in the response
      (0, auth_1.setCompletedTokenCookie)({
        userId,
        role: user.role,
        fullName: user.fullName,
        res,
      });
      // Create the cart for the customer
      if (user.role === 'customer') {
        yield cart_1.default.create({ items: [], customerId: userId });
      }
      req.user = user;
      // Return the response
      return res.status(201).json({
        message: 'User information updated',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          address: user.address,
          phone: user.phone,
          isConfirmed: user.isConfirmed,
        },
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
const login = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, password } = req.body;
      // Perform validation checks on the request data
      if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      // Find the user based on the email
      const user = yield user_1.default.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ error: 'User not found, please register' });
      }
      const isSignedWithGoogleOrFacebook = user.providerId;
      if (isSignedWithGoogleOrFacebook) {
        return res.status(404).json({
          error: 'Use the appropriate method for login, Google or Facebook',
        });
      }
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = yield bcrypt_1.default.compare(
        password,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Generate a new token for the authenticated user
      const userIdString = user._id.toString();
      if (user.isRegistrationComplete) {
        (0, auth_1.setCompletedTokenCookie)({
          userId: userIdString,
          role: user.role,
          fullName: user.fullName,
          res,
        });
      } else {
        (0, auth_1.setTokenCookie)({
          userId: userIdString,
          fullName: user.fullName,
          email: user.email,
          res,
        });
      }
      // Store the user information in req.user
      req.user = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      };
      // Return the response
      return res.status(200).json({
        message: 'User successfully logged in',
        user: req.user,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
const logout = (req, res) => {
  try {
    // Clear the authToken cookie to log out the user
    res.clearCookie('authToken');
    res.clearCookie('authTokenCompleted');
    res.status(200).json({ message: 'User successfully logged out' });
  } catch (error) {
    res.send(error);
  }
};
exports.default = {
  register1,
  completedRegister,
  login,
  logout,
  verifyEmail,
};
