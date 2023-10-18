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
exports.clearDatabase =
  exports.closeDbConnection =
  exports.connectToMongo =
    void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const { DB_USERNAME, DB_PASSWORD, NODE_ENV } = process.env;
const DB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@home-taste-capstone.wyqdpan.mongodb.net/home-taste-db?retryWrites=true&w=majority`;
const TEST_DB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@home-taste-capstone.wyqdpan.mongodb.net/home-taste-test-db?retryWrites=true&w=majority`;
const url = NODE_ENV === 'test' ? TEST_DB_URI : DB_URI;
// Function to connect to MongoDB
const connectToMongo = () => {
  mongoose_1.default.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose_1.default.connection;
  // Once the connection is open, log a success message
  db.once('open', () => {
    console.log('Database connected successfully...');
  });
  // If there's an error in the database connection, log the error message
  db.on('error', (err) => {
    console.error('Database connection error:', err);
  });
};
exports.connectToMongo = connectToMongo;
const closeDbConnection = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    // await mongoose.connection.dropDatabase();
    yield mongoose_1.default.connection.close();
  });
exports.closeDbConnection = closeDbConnection;
const clearDatabase = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { collections } = mongoose_1.default.connection;
    // Dont use await in for loops, instead use Promise.all
    // Promise.all runs all the callbacks concurrently (almost in parallel), but using awaits in for loops will run the callbacks one after another
    // Deleting all the records in a collection isn't depenedant on any other collection, so we dont need to wait until one collection is deleted before deleting other collections
    // mongoose.mongo.DeleteResult is the promise type of the mongoose deleteMany() method
    const mongooseDeletePromises = [];
    for (const key in collections) {
      mongooseDeletePromises.push(collections[key].deleteMany());
    }
    yield Promise.all(mongooseDeletePromises);
  });
exports.clearDatabase = clearDatabase;
