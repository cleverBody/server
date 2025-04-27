/**
 * 配置文件
 * 集中管理应用的所有配置项，优先使用环境变量，否则使用默认值
 */
require('dotenv').config(); // 加载.env文件中的环境变量

module.exports = {
  // JWT配置
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key', // JWT签名密钥
  jwtExpires: process.env.JWT_EXPIRES || '7d', // JWT过期时间，默认7天
  
  // 服务器配置
  port: process.env.PORT || 3000, // 服务器监听端口

  // 数据库配置
  db: {
    host: process.env.DB_HOST || 'localhost', // 数据库主机地址
    user: process.env.DB_USER || 'root', // 数据库用户名
    password: process.env.DB_PASSWORD || 'root', // 数据库密码
    database: process.env.DB_NAME || 'tuweiqinghua' // 数据库名称
  },

  // 微信小程序配置
  wx: {
    appId: process.env.WX_APPID, // 微信小程序的AppID
    appSecret: process.env.WX_SECRET // 微信小程序的AppSecret
  },

  // 环境配置
  isDev: process.env.NODE_ENV === 'development' // 是否为开发环境
};
