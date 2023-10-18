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
const supertest_1 = __importDefault(require('supertest'));
const dotenv_1 = __importDefault(require('dotenv'));
const app_1 = __importDefault(require('../../app'));
const food_1 = __importDefault(require('../../models/food'));
const connection_1 = require('../../db/connection');
dotenv_1.default.config();
beforeAll(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.connectToMongo)();
  })
);
afterAll(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.closeDbConnection)();
    yield app_1.default.close();
  })
);
const foodId = '60f7ea20b5d7c23d4c4d5f98';
const mockFood = {
  _id: foodId,
  name: 'Pizza Margherita',
  description: 'Classic pizza with tomato sauce, mozzarella, and basil',
  price: 10,
  image: 'https://example.com/pizza.jpg',
  categories: ['Pizza', 'Italian'],
  allergies: [],
};
describe('Food API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('GET /api/foods/{foodId}', () => {
    test('should return food item with given ID', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(food_1.default, 'findById').mockResolvedValueOnce(mockFood);
        const response = yield (0, supertest_1.default)(app_1.default).get(
          `/api/foods/${foodId}`
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockFood);
      }));
    test('should return 404 if food item not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(food_1.default, 'findById').mockResolvedValueOnce(null);
        const response = yield (0, supertest_1.default)(app_1.default).get(
          `/api/foods/${foodId}`
        );
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Food not found');
      }));
  });
  describe('GET /api/foods', () => {
    test('should return all food items if no filters specified', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const mockFoods = [
          {
            _id: '60f7ea20b5d7c23d4c4d5f98',
            name: 'Pizza Margherita',
            description:
              'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 10,
            image: 'https://example.com/pizza.jpg',
            categories: ['Pizza', 'Italian'],
            allergies: [],
          },
          {
            _id: '60f7ea20b5d7c23d4c4d5f99',
            name: 'Doner Kebab',
            description:
              'Delicious doner kebab with fresh vegetables and sauce',
            price: 8,
            image: 'https://example.com/doner.jpg',
            categories: ['Doner', 'Turkish'],
            allergies: ['Gluten'],
          },
        ];
        jest.spyOn(food_1.default, 'find').mockResolvedValueOnce(mockFoods);
        const response = yield (0, supertest_1.default)(app_1.default).get(
          '/api/foods'
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockFoods);
      }));
    test('should return filtered food items if filters specified', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const mockFoods = [
          {
            _id: '60f7ea20b5d7c23d4c4d5f98',
            name: 'Pizza Margherita',
            description:
              'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 10,
            image: 'https://example.com/pizza.jpg',
            categories: ['Pizza', 'Italian'],
            allergies: [],
          },
        ];
        jest.spyOn(food_1.default, 'find').mockResolvedValueOnce(mockFoods);
        const response = yield (0, supertest_1.default)(app_1.default)
          .get('/api/foods')
          .query({ categories: 'Pizza,Italian' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockFoods);
      }));
  });
});
