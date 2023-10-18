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
const mongoose_1 = require('mongoose');
const food_1 = __importDefault(require('./food'));
const cartSchema = new mongoose_1.Schema({
  items: {
    type: [
      {
        quantity: { type: Number, min: [1, 'Quantity Must Atleast Be 1'] },
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
    default: 0,
  },
  customerId: {
    type: mongoose_1.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User',
  },
});
// A Document middleware to calculate the total price of the items in the cart before each save hook
cartSchema.pre('save', function calculateTotalPrice(next) {
  var _a;
  return __awaiter(this, void 0, void 0, function* () {
    // if items array is empty, then by default totalPrice is 0, if items array is not empty then totalPrice will be updated inside the if condition
    this.totalPrice = 0;
    if ((_a = this.items) === null || _a === void 0 ? void 0 : _a.length) {
      // Get all the dishIds from the items array
      const dishIds = this.items.map((item) => item.dishId);
      try {
        // Fetch all the dishes using the dishIds
        const dishes = yield food_1.default.find({ _id: { $in: dishIds } });
        // Calculate totalPrice based on the fetched dishes
        let totalPrice = 0;
        totalPrice = this.items.reduce((total, item) => {
          const dish = dishes.find((dishDoc) =>
            dishDoc._id.equals(item.dishId)
          );
          if (dish) {
            return total + dish.price * item.quantity;
          }
          return total;
        }, 0);
        // Update the totalPrice property in this instance of the cart document
        this.totalPrice = totalPrice;
      } catch (error) {
        // Handle any errors that occurred during the fetch
        throw new Error(error);
      }
    }
    // Call the next middleware or save the document if there are no items
    next();
  });
});
const Cart = (0, mongoose_1.model)('Cart', cartSchema);
exports.default = Cart;
