'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const checkRole = (role) => (req, res, next) => {
  var _a;
  if (
    ((_a = req === null || req === void 0 ? void 0 : req.userCookie) === null ||
    _a === void 0
      ? void 0
      : _a.role) !== role
  ) {
    res.redirect(301, '/');
  } else {
    next();
  }
};
exports.default = checkRole;
