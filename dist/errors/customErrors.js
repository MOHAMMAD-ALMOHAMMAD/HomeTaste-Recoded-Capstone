'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
class customError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, customError);
  }
}
exports.default = customError;
