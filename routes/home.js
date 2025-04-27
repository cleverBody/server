/**
 * 首页相关路由
 * 定义与首页功能相关的API端点
 */
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home'); // 导入首页控制器
const auth = require('../middleware/auth'); // 导入认证中间件

/**
 * @route    GET /api/home/daily
 * @desc     获取每日推荐情话
 * @access   Public - 无需登录，但会根据用户ID个性化结果
 */
router.get('/daily', homeController.getDailyRecommend);

/**
 * @route    GET /api/home/categories
 * @desc     获取情话分类列表
 * @access   Public - 所有用户可访问
 */
router.get('/categories', homeController.getCategories);

/**
 * @route    GET /api/home/recommendations
 * @desc     获取推荐情话列表
 * @access   Public - 无需登录，但会根据用户ID个性化结果
 * @query    page - 页码，默认1
 * @query    limit - 每页数量，默认10
 */
router.get('/recommendations', homeController.getRecommendations);

/**
 * @route    POST /api/home/like
 * @desc     点赞情话
 * @access   Private - 需要登录
 * @body     {id, type} - 目标ID和类型
 */
router.post('/like', auth, homeController.handleLike);

/**
 * @route    POST /api/home/collect
 * @desc     收藏情话
 * @access   Private - 需要登录
 * @body     {id, type} - 目标ID和类型
 */
router.post('/collect', auth, homeController.handleCollect);

/**
 * @route    POST /api/home/generate
 * @desc     AI生成情话
 * @access   Private - 需要登录
 * @body     {prompt} - 生成提示
 */
router.post('/generate', auth, homeController.generateLoveWords);

module.exports = router; 