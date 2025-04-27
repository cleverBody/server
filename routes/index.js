/**
 * 路由模块主入口
 * 集中管理和注册所有API路由
 */
const express = require('express');
const router = express.Router();

// 导入所有子路由模块
const homeRoutes = require('./home');          // 首页相关路由
const rankRoutes = require('./rank');          // 排行榜相关路由
const historyRoutes = require('./history');    // 历史记录相关路由
const collectionRoutes = require('./collection'); // 收藏相关路由
const loveWordRoutes = require('./loveWord');  // 情话相关路由
const categoryRoutes = require('./category');  // 分类相关路由
const postRoutes = require('./post');          // 帖子相关路由
const authRoutes = require('./auth');          // 认证相关路由
const userRoutes = require('./user');          // 用户相关路由

/**
 * 注册基础API路由
 * 每个子路由都挂载在特定的路径前缀下
 */
router.use('/home', homeRoutes);
router.use('/rank', rankRoutes);
router.use('/history', historyRoutes);
router.use('/collections', collectionRoutes);
router.use('/love-words', loveWordRoutes);
router.use('/categories', categoryRoutes);
router.use('/posts', postRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

/**
 * 需要登录验证的API路由
 * 这些路由要求用户必须已登录才能访问
 */
router.use('/user', userRoutes);
router.use('/posts/:id/like', userRoutes);     // 点赞帖子，需要登录
router.use('/posts/:id/collect', userRoutes);  // 收藏帖子，需要登录

/**
 * 404错误处理中间件
 * 处理所有未匹配的API路由请求
 */
router.use('*', (req, res) => {
  res.status(404).json({
    code: -1,
    message: 'API not found'
  });
});

module.exports = router;
