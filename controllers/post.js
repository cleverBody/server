const db = require('../models/db');
const { success, error } = require('../utils/response');

// 获取帖子列表
exports.getPosts = async (req, res) => {
  try {
    const { type = 'new', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user?.id;

    let sql = `
      SELECT 
        p.*,
        u.nickname as author_name,
        u.avatar as author_avatar,
        COUNT(DISTINCT l.id) as like_count,
        COUNT(DISTINCT c.id) as comment_count,
        IF(ul.id IS NOT NULL, 1, 0) as is_liked,
        IF(uc.id IS NOT NULL, 1, 0) as is_collected
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes ul ON p.id = ul.post_id AND ul.user_id = ?
      LEFT JOIN user_collections uc ON p.id = uc.post_id AND uc.user_id = ?
      WHERE 1=1
    `;

    // 根据类型筛选
    if (type === 'hot') {
      sql += ' GROUP BY p.id ORDER BY like_count DESC, comment_count DESC, p.created_at DESC';
    } else if (type === 'follow' && userId) {
      sql += ' AND p.user_id IN (SELECT followed_id FROM follows WHERE follower_id = ?)';
      sql += ' GROUP BY p.id ORDER BY p.created_at DESC';
    } else {
      sql += ' GROUP BY p.id ORDER BY p.created_at DESC';
    }

    sql += ' LIMIT ? OFFSET ?';

    const params = type === 'follow' && userId
      ? [userId, userId, userId, parseInt(limit), offset]
      : [userId || null, userId || null, parseInt(limit), offset];

    const posts = await db.query(sql, params);

    // 处理图片数组
    posts.forEach(post => {
      post.images = post.images ? JSON.parse(post.images) : [];
      post.like_count = parseInt(post.like_count);
      post.comment_count = parseInt(post.comment_count);
    });

    success(res, posts);
  } catch (err) {
    console.error('获取帖子列表失败:', err);
    error(res, '获取帖子列表失败');
  }
};

// 获取帖子详情
exports.getPostDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const sql = `
      SELECT 
        p.*,
        u.nickname as author_name,
        u.avatar as author_avatar,
        COUNT(DISTINCT l.id) as like_count,
        COUNT(DISTINCT c.id) as comment_count,
        IF(ul.id IS NOT NULL, 1, 0) as is_liked,
        IF(uc.id IS NOT NULL, 1, 0) as is_collected
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes ul ON p.id = ul.post_id AND ul.user_id = ?
      LEFT JOIN user_collections uc ON p.id = uc.post_id AND uc.user_id = ?
      WHERE p.id = ?
      GROUP BY p.id
    `;

    const [post] = await db.query(sql, [userId, userId, id]);
    if (!post) {
      return error(res, '帖子不存在');
    }

    // 处理图片数组
    post.images = post.images ? JSON.parse(post.images) : [];
    post.like_count = parseInt(post.like_count);
    post.comment_count = parseInt(post.comment_count);

    success(res, post);
  } catch (err) {
    console.error('获取帖子详情失败:', err);
    error(res, '获取帖子详情失败');
  }
};

// 创建帖子
exports.createPost = async (req, res) => {
  try {
    const { content, images = [] } = req.body;
    const userId = req.user.id;

    if (!content?.trim()) {
      return error(res, '内容不能为空');
    }

    const sql = 'INSERT INTO posts (user_id, content, images) VALUES (?, ?, ?)';
    const result = await db.query(sql, [userId, content, JSON.stringify(images)]);

    success(res, { id: result.insertId });
  } catch (err) {
    console.error('发布帖子失败:', err);
    error(res, '发布失败');
  }
};

// 点赞/取消点赞
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 检查帖子是否存在
    const [post] = await db.query('SELECT id FROM posts WHERE id = ?', [id]);
    if (!post) {
      return error(res, '帖子不存在');
    }

    // 检查是否已点赞
    const [like] = await db.query(
      'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
      [userId, id]
    );

    if (like) {
      // 取消点赞
      await db.query(
        'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, id]
      );
    } else {
      // 添加点赞
      await db.query(
        'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
        [userId, id]
      );
    }

    success(res);
  } catch (err) {
    console.error('点赞操作失败:', err);
    error(res, '操作失败');
  }
};

// 获取评论列表
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const sql = `
      SELECT 
        c.*,
        u.nickname as author_name,
        u.avatar as author_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const comments = await db.query(sql, [id, parseInt(limit), offset]);
    success(res, comments);
  } catch (err) {
    console.error('获取评论失败:', err);
    error(res, '获取评论失败');
  }
};

// 发表评论
exports.comment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content?.trim()) {
      return error(res, '评论内容不能为空');
    }

    // 检查帖子是否存在
    const [post] = await db.query('SELECT id FROM posts WHERE id = ?', [id]);
    if (!post) {
      return error(res, '帖子不存在');
    }

    const sql = 'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)';
    await db.query(sql, [userId, id, content.trim()]);

    success(res);
  } catch (err) {
    console.error('发表评论失败:', err);
    error(res, '发表评论失败');
  }
}; 