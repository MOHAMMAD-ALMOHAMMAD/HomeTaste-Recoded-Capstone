'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const food_1 = require('../controllers/food');
const foodRouter = express_1.default.Router();
foodRouter.get('/:foodId', food_1.getFoodById);
foodRouter.get('/', food_1.getFoodFilter);
exports.default = foodRouter;
