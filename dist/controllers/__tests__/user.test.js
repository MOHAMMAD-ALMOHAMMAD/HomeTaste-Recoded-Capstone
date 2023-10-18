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
const cookie_signature_1 = __importDefault(require('cookie-signature'));
const supertest_1 = __importDefault(require('supertest'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
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
// To get user profile
const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '05340718124',
  address: {
    city: 'Test City',
    country: 'Test Country',
  },
  profileImage: 'profile.jpg',
  cookerStatus: '',
};
const spy = jest.spyOn(user_1.default, 'findById').mockResolvedValue(mockUser);
// To update user profile
const updateUserData = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+905340718124',
  cookerStatus: '',
  streetName: 'Main Street',
  streetNumber: '123',
  city: 'New York',
  state: 'NY',
  flatNumber: 'Apt 1',
  district: 'Central',
  zip: '12345',
  profileImage: '/image.jpg',
};
const findOneAndUpdateSpy = jest.spyOn(user_1.default, 'findOneAndUpdate');
findOneAndUpdateSpy.mockResolvedValue(updateUserData);
describe('User Routes', () => {
  afterEach(() => {
    spy.mockReset();
    findOneAndUpdateSpy.mockClear();
  });
  describe('GET/api/users/profile', () => {
    it('Should get the user profile', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/users/profile')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User retrieved successfully');
        expect(res.body.data).toEqual(mockUser);
        expect(spy).toHaveBeenCalledTimes(1);
      }));
    it('should return a 401 error when the user is not authenticated', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(
          '/api/users/profile'
        );
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No token, Unauthorized.');
        expect(spy).not.toHaveBeenCalled();
      }));
    it('should return a 404 error when the user is not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        // Mock User.findById to return null, indicating that the user is not found
        spy.mockResolvedValueOnce(null);
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/users/profile')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
        expect(spy).toHaveBeenCalledTimes(1);
      }));
    it('should return a 500 error when an internal server error occurs', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        // Mock User.findById to throw an error, simulating an internal server error
        spy.mockRejectedValueOnce(new Error('Database connection failed'));
        const res = yield (0, supertest_1.default)(app_1.default)
          .get('/api/users/profile')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Internal server error');
        expect(spy).toHaveBeenCalledTimes(1);
      }));
  });
  describe('PATCH/api/users/profile/edit', () => {
    it('should update the user profile', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .patch('/api/users/profile/edit')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
          .send(updateUserData);
        expect(res.status).toBe(200);
        expect(res.body.message).toEqual('Profile updated successfully!');
        expect(res.body.data).toEqual(updateUserData);
        expect(findOneAndUpdateSpy).toHaveBeenCalledTimes(1);
      }));
    it('should return a 401 error when updating the profile without proper authentication', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .patch('/api/users/profile/edit')
          .set('Cookie', [`authTokenCompleted=s%3A${invalidToken}`]);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('No token, Unauthorized.');
      }));
    it('should return a 404 error when the user is not found when updating the profile', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        findOneAndUpdateSpy.mockResolvedValueOnce(null);
        const res = yield (0, supertest_1.default)(app_1.default)
          .patch('/api/users/profile/edit')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
        expect(findOneAndUpdateSpy).toHaveBeenCalledTimes(1);
      }));
    it('should return a 500 error when an internal server error occurs updating the profile', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        findOneAndUpdateSpy.mockRejectedValueOnce(
          new Error('Database connection failed')
        );
        const res = yield (0, supertest_1.default)(app_1.default)
          .patch('/api/users/profile/edit')
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Internal server error');
        expect(findOneAndUpdateSpy).toHaveBeenCalledTimes(1);
      }));
  });
});
