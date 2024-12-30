const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

// 更新用户信息
router.post('/update', auth, userController.updateUser);

module.exports = router;
