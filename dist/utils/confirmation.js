'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateResetToken = exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require('crypto'));
const algorithm = process.env.CRYPTO_ALGORITHM;
const secretKey = process.env.CONFIRMATION_SECRET_KEY;
const iv = process.env.INITIALIZATION_VECTOR;
const encrypt = (token) => {
  const cipher = crypto_1.default.createCipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, 'hex')
  );
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  return encrypted.toString('hex');
};
exports.encrypt = encrypt;
const decrypt = (hash) => {
  const decipher = crypto_1.default.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, 'hex')
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString();
};
exports.decrypt = decrypt;
const generateResetToken = () => {
  const tokenBytes = 32; // Adjust the number of bytes as per your requirement (32 bytes = 256 bits, a common size for secure tokens)
  return crypto_1.default.randomBytes(tokenBytes).toString('hex');
};
exports.generateResetToken = generateResetToken;
