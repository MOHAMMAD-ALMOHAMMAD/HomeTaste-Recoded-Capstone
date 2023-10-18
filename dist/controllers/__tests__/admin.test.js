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
const user_1 = __importDefault(require('../../models/user'));
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
const mockToken = jsonwebtoken_1.default.sign(
  { _id: '64b9781dbee12ba0fe169821', role: 'admin' },
  process.env.SECRET_KEY
);
const signedToken = cookie_signature_1.default.sign(
  mockToken,
  process.env.SECRET_KEY
);
const mockUser1 = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  phone: '+905551234567',
  address: {
    streetName: 'Cooker Street',
    streetNumber: 123,
    flatNumber: 4,
    district: 'Cookerville',
    city: 'Cookstown',
    state: 'Cookerstate',
    zip: 12345,
  },
  profileImage: 'profile-image-url',
  role: 'cooker',
  paymentMethod: [
    {
      cardNumber: '1234567812345678',
      cardType: 'visa',
      cardCvv: 123,
      expirationDate: '12/24',
    },
  ],
  cookerStatus: 'active',
  paymentMethodStatus: true,
  isConfirmed: true,
  isRegistrationComplete: true,
  _id: '',
  providerId: '',
  fullName: '',
};
const mockUser2 = {
  firstName: 'Nur',
  lastName: 'Abunamus',
  email: 'nurabunamus@gmail.com',
  password: 'password123',
  phone: '+905554234567',
  address: {
    streetName: 'Cooker Street',
    streetNumber: 123,
    flatNumber: 4,
    district: 'Cookerville',
    city: 'Cookstown',
    state: 'Cookerstate',
    zip: 12345,
  },
  profileImage: 'profile-image-url',
  role: 'customer',
  paymentMethod: [
    {
      cardNumber: '1234567812345678',
      cardType: 'visa',
      cardCvv: 123,
      expirationDate: '12/24',
    },
  ],
  cookerStatus: 'active',
  paymentMethodStatus: true,
  isConfirmed: true,
  isRegistrationComplete: true,
  _id: '',
  providerId: '',
  fullName: '',
};
const mockUserArray1 = [mockUser1];
const mockUserArray2 = [mockUser2];
const spy = jest
  .spyOn(user_1.default, 'find')
  .mockResolvedValue(mockUserArray1);
describe('Admin Routes', () => {
  afterEach(() => {
    spy.mockReset();
  });
  describe('GET api/admin/cooker', () => {
    it('should return all users with the role cooker', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        spy.mockResolvedValueOnce(mockUserArray1);
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/admin/cooker')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUserArray1);
        expect(spy).toHaveBeenCalledTimes(1);
      }));
    it('should return an empty array when there are no users with the role cooker', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        spy.mockResolvedValueOnce([]);
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/admin/cooker')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
        expect(spy).toHaveBeenCalledTimes(1);
      }));
  });
  describe('GET api/admin/customers', () => {
    it('should return all users with the customer cooker', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        spy.mockResolvedValueOnce(mockUserArray2);
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/admin/customers')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUserArray2);
        expect(spy).toHaveBeenCalledTimes(1);
      }));
    it('should return an empty array when there are no users with the role cooker', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        spy.mockResolvedValueOnce([]);
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/admin/cooker')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
        expect(spy).toHaveBeenCalledTimes(1);
      }));
  });
});
