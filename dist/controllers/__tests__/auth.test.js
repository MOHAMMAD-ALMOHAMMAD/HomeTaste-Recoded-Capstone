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
const bcrypt_1 = __importDefault(require('bcrypt'));
const app_1 = __importDefault(require('../../app'));
const connection_1 = require('../../db/connection');
const user_1 = __importDefault(require('../../models/user'));
beforeAll(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.connectToMongo)();
  })
);
afterAll(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.closeDbConnection)();
    app_1.default.close();
  })
);
const mockUser = {
  _id: '12343325454254245',
  email: 'test5@example.com',
  password: 'password123',
  fullName: 'John Doe',
};
const mockLoginUser = {
  email: 'test99@example.com',
  password: 'password123',
};
const user = {
  _id: 'valid_user_id_here',
};
const spyUserFind1 = jest.spyOn(user_1.default, 'findOne').mockReturnValue({});
const spyUserCreate = jest
  .spyOn(user_1.default, 'create')
  .mockReturnValue(mockUser);
const spyBycrypt = jest
  .spyOn(bcrypt_1.default, 'compare')
  .mockImplementation(() => Promise.resolve(true));
describe('Auth Routes', () => {
  afterEach(() => {
    spyUserFind1.mockClear();
    spyBycrypt.mockClear();
  });
  describe('POST api/auth/register1', () => {
    it('should register a new user', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/auth/register1')
          .send(mockUser);
        expect(spyUserFind1).toBeCalledTimes(1);
        expect(spyUserCreate).toBeCalledTimes(1);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User successfully signed up');
      }));
    it('should return 400 if required fields are missing', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/auth/register1')
          .send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Missing required fields');
      }));
    it('should return 409 if user already exists', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const spyUserFind2 = jest
          .spyOn(user_1.default, 'findOne')
          .mockResolvedValueOnce(mockUser);
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/auth/register1')
          .send(mockUser);
        expect(spyUserFind2).toBeCalledTimes(1);
        expect(res.status).toBe(409);
        expect(res.body.error).toBe('User already exists');
      }));
  });
  describe('POST api/auth/login', () => {
    it('should return 200 if login is successful', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const spyUserFindLogin = jest
          .spyOn(user_1.default, 'findOne')
          .mockReturnValue(mockLoginUser);
        jest.spyOn(user_1.default, 'findOne').mockResolvedValue(user);
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/auth/login')
          .send(mockLoginUser);
        expect(spyUserFindLogin).toBeCalledTimes(1);
        expect(spyBycrypt).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User successfully logged in');
      }));
    it('should return 400 if email or password is missing', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/auth/login')
          .send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Missing required fields');
      }));
    it('should return 404 if user is not found', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findOne').mockResolvedValueOnce(null);
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/auth/login')
          .send(mockLoginUser);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User not found, please register');
      }));
    it('should return 404 if user is signed in with Google', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(user_1.default, 'findOne').mockResolvedValueOnce({
          email: 'googleuser@example.com',
          providerId: 'google123',
        });
        const res = yield (0, supertest_1.default)(app_1.default)
          .post('/api/auth/login')
          .send(mockLoginUser);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe(
          'Use the appropriate method for login, Google or Facebook'
        );
      }));
  });
});
