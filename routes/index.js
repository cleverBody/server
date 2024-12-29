const express = require('express');
const router = express.Router();
const homeRoutes = require('./home');

// API 路由 - 直接使用 /home 而不是 /api/home，因为 app.js 已经添加了 /api 前缀
router.use('/home', homeRoutes);

// 404 处理
router.use('*', (req, res) => {
  res.status(404).json({
    code: -1,
    message: 'API not found'
  });
});

module.exports = router; 