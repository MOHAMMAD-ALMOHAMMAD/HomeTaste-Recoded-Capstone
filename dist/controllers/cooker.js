'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
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
exports.updateOrderStatus =
  exports.updateDish =
  exports.deleteDish =
  exports.getDishes =
  exports.createDish =
    void 0;
const food_1 = __importDefault(require('../models/food'));
const user_1 = __importDefault(require('../models/user'));
const order_1 = __importStar(require('../models/order'));
const createDish = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const { cookerId } = req.params;
      const dishData = req.body;
      dishData.image =
        (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
      const user = yield user_1.default.findById(cookerId);
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
      if (user.role !== 'cooker') {
        return res.status(403).json({
          message: 'User is not a cooker',
        });
      }
      const food = yield food_1.default.create(
        Object.assign(Object.assign({}, dishData), { cookerId })
      );
      return res.status(201).json({
        message: 'Dish created successfully',
        data: {
          dish: food,
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: 'An error occurred while creating the dish',
        error: err,
      });
    }
  });
exports.createDish = createDish;
const deleteDish = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { cookerId, dishId } = req.params;
      const user = yield user_1.default.findById(cookerId);
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
      if (user.role !== 'cooker') {
        return res.status(403).json({
          message: 'User is not a cooker',
        });
      }
      const dish = yield food_1.default.findOne({ _id: dishId, cookerId });
      if (!dish) {
        return res.status(404).json({
          message: 'Dish not found',
        });
      }
      yield food_1.default.deleteOne({ _id: dishId });
      return res.status(200).json({
        message: 'Dish deleted successfully',
      });
    } catch (err) {
      return res.status(500).json({
        message: 'An error occurred while deleting the dish',
      });
    }
  });
exports.deleteDish = deleteDish;
const getDishes = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { cookerId } = req.params;
      const dishes = yield food_1.default.find({ cookerId });
      res.status(200).json({
        message: 'Dishes retrieved successfully',
        data: {
          dishes,
        },
      });
    } catch (err) {
      res.status(500).json({
        message: 'An error occurred while retrieving the dishes',
        error: err,
      });
    }
  });
exports.getDishes = getDishes;
const updateDish = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { cookerId, dishId } = req.params;
      const dishData = req.body;
      const user = yield user_1.default.findById(cookerId);
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
      if (user.role !== 'cooker') {
        return res.status(403).json({
          message: 'User is not a cooker',
        });
      }
      const dish = yield food_1.default.findOne({ _id: dishId, cookerId });
      if (!dish) {
        return res.status(404).json({
          message: 'Dish not found',
        });
      }
      yield food_1.default.updateOne({ _id: dishId }, { $set: dishData });
      return res.status(200).json({
        message: 'Dish updated successfully',
      });
    } catch (err) {
      return res.status(500).json({
        message: 'An error occurred while updating the dish',
        error: err,
      });
    }
  });
exports.updateDish = updateDish;
const updateOrderStatus = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, orderStatus } = req.query;
    try {
      const cookId = req.user._id;
      // check if the received order status from the query string is a valid OrderStatus type
      if (Object.values(order_1.OrderStatus).includes(orderStatus)) {
        // Finds the document that has the orderStatus as not "Delivered" or "Canceled" and has the appropiate orderId and cookId
        // This means that an order with a status of "Delivered" or "Canceled" cannot have its status be updated again
        const orderDoc = yield order_1.default.findOne({
          $and: [
            { _id: orderId },
            { cookerId: cookId },
            { orderStatus: { $nin: ['Delivered', 'Canceled'] } },
          ],
        });
        if (!orderDoc) {
          return res
            .status(404)
            .json(
              'Either The Order Was Not Found, Or The Order Status Of The To Be Updated Order Was Delivered or Canceled'
            );
        }
        orderDoc.orderStatus = orderStatus;
        orderDoc.save();
        return res
          .status(201)
          .json(`Order Status Succesfully Updated To ${orderStatus} `);
      }
      return res.status(400).json('Invalid Order Status Was Received');
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
exports.updateOrderStatus = updateOrderStatus;
