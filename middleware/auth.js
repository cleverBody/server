const jwt = require('jsonwebtoken');
const config = require('../config');
const { error } = require('../utils/response');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return error(res, '未登录', 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    error(res, '无效的token', 401);
  }
}; 