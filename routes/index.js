const express = require('express');
const router = express.Router();
const homeRoutes = require('./home');
const rankRoutes = require('./rank');
const historyRoutes = require('./history');
const collectionRoutes = require('./collection');
const loveWordRoutes = require('./loveWord');
const categoryRoutes = require('./category');
const postRoutes = require('./post');
const authRoutes = require('./auth');
const userRoutes = require('./user');

// 注册子路由
router.use('/home', homeRoutes);
router.use('/rank', rankRoutes);
router.use('/history', historyRoutes);
router.use('/collections', collectionRoutes);
router.use('/love-words', loveWordRoutes);
router.use('/categories', categoryRoutes);
router.use('/posts', postRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

// 需要登录的接口
router.use('/user', userRoutes);
router.use('/posts/:id/like', userRoutes);
router.use('/posts/:id/collect', userRoutes);

// 404 处理
router.use('*', (req, res) => {
  res.status(404).json({
    code: -1,
    message: 'API not found'
  });
});

module.exports = router;
