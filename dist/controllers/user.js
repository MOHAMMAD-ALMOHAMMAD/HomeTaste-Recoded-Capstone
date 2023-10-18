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
const getUserProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Get the user information from the request
      const userReq = req.user;
      const user = yield user_1.default.findById({ _id: userReq._id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Create a userProfile object using data from the user document
      const profile = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        cookerStatus: user.cookerStatus,
        address: user.address,
        profileImage: user.profileImage,
      };
      return res.status(200).json({
        message: 'User retrieved successfully',
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
const updateUserProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const userReq = req.user;
      const {
        firstName,
        lastName,
        phone,
        cookerStatus,
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
      // Assigns the server path of the uploaded profile image to the 'profileImage' property in the request body (if available).
      req.body.profileImage =
        (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
      // Ckeck cooker status
      const cookStatus = userReq.role === 'customer' ? ' ' : cookerStatus;
      // Create an object to hold the updated fields
      const updatedFields = {
        firstName,
        lastName,
        phone,
        address,
        profileImage: req.body.profileImage,
        cookerStatus: cookStatus,
      };
      // Find the user by _id and update the specified fields
      const updatedUser = yield user_1.default.findOneAndUpdate(
        { _id: userReq._id },
        { $set: updatedFields },
        { new: true }
      );
      // If the user is not found, return a 404 error
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        message: 'Profile updated successfully!',
        data: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
exports.default = { getUserProfile, updateUserProfile };
