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
exports.getFoodFilter = exports.getFoodById = void 0;
const food_1 = __importDefault(require('../models/food'));
const getFoodById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { foodId } = req.params;
      const food = yield food_1.default.findById(foodId);
      if (!food) {
        return res.status(404).json({ message: 'Food not found' });
      }
      return res.json(food);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  });
exports.getFoodById = getFoodById;
const getFoodFilter = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { categories } = req.query;
      const { allergies } = req.query;
      const query = {};
      if (categories) {
        query.categories = { $in: categories.split(',') };
      }
      if (allergies) {
        query.allergies = { $nin: allergies.split(',') };
      }
      const foods = yield food_1.default.find(query);
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });
exports.getFoodFilter = getFoodFilter;
