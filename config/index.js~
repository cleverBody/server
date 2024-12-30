require('dotenv').config();

module.exports = {
  // JWT配置
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtExpires: process.env.JWT_EXPIRES || '7d',

  // 数据库配置
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'tuweiqinghua'
  },

  // 微信小程序配置
  wx: {
    appId: process.env.WX_APPID,
    appSecret: process.env.WX_SECRET
  },

  // 环境配置
  isDev: process.env.NODE_ENV === 'development'
};
