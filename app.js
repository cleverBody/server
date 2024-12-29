const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const db = require('./models/db');

const app = express();

// 中间件
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由调试
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// API路由
app.use('/api', routes);

// 测试路由
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working',
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    code: -1,
    message: `API not found: ${req.originalUrl}`
  });
});

// 错误处理
app.use(errorHandler);

// 初始化数据库连接
db.connect().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = app;



