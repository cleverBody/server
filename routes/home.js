const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const auth = require('../middleware/auth');

// 获取每日推荐
router.get('/daily', homeController.getDailyRecommend);

// 获取分类列表
router.get('/categories', homeController.getCategories);

// 获取推荐列表
router.get('/recommendations', homeController.getRecommendations);

// 点赞操作
router.post('/like', auth, homeController.handleLike);

// 收藏操作
router.post('/collect', auth, homeController.handleCollect);

// AI生成情话
router.post('/generate', auth, homeController.generateLoveWords);

module.exports = router; 