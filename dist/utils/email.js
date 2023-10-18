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
const email_1 = __importDefault(require('../config/email'));
const sendEmail = (email, subject, link, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Initialize the Nodemailer with your Gmail credentials
      const Transport = yield (0, email_1.default)();
      const mailOptions = {
        from: 'HomeTaste',
        to: email,
        subject,
        html: `Click the following link to proceed: <a href="${link}">${subject}</a>`,
      };
      // Send the email
      yield Transport.sendMail(mailOptions);
      return;
    } catch (error) {
      res.status(400).send(error);
    }
  });
exports.default = sendEmail;
