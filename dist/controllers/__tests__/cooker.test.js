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
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const supertest_1 = __importDefault(require('supertest'));
const dotenv_1 = __importDefault(require('dotenv'));
const cookie_signature_1 = __importDefault(require('cookie-signature'));
const app_1 = __importDefault(require('../../app'));
const food_1 = __importDefault(require('../../models/food'));
const user_1 = __importDefault(require('../../models/user'));
const connection_1 = require('../../db/connection');
const order_1 = __importDefault(require('../../models/order'));
dotenv_1.default.config();
beforeAll(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.connectToMongo)();
  })
);
afterEach(() => {
  jest.restoreAllMocks();
});
afterAll(
  () =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield (0, connection_1.closeDbConnection)();
      yield app_1.default.close();
    }),
  10000
);
const cookerId = '64c9ffd01853c9f2f69f7045';
const dishId = '64cb7503cf820c93b8b8e5f2';
const deleteObj = {};
const mockFood = [
  {
    _id: '60f7ea20b5d7c23d4c4d5f98',
    name: 'Pizza Margherita',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 10,
    image: 'https://example.com/pizza.jpg',
    categories: ['Pizza', 'Italian'],
    allergies: [],
  },
];
const mockDishes = [
  {
    _id: '60f7ea20b5d7c23d4c4d5f98',
    name: 'Pizza Margherita',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 10,
    image: 'https://example.com/pizza.jpg',
    categories: ['Pizza', 'Italian'],
    allergies: [],
  },
];
const updatedDish = {
  name: 'Pizza Margherita',
  description: 'Classic pizza with tomato sauce, mozzarella, and basil',
  price: 30,
  image: 'https://example.com/pizza.jpg',
  categories: ['Kumpir', 'Drinks'],
  allergies: ['Peanuts'],
};
const mockUpdateResult = {
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0,
  upsertedId: null,
};
const mockPendingOrder = {
  _id: '64ca51f6d860a0478ee0766e',
  cookerId,
  orderStatus: 'Pending',
  save: jest.fn(),
};
const mockToken = jsonwebtoken_1.default.sign(
  { _id: '64b9781dbee12ba0fe169821', role: 'customer' },
  process.env.SECRET_KEY
);
const mockCookToken = jsonwebtoken_1.default.sign(
  { _id: mockPendingOrder.cookerId, role: 'cooker' },
  process.env.SECRET_KEY
);
const signedToken = cookie_signature_1.default.sign(
  mockToken,
  process.env.SECRET_KEY
);
const signedCookToken = cookie_signature_1.default.sign(
  mockCookToken,
  process.env.SECRET_KEY
);
describe('Cooker API', () => {
  describe('GET /api/cooker/{cookerId}/dishes', () => {
    test('should return dishes for given cookerId', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(food_1.default, 'find').mockResolvedValueOnce(mockDishes);
        const response = yield (0, supertest_1.default)(app_1.default).get(
          `/api/cooker/${cookerId}/dishes`
        );
        expect(response.status).toBe(200);
        expect(response.body.data.dishes).toEqual(mockDishes);
      }));
    test('should return 500 if an error occurs while retrieving dishes', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest
          .spyOn(food_1.default, 'find')
          .mockRejectedValueOnce(new Error('Database error'));
        const response = yield (0, supertest_1.default)(app_1.default).get(
          `/api/cooker/${cookerId}/dishes`
        );
        expect(response.status).toBe(500);
        expect(response.body.message).toBe(
          'An error occurred while retrieving the dishes'
        );
      }));
  });
  describe('DELETE /api/cooker/{cookerId}/{dishId}', () => {
    test('should delete dish with given cookerId and dishId', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest
          .spyOn(user_1.default, 'findById')
          .mockResolvedValueOnce({ role: 'cooker' });
        jest.spyOn(food_1.default, 'findOne').mockResolvedValueOnce(mockFood);
        jest
          .spyOn(food_1.default, 'deleteOne')
          .mockResolvedValueOnce(deleteObj);
        const response = yield (0, supertest_1.default)(app_1.default)
          .delete(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Dish deleted successfully');
      }));
    test('should return 404 if user not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findById').mockResolvedValueOnce(null);
        const response = yield (0, supertest_1.default)(app_1.default)
          .delete(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
      }));
    test('should return 403 if user is not a cooker', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest
          .spyOn(user_1.default, 'findById')
          .mockResolvedValueOnce({ role: 'customer' });
        const response = yield (0, supertest_1.default)(app_1.default)
          .delete(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is not a cooker');
      }));
    test('should return 404 if dish not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest
          .spyOn(user_1.default, 'findById')
          .mockResolvedValueOnce({ role: 'cooker' });
        jest.spyOn(food_1.default, 'findOne').mockResolvedValueOnce(null);
        const response = yield (0, supertest_1.default)(app_1.default)
          .delete(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Dish not found');
      }));
    test('should return 500 if an error occurs while deleting dish', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest
          .spyOn(user_1.default, 'findById')
          .mockResolvedValueOnce({ role: 'cooker' });
        jest.spyOn(food_1.default, 'findOne').mockResolvedValueOnce(mockFood);
        jest
          .spyOn(food_1.default, 'deleteOne')
          .mockRejectedValueOnce(new Error('Database error'));
        const response = yield (0, supertest_1.default)(app_1.default)
          .delete(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe(
          'An error occurred while deleting the dish'
        );
      }));
  });
  describe('PUT /api/cooker/{cookerId}/{dishId}', () => {
    test('should update dish with given cookerId and dishId', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest
          .spyOn(user_1.default, 'findById')
          .mockResolvedValueOnce({ role: 'cooker' });
        jest
          .spyOn(food_1.default, 'findOne')
          .mockResolvedValueOnce({ _id: '64cb7503cf820c93b8b8e5f2' });
        jest
          .spyOn(food_1.default, 'updateOne')
          .mockResolvedValueOnce(mockUpdateResult);
        const response = yield (0, supertest_1.default)(app_1.default)
          .put(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
          .send(updatedDish);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Dish updated successfully');
      }));
    test('should return 403 if user is not a cooker', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest
          .spyOn(user_1.default, 'findById')
          .mockResolvedValueOnce({ role: 'customer' });
        const response = yield (0, supertest_1.default)(app_1.default)
          .put(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
          .send({});
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is not a cooker');
      }));
    test('should return 404 if user not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findById').mockResolvedValueOnce(null);
        const response = yield (0, supertest_1.default)(app_1.default)
          .put(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
          .send({});
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
      }));
    test('should return 404 if dish not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest
          .spyOn(user_1.default, 'findById')
          .mockResolvedValueOnce({ role: 'cooker' });
        jest.spyOn(food_1.default, 'findOne').mockResolvedValueOnce(null);
        const response = yield (0, supertest_1.default)(app_1.default)
          .put(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
          .send({});
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Dish not found');
      }));
    test('should return 500 if an error occurs while updating dish', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest
          .spyOn(user_1.default, 'findById')
          .mockResolvedValueOnce({ role: 'cooker' });
        jest
          .spyOn(food_1.default, 'findOne')
          .mockRejectedValueOnce(new Error('Database error'));
        const response = yield (0, supertest_1.default)(app_1.default)
          .put(`/api/cooker/${cookerId}/${dishId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
          .send({});
        expect(response.status).toBe(500);
        expect(response.body.message).toBe(
          'An error occurred while updating the dish'
        );
      }));
  });
  describe('POST /api/cooker/{cookerId}/dish', () => {
    const customerId = '64c9ffd01853c9f2f69f7045';
    const nonExistentUserId = '64c9ffd01853c9f2f69f7045';
    test(
      'should create a new dish for the given cookerId',
      () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const dishData = {
            name: 'Pizza Margherita',
            description:
              'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 10,
            image: 'example.com',
            categories: ['Pizza', 'Italian'],
            allergies: ['Gluten', 'Dairy'],
          };
          jest
            .spyOn(user_1.default, 'findById')
            .mockResolvedValueOnce({ role: 'cooker' });
          jest.spyOn(food_1.default, 'create').mockResolvedValueOnce(dishData);
          const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/cooker/${cookerId}/dish`)
            .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
            .field(dishData)
            .attach('image', 'test_imgs/food.png');
          expect(response.status).toBe(201);
          expect(response.body.message).toBe('Dish created successfully');
          expect(response.body.data.dish).toMatchObject(dishData);
        }),
      10000
    );
    test(
      'should return 403 if user is not a cooker',
      () =>
        __awaiter(void 0, void 0, void 0, function* () {
          jest
            .spyOn(user_1.default, 'findById')
            .mockResolvedValueOnce({ role: 'customer' });
          const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/cooker/${customerId}/dish`)
            .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
            .send({});
          expect(response.status).toBe(403);
          expect(response.body.message).toBe('User is not a cooker');
        }),
      10000
    );
    test(
      'should return 404 if user not found',
      () =>
        __awaiter(void 0, void 0, void 0, function* () {
          jest.spyOn(user_1.default, 'findById').mockResolvedValueOnce(null);
          const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/cooker/${nonExistentUserId}/dish`)
            .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
            .send({});
          expect(response.status).toBe(404);
          expect(response.body.message).toBe('User not found');
        }),
      10000
    );
  });
  describe('PATCH /cooker/orders/changeStatus', () => {
    it('Should Update The Order Status Succesfully', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const orderSpy = jest
          .spyOn(order_1.default, 'findOne')
          .mockReturnValueOnce(mockPendingOrder);
        const res = yield (0, supertest_1.default)(app_1.default)
          .patch('/api/cooker/orders/changeStatus')
          .query({
            orderId: mockPendingOrder._id,
            orderStatus: mockPendingOrder.orderStatus,
          })
          .set('Cookie', [`authTokenCompleted=s%3A${signedCookToken}`]);
        expect(orderSpy).toBeCalledTimes(1);
        expect(res.status).toBe(201);
        expect(res.body).toBe(
          `Order Status Succesfully Updated To ${mockPendingOrder.orderStatus} `
        );
      }));
  });
});
