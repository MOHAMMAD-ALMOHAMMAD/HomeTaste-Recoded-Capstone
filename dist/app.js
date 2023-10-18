'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
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
const express_1 = __importDefault(require('express'));
const cookie_parser_1 = __importDefault(require('cookie-parser'));
const passport_1 = __importDefault(require('passport'));
const swagger_jsdoc_1 = __importDefault(require('swagger-jsdoc'));
const swagger_ui_express_1 = __importDefault(require('swagger-ui-express'));
const dotenv = __importStar(require('dotenv'));
const path_1 = __importDefault(require('path'));
const error_handling_1 = __importDefault(
  require('./middlewares/error-handling')
);
const routes_1 = __importDefault(require('./routes'));
const connection_1 = require('./db/connection');
const variables_1 = __importDefault(require('./utils/variables'));
require('./config/passport');
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)(process.env.SECRET_KEY));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.get('/home', (req, res) => {
  res.render('home');
});
const swaggerSpec = (0, swagger_jsdoc_1.default)(variables_1.default);
app.use(
  '/api-docs',
  swagger_ui_express_1.default.serve,
  swagger_ui_express_1.default.setup(swaggerSpec, { explorer: true })
);
app.use('/api', routes_1.default);
app.use('*', error_handling_1.default);
const port = process.env.NODE_LOCAL_PORT || 4000;
const server = app.listen(port, () =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server listening on port ${port}`);
    yield (0, connection_1.connectToMongo)();
  })
);
exports.default = server;
