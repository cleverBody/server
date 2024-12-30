const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection');
const auth = require('../middleware/auth');

// 获取收藏列表
router.get('/', auth, collectionController.getCollections);

// 添加收藏
router.post('/', auth, collectionController.addCollection);

// 取消收藏
router.delete('/:id', auth, collectionController.removeCollection);

module.exports = router; 