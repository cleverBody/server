const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history');
const auth = require('../middleware/auth');

// 获取浏览历史
router.get('/', auth, historyController.getHistory);

// 添加浏览记录
router.post('/', auth, historyController.addHistory);

// 清空浏览历史
router.delete('/', auth, historyController.clearHistory);

module.exports = router; 