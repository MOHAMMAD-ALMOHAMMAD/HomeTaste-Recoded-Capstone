'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.orderSchema = exports.OrderStatus = void 0;
const mongoose_1 = require('mongoose');
const user_1 = require('./user');
// wrting On_The_Way as "On The Way" gives an eslint error, which is why its written like this here
var OrderStatus;
(function (OrderStatus) {
  OrderStatus['Pending'] = 'Pending';
  OrderStatus['Approved'] = 'Approved';
  OrderStatus['Preparing'] = 'Preparing';
  OrderStatus['On_The_Way'] = 'On The Way';
  OrderStatus['Delivered'] = 'Delivered';
  OrderStatus['Canceled'] = 'Canceled';
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
exports.orderSchema = new mongoose_1.Schema({
  orderDetails: {
    type: [
      {
        quantity: {
          type: Number,
          min: [1, 'Quantity Must Atleast Be 1'],
          required: true,
        },
        dishId: {
          type: mongoose_1.Schema.Types.ObjectId,
          ref: 'Food',
          required: true,
        },
      },
    ],
  },
  totalPrice: {
    type: Number,
  },
  orderStatus: {
    type: String,
    default: OrderStatus.Pending,
    enum: Object.values(OrderStatus),
    required: true,
  },
  customer: user_1.UserSchema,
  cookerId: {
    type: mongoose_1.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
const Order = (0, mongoose_1.model)('Order', exports.orderSchema);
exports.default = Order;
