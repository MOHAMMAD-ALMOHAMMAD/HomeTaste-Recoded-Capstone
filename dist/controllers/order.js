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
const order_1 = __importStar(require('../models/order'));
const user_1 = __importDefault(require('../models/user'));
const cart_1 = __importDefault(require('../models/cart'));
const food_1 = __importDefault(require('../models/food'));
const getOrders = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Get the user object from the request
      const customerReq = req.user;
      const customer = yield user_1.default.findById({ _id: customerReq._id });
      if (!customer) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Find all orders associated with the user
      const orders = yield order_1.default.find({
        'customer._id': customer._id,
      });
      if (!orders || orders.length === 0) {
        return res
          .status(404)
          .json({ message: 'No orders found for this user' });
      }
      // Format the orders data to make the response more concise and readable
      const formattedOrders = orders.map((order) => ({
        _id: order._id,
        orderDetails: order.orderDetails,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
        customer: {
          _id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        },
        cookerId: order.cookerId,
      }));
      return res.status(200).json({
        message: ' Orders successfully retrieved',
        data: formattedOrders,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
const createOrder = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const customerReq = req.user;
      // Find the user associated with the authenticated user ID
      const customer = yield user_1.default.findById(customerReq._id);
      if (!customer) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Find the user's cart in the database
      const cart = yield cart_1.default.findOne({ customerId: customer._id });
      if (!cart) {
        return res.status(404).json({ message: 'No cart found for this user' });
      }
      // Check if the cart has at least one item
      if (!cart.items || cart.items.length === 0) {
        return res.status(404).json({ error: 'Cart is empty' });
      }
      // Get the first item in the cart
      const firstCartItem = cart.items[0];
      // Check if the first item has a dishId
      if (!firstCartItem || !firstCartItem.dishId) {
        return res
          .status(404)
          .json({ error: 'No dishId found in the first item of the cart' });
      }
      // Extract the dishId from the first item in the cart
      const dishId = firstCartItem.dishId.toString();
      const food = yield food_1.default.findById({ _id: dishId });
      if (!food) {
        return res.status(404).json({ error: 'Food item not found' });
      }
      const cookerId =
        food === null || food === void 0 ? void 0 : food.cookerId;
      const newOrder = yield order_1.default.create({
        orderDetails: cart.items,
        totalPrice: cart.totalPrice,
        customer,
        cookerId,
      });
      // Clear the cart items after the order is successfully created
      cart.set({ items: [] });
      yield cart.save();
      return res
        .status(200)
        .json({ message: 'Order created successfully', data: newOrder });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
const cancelOrder = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { orderId } = req.params;
      const customerReq = req.user;
      const customer = yield user_1.default.findById({ _id: customerReq._id });
      if (!customer) {
        return res.status(404).json({ message: 'User not found' });
      }
      const order = yield order_1.default.findById({ _id: orderId });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      if (
        order.orderStatus === order_1.OrderStatus.Canceled ||
        order.orderStatus === order_1.OrderStatus.Delivered
      ) {
        return res.status(400).json({
          error: 'You can not cancele order when its Delivered or Canceled',
        });
      }
      order.orderStatus = order_1.OrderStatus.Canceled;
      yield order.save();
      // Format the orders data to make the response more concise and readable
      const formattedOrder = {
        _id: order._id,
        orderDetails: order.orderDetails,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
        customer: {
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
          email: order.customer.email,
          phone: order.customer.phone,
          address: order.customer.address,
        },
        cookerId: order.cookerId,
      };
      return res
        .status(200)
        .json({ message: 'Order canceled successfully', data: formattedOrder });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
exports.default = { createOrder, getOrders, cancelOrder };
