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
const mongoose_1 = __importDefault(require('mongoose'));
const cart_1 = __importDefault(require('../models/cart'));
const food_1 = __importDefault(require('../models/food'));
const getCart = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      /* req.user has the decoded payload from the JWT token, which contains the role,email, and the _id of the user ->
        so instead of casting req.user as IUser which would let req.user have all the properties of IUser ->
        we can cast req.user to the type "decodedPyaload", which uses the Pick type to only choose the properties from IUser that are in the decoded JWT payload. */
      const userId = req.user._id;
      const userCart = yield cart_1.default.findOne({ customerId: userId });
      return res.status(200).json(userCart);
    } catch (err) {
      return res.status(401).json(err);
    }
  });
const addDishToCart = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { dishId } = req.query;
    /* Makes sure the dish is in the Food collection first before proceeding
     Normally, the typescript compiler will complain if we used properties of the populated field directly
     To fix this issue, mongoose allows us to typecast the return value of the populate() method, in this case the type we want is IUser
     Check https://mongoosejs.com/docs/typescript/populate.html for more details. */
    try {
      const dishDoc = yield food_1.default
        .findById(dishId)
        .populate('cookerId');
      if (!dishDoc) {
        throw new Error('This Dish Doesnt Exist');
      }
      // Makes sure cookerStatus of the cook  making the dish is "active" before proceeding
      if (!(dishDoc.cookerId.cookerStatus === 'active')) {
        return res
          .status(400)
          .json(
            'This Cook Isnt Able To Receive Any Orders At The Moment, Please Try Again Later'
          );
      }
      const userId = req.user._id;
      // Find the user cart first
      const userCart = yield cart_1.default.findOne({ customerId: userId });
      if (!userCart) {
        throw new Error(
          'You dont have a cart yet because you didnt complete registration, please go do that first'
        );
      }
      // else if cart is found, and the the length of the items array is zero
      else if (
        !((_a = userCart.items) === null || _a === void 0 ? void 0 : _a.length)
      ) {
        // just add the item to the items array, no need to check if the item existed before or the if item was made by a different cook
        (_b = userCart.items) === null || _b === void 0
          ? void 0
          : _b.push({
              quantity: 1,
              dishId: new mongoose_1.default.Types.ObjectId(dishId),
            });
        yield userCart.save();
        return res
          .status(200)
          .json({ message: 'Dish Succesfully Added To Cart' });
      } else {
        // else, if length of userCart.items array is not zero, then there is atleast one item in the array
        // we need to check if the item with the given dishId is already in the cart or not first
        const isDishExists =
          (_c =
            userCart === null || userCart === void 0
              ? void 0
              : userCart.items) === null || _c === void 0
            ? void 0
            : _c.find((item) => item.dishId.toString() === dishId);
        if (isDishExists) {
          throw new Error('Dish Already Exists In Cart');
        }
        // else, we need to check if the dish was made by the same cook who made the other dishes in the userCart.items array
        // first we make an array that has all the current dishIds that are in the current cart + the dishId from the query params
        const dishIds = userCart.items.map((item) => item.dishId.toString());
        dishIds.push(dishId);
        const numberOfCooks = yield food_1.default
          .find({ _id: { $in: dishIds } })
          .distinct('cookerId');
        // if all the dishes (incuding the dish that is going to be added) had the same cookerId, then the number of distinct cookerIds must be 1
        if (numberOfCooks.length === 1) {
          (_d = userCart.items) === null || _d === void 0
            ? void 0
            : _d.push({
                quantity: 1,
                dishId: new mongoose_1.default.Types.ObjectId(dishId),
              });
          yield userCart.save();
          return res
            .status(200)
            .json({ message: 'Dish Succesfully Added To Cart' });
        }
        // if the number of distnct cookerIds were more more than one, then it means the dish that is to be added is made by a different cook
        return res
          .status(400)
          .json(
            'Cant Add Dishes Made By Different Cooks To The Cart, Only Dishes Made By The Same Cook Can Be Added'
          );
      }
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  });
const emptyCart = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const userId = req.user._id;
      const userCart = yield cart_1.default.findOne({ customerId: userId });
      if (!userCart) {
        throw new Error(
          'You dont have a cart yet because you didnt complete registration, please go do that first'
        );
      }
      // Make items an empty array to remove all the items that were in it;
      userCart.items = [];
      yield userCart.save();
      return res
        .status(200)
        .json('All Items In The Cart Have Been Succesfully Removed');
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });
const deleteItem = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const { dishId } = req.query;
    try {
      const userId = req.user._id;
      const userCart = yield cart_1.default.findOne({ customerId: userId });
      if (!userCart) {
        return res
          .status(404)
          .json(
            'You dont have a cart yet because you didnt complete registration, please go do that first'
          );
      }
      // check if item exists in cart first
      const isItemExist =
        (_e = userCart.items) === null || _e === void 0
          ? void 0
          : _e.find((item) => item.dishId.toString() === dishId);
      if (isItemExist) {
        // Since userCart.items is just a normal array, we can use all of the common array methods
        // By using Array.filter, we update userCart.items to be an array of items that doesn't contain the item that has the dishId from req.query
        userCart.items =
          (_f = userCart.items) === null || _f === void 0
            ? void 0
            : _f.filter((item) => item.dishId.toString() !== dishId);
        yield userCart.save();
        return res.status(204).json('Item Was Succesfully Deleted From Cart');
      }
      // if item doesn't exist, then return an error
      return res
        .status(404)
        .json('Dish with the given ID already doesnt exist in cart');
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });
const changeQuantity = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j;
    const { dishId, method } = req.query;
    try {
      const userId = req.user._id;
      // Search for cart first
      const userCart = yield cart_1.default.findOne({ customerId: userId });
      if (!userCart) {
        return res
          .status(404)
          .json(
            'You dont have a cart yet because you didnt complete registration, please go do that first'
          );
      }
      // check if item exists in cart first
      const isItemExist =
        (_g = userCart.items) === null || _g === void 0
          ? void 0
          : _g.find((item) => item.dishId.toString() === dishId);
      if (isItemExist && userCart.items) {
        // check the method query parameter if its increment or decrement
        if (method === 'increment') {
          const itemToBeUpdatedIndex =
            (_h = userCart.items) === null || _h === void 0
              ? void 0
              : _h.indexOf(isItemExist);
          userCart.items[itemToBeUpdatedIndex].quantity += 1;
          yield userCart.save();
        } else if (method === 'decrement') {
          const itemToBeUpdatedIndex =
            (_j = userCart.items) === null || _j === void 0
              ? void 0
              : _j.indexOf(isItemExist);
          userCart.items[itemToBeUpdatedIndex].quantity -= 1;
          yield userCart.save();
        }
        // if its not decrement or increment then throw an error
        else {
          throw new Error(
            "The method query string cant be any other value than 'increment' or 'decrement'"
          );
        }
        return res.status(201).json('Quantity Succesfully Updated');
      }
      // else if item doesnt exist in the cart
      return res
        .status(404)
        .json('Dish with the given ID doesnt exist in cart');
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });
exports.default = {
  getCart,
  addDishToCart,
  emptyCart,
  deleteItem,
  changeQuantity,
};
