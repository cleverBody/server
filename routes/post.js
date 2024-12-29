const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../middleware/auth');

// 获取帖子列表
router.get('/posts', postController.getPosts);

// 创建帖子
router.post('/posts', auth, postController.createPost);

// 点赞/取消点赞
router.post('/posts/:id/like', auth, postController.toggleLike);

// 评论帖子
router.post('/posts/:id/comments', auth, postController.comment);

// 获取评论列表
router.get('/posts/:id/comments', postController.getComments);

module.exports = router; 