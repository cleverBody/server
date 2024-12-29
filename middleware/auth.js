const jwt = require('jsonwebtoken');
const config = require('../config');
const { error } = require('../utils/response');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return error(res, '未登录', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, '登录已过期', 401);
  }
}; 