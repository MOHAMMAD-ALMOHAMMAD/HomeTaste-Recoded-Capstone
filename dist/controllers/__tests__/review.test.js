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
const review_1 = __importDefault(require('../../models/review'));
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
const foodId = '60f7ea20a8b1c72f9a56c3f4';
const review1 = {
  _id: '60f7ea20a8b1c72f9a56c3f5',
  rating: 4,
  comment: 'Delicious!',
  userId: '60f7ea20a8b1c72f9a56c3f2',
  dishId: foodId,
  order: '60f7ea20a8b1c72f9a56c3f3',
};
const review2 = {
  _id: '60f7ea20a8b1c72f9a56c3f6',
  rating: 5,
  comment: 'Amazing!',
  customerId: '60f7ea20a8b1c72f9a56c3f2',
  dishId: foodId,
  orderId: '60f7ea20a8b1c72f9a56c3f3',
};
const mockToken = jsonwebtoken_1.default.sign(
  { _id: '64b9781dbee12ba0fe169821', role: 'customer' },
  process.env.SECRET_KEY
);
const signedToken = cookie_signature_1.default.sign(
  mockToken,
  process.env.SECRET_KEY
);
const mockFind = jest
  .spyOn(review_1.default, 'find')
  .mockResolvedValueOnce([review1, review2]);
describe('Review Routes', () => {
  afterEach(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      mockFind.mockReset();
    })
  );
  describe('GET /:foodId/reviews', () => {
    it('should retrieve all reviews for a food item', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        // Make the request
        const res = yield (0, supertest_1.default)(app_1.default)
          .get(`/api/review/${foodId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`]);
        expect(res.status).toBe(200);
        expect(res.body.reviews).toHaveLength(2);
        expect(res.body.reviews[0]._id).toEqual(review1._id);
        expect(res.body.reviews[1]._id).toEqual(review2._id);
        mockFind.mockRestore();
      }));
  });
  describe('POST /review/:foodId', () => {
    it('should create a new review for a food item', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const reviewData = {
          rating: 4,
          comment: 'Delicious!',
          customerId: '60f7ea20a8b1c72f9a56c3f2',
          orderId: '60f7ea20a8b1c72f9a56c3f3',
        };
        const mockSave = jest
          .spyOn(review_1.default.prototype, 'save')
          .mockImplementationOnce(function () {
            this._id = '60f7ea20a8b1c72f9a56c3f5';
            return Promise.resolve(this);
          });
        const res = yield (0, supertest_1.default)(app_1.default)
          .post(`/api/review/${foodId}`)
          .set('Cookie', [`authTokenCompleted=s%3A${signedToken}`])
          .send(reviewData);
        expect(res.status).toBe(201);
        expect(res.body.message).toEqual('Review created successfully');
        expect(res.body.review.rating).toEqual(reviewData.rating);
        expect(res.body.review.comment).toEqual(reviewData.comment);
        expect(res.body.review.customerId).toEqual(reviewData.customerId);
        expect(res.body.review.dishId).toEqual(foodId);
        expect(res.body.review.orderId).toEqual(reviewData.orderId);
        mockSave.mockRestore();
      }));
  });
});
