'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const customErrors_1 = __importDefault(require('../errors/customErrors'));
const errorHandler = (err, req, res, next) => {
  if (err instanceof customErrors_1.default) {
    res.status(err.errorCode).send({ errors: err.serializeErrors() });
    next();
  } else {
    res.send(err);
  }
};
exports.default = errorHandler;
