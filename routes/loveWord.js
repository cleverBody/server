const express = require('express');
const router = express.Router();
const loveWordController = require('../controllers/loveWord');
const auth = require('../middleware/auth');

// 获取情话列表
router.get('/', loveWordController.getLoveWords);

// 获取情话详情
router.get('/:id', loveWordController.getLoveWordById);

// 点赞情话
router.post('/:id/like', auth, loveWordController.handleLike);

// 收藏情话
router.post('/:id/collect', auth, loveWordController.handleCollect);

module.exports = router; 