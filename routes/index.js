const express = require('express');
const router = express.Router();
const homeRoutes = require('./home');
const rankRoutes = require('./rank');
const historyRoutes = require('./history');
const collectionRoutes = require('./collection');

// 注册子路由
router.use('/home', homeRoutes);
router.use('/rank', rankRoutes);
router.use('/history', historyRoutes);
router.use('/collections', collectionRoutes);

// 404 处理
router.use('*', (req, res) => {
  res.status(404).json({
    code: -1,
    message: 'API not found'
  });
});

module.exports = router; 