const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

// 获取分类列表
router.get('/', categoryController.getCategories);

// 获取分类详情
router.get('/:id', categoryController.getCategoryById);

module.exports = router; 