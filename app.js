/**
 * 应用程序主配置文件
 * 负责Express应用的初始化、中间件配置和路由注册
 */
const express = require('express');
const cors = require('cors'); // 跨域资源共享中间件
const morgan = require('morgan'); // HTTP请求日志记录中间件
const routes = require('./routes'); // 导入路由模块
const errorHandler = require('./middleware/errorHandler'); // 自定义错误处理中间件
const db = require('./models/db'); // 数据库连接模块

// 创建Express应用实例
const app = express();

/**
 * 禁用缓存中间件
 * 确保API响应不被客户端缓存，始终获取最新数据
 */
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

/**
 * 核心中间件配置
 */
app.use(cors()); // 启用CORS，允许跨域请求
app.use(morgan('dev')); // 开发环境日志格式
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

/**
 * 请求日志记录中间件
 * 在控制台输出所有请求的方法和URL，便于调试
 */
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

/**
 * 注册API路由
 * 所有API路由都以/api为前缀
 */
app.use('/api', routes);

/**
 * 测试路由
 * 用于简单检查服务器是否正常运行
 */
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working',
    timestamp: new Date().toISOString()
  });
});

/**
 * 404错误处理
 * 处理所有未定义的路由请求
 */
app.use('*', (req, res) => {
  res.status(404).json({
    code: -1,
    message: `API not found: ${req.originalUrl}`
  });
});

/**
 * 全局错误处理中间件
 * 统一处理应用中抛出的所有错误
 */
app.use(errorHandler);

/**
 * 初始化数据库连接
 * 如果连接失败则退出应用
 */
db.connect().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = app;



