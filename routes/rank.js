const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rank');

// 获取排行榜
router.get('/', rankController.getRankList);

module.exports = router; 