const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../middleware/auth');

// 获取帖子列表
router.get('/', postController.getPosts);

// 获取帖子详情
router.get('/:id', postController.getPostById);

// 发布帖子
router.post('/', auth, postController.createPost);

// 点赞帖子
router.post('/:id/like', auth, postController.handleLike);

// 收藏帖子
router.post('/:id/collect', auth, postController.handleCollect);

// 评论帖子
router.post('/:id/comment', auth, postController.createComment);

// 删除帖子
router.delete('/:id', auth, postController.deletePost);

module.exports = router; 