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
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const cookie_signature_1 = __importDefault(require('cookie-signature'));
const app_1 = __importDefault(require('../../app'));
const order_1 = __importDefault(require('../../models/order'));
const user_1 = __importDefault(require('../../models/user'));
const cart_1 = __importDefault(require('../../models/cart'));
const food_1 = __importDefault(require('../../models/food'));
const connection_1 = require('../../db/connection');
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
// To create a token
const mockToken = jsonwebtoken_1.default.sign(
  { _id: '64b9781dbee12ba0fe169821', role: 'customer' },
  process.env.SECRET_KEY
);
const signedToken = cookie_signature_1.default.sign(
  mockToken,
  process.env.SECRET_KEY
);
// Set the authentication token to an empty string or any invalid value
const invalidToken = cookie_signature_1.default.sign(mockToken, 'abc');
const mockUser = {
  _id: '64b9781dbee12ba0fe169821',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '05340718124',
  address: {
    city: 'Test City',
    country: 'Test Country',
  },
};
const userSpy = jest
  .spyOn(user_1.default, 'findById')
  .mockResolvedValue(mockUser);
const mockOrder = {
  _id: '64b9781dbee12ba0fe169877',
  orderDetails: [
    {
      quantity: 1,
      dishId: '64b9781dbee12ba0fe169888',
    },
  ],
  totalPrice: 10,
  orderStatus: 'Pending',
  customer: mockUser,
  cookerId: '64b9781dbee12ba0fe169899',
};
const orderSpy = jest
  .spyOn(order_1.default, 'find')
  .mockResolvedValue([mockOrder]);
describe('Order Routes', () => {
  afterEach(() => {
    orderSpy.mockReset();
    userSpy.mockReset();
  });
  describe('Get /api/orders/', () => {
    it('should return a 200 with user orders in formatted response', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/orders')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(' Orders successfully retrieved');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data).toEqual([mockOrder]);
        expect(orderSpy).toHaveBeenCalledTimes(1);
        expect(userSpy).toHaveBeenCalledTimes(1);
      }));
    it('should return a 404 error if the user is not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        orderSpy.mockRejectedValueOnce([null]);
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/orders')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
        expect(userSpy).toHaveBeenCalledTimes(1);
      }));
    it('should return a 401 error if user is not authenticated', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/orders')
          .set('Cookie', [`authTokenCompleted=s%3A${invalidToken}`]);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No token, Unauthorized.');
        expect(user_1.default.findById).not.toHaveBeenCalled();
      }));
  });
  describe('Put /api/orders/:id/cancel', () => {
    it('should return a 200 and update the order status to be canceled', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdateOrder = {
          _id: mockOrder._id,
          orderDetails: [
            {
              quantity: 1,
              dishId: '64b9781dbee12ba0fe169888',
            },
          ],
          totalPrice: 10,
          orderStatus: 'Pending',
          customer: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            address: {
              city: 'Test City',
              country: 'Test Country',
            },
          },
          cookerId: '64b9781dbee12ba0fe169899',
          save: jest.fn(),
        };
        const userFindByIdMock = jest.spyOn(user_1.default, 'findById');
        userFindByIdMock.mockResolvedValue({ _id: '64b9781dbee12ba0fe169821' });
        const orderFindAndUpdateMock = jest.spyOn(order_1.default, 'findById');
        orderFindAndUpdateMock.mockResolvedValue(mockUpdateOrder);
        const res = yield (0, supertest_1.default)(app_1.default)
          .put(`/api/orders/64b9781dbee12ba0fe169877/cancel`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Order canceled successfully');
        expect(JSON.stringify(res.body.data)).toEqual(
          JSON.stringify(mockUpdateOrder)
        );
        expect(userFindByIdMock).toHaveBeenCalledTimes(1);
        expect(orderFindAndUpdateMock).toHaveBeenCalledTimes(1);
      }));
    it('should return a 404 error  if user is not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findById').mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
          .put(`/api/orders/64b9781dbee12ba0fe169877/cancel`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
      }));
    it('should return a 401 error if user is not authenticated', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .put(`/api/orders/64b9781dbee12ba0fe169877/cancel`)
          .set('Cookie', [`authTokenCompleted=s%3A${invalidToken}`]);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No token, Unauthorized.');
        expect(user_1.default.findById).not.toHaveBeenCalled();
      }));
  });
  describe('Post /api/orders/create', () => {
    it('should return a 200 and create a new order successfully', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const mockUserToCreateOrder = {
          _id: '64b9781dbee12ba0fe169821',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '05340718124',
          address: {
            city: 'Test City',
            country: 'Test Country',
          },
        };
        const mockFood = {
          _id: '64ca2f92892c25849663e947',
          cookerId: '64c9ffd01853c9f2f69f7045',
          price: 5,
        };
        const mockCart = {
          _id: '64b9781dbee12ba0fe169823',
          items: [{ quantity: 2, dishId: '64ca2f92892c25849663e947' }],
          totalPrice: 10,
          save: jest.fn(),
          set: jest.fn(),
        };
        const findUserSpy = jest
          .spyOn(user_1.default, 'findById')
          .mockResolvedValue(mockUserToCreateOrder);
        const findCartSpy = jest
          .spyOn(cart_1.default, 'findOne')
          .mockResolvedValue(mockCart);
        const findFoodSpy = jest
          .spyOn(food_1.default, 'findById')
          .mockResolvedValue(mockFood);
        const newOrder = {
          _id: '64b9781dbee12ba0fe169877',
          orderDetails: [
            {
              quantity: 1,
              dishId: '64b9781dbee12ba0fe169888',
            },
          ],
          totalPrice: 10,
          orderStatus: 'Pending',
          customer: mockUserToCreateOrder,
          cookerId: '64b9781dbee12ba0fe169899',
        };
        jest.spyOn(order_1.default, 'create').mockResolvedValue(newOrder);
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/orders/create')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(findCartSpy).toBeCalledTimes(1);
        expect(findFoodSpy).toBeCalledTimes(1);
        expect(findUserSpy).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Order created successfully');
        expect(res.body.data).toEqual(newOrder);
      }));
    it('should return a 404 error  if user is not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findById').mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/orders/create')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
      }));
    it('should return a 404 error if cart is not found for the user', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findById').mockResolvedValue({});
        jest.spyOn(cart_1.default, 'findOne').mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/orders/create')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('No cart found for this user');
      }));
    it('should return a 401 error if user is not authenticated', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/orders/create')
          .set('Cookie', [`authTokenCompleted=s%3A${invalidToken}`]);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No token, Unauthorized.');
        expect(user_1.default.findById).not.toHaveBeenCalled();
      }));
  });
});
