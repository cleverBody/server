const db = require('../models/db');
const { success, error } = require('../utils/response');

// 获取用户信息
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
        (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) as followers_count,
        (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as posts_count
      FROM users u
      WHERE u.id = ?
    `;

    const [user] = await db.query(sql, [userId]);
    if (!user) {
      return error(res, '用户不存在');
    }

    // 删除敏感信息
    delete user.openid;
    
    success(res, user);
  } catch (err) {
    console.error('获取用户信息失败:', err);
    error(res, '获取用户信息失败');
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nickname, avatar } = req.body;

    const sql = 'UPDATE users SET nickname = ?, avatar = ? WHERE id = ?';
    await db.query(sql, [nickname, avatar, userId]);

    success(res);
  } catch (err) {
    console.error('更新用户信息失败:', err);
    error(res, '更新失败');
  }
};

// 获取情话收藏列表
exports.getLoveWordCollections = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = `
      SELECT 
        l.*,
        IF(uc.id IS NOT NULL, 1, 0) as is_collected
      FROM love_words l
      INNER JOIN user_collections uc ON l.id = uc.love_word_id
      WHERE uc.user_id = ?
      ORDER BY uc.created_at DESC
    `;
    
    const collections = await db.query(sql, [userId]);
    success(res, collections);
  } catch (err) {
    console.error('获取情话收藏失败:', err);
    error(res, '获取收藏失败');
  }
};

// 获取帖子收藏列表
exports.getPostCollections = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = `
      SELECT 
        p.*,
        u.nickname as author_name,
        u.avatar as author_avatar,
        COUNT(DISTINCT l.id) as like_count,
        COUNT(DISTINCT c.id) as comment_count,
        IF(ul.id IS NOT NULL, 1, 0) as is_liked,
        1 as is_collected
      FROM posts p
      INNER JOIN user_collections uc ON p.id = uc.post_id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes ul ON p.id = ul.post_id AND ul.user_id = ?
      WHERE uc.user_id = ?
      GROUP BY p.id
      ORDER BY uc.created_at DESC
    `;
    
    const collections = await db.query(sql, [userId, userId]);
    success(res, collections);
  } catch (err) {
    console.error('获取帖子收藏失败:', err);
    error(res, '获取收藏失败');
  }
};

// 取消收藏情话
exports.uncollectLoveWord = async (req, res) => {
  try {
    const userId = req.user.id;
    const loveWordId = req.params.id;
    
    await db.query(
      'DELETE FROM user_collections WHERE user_id = ? AND love_word_id = ?',
      [userId, loveWordId]
    );
    
    success(res);
  } catch (err) {
    console.error('取消收藏失败:', err);
    error(res, '取消收藏失败');
  }
};

// 取消收藏帖子
exports.uncollectPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    
    await db.query(
      'DELETE FROM user_collections WHERE user_id = ? AND post_id = ?',
      [userId, postId]
    );
    
    success(res);
  } catch (err) {
    console.error('取消收藏失败:', err);
    error(res, '取消收藏失败');
  }
};

// 获取点赞的帖子列表
exports.getLikedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = `
      SELECT 
        p.*,
        u.nickname as author_name,
        u.avatar as author_avatar,
        COUNT(DISTINCT l.id) as like_count,
        COUNT(DISTINCT c.id) as comment_count,
        1 as is_liked,
        IF(uc.id IS NOT NULL, 1, 0) as is_collected
      FROM posts p
      INNER JOIN likes ul ON p.id = ul.post_id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN user_collections uc ON p.id = uc.post_id AND uc.user_id = ?
      WHERE ul.user_id = ?
      GROUP BY p.id
      ORDER BY ul.created_at DESC
    `;
    
    const posts = await db.query(sql, [userId, userId]);
    success(res, posts);
  } catch (err) {
    console.error('获取点赞列表失败:', err);
    error(res, '获取点赞列表失败');
  }
};

// 获取生成器历史记录
exports.getGeneratorHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = `
      SELECT * FROM generator_history
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 20
    `;
    
    const history = await db.query(sql, [userId]);
    success(res, history);
  } catch (err) {
    console.error('获取生成历史失败:', err);
    error(res, '获取历史记录失败');
  }
};

// 更新用户信息
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nickname, avatar } = req.body;

    let updateFields = [];
    let params = [];

    if (nickname) {
      updateFields.push('nickname = ?');
      params.push(nickname);
    }

    if (avatar) {
      updateFields.push('avatar = ?');
      params.push(avatar);
    }

    if (updateFields.length === 0) {
      return error(res, '没有要更新的字段');
    }

    params.push(userId);

    await db.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    // 获取更新后的用户信息
    const [users] = await db.query(
      'SELECT id, nickname, avatar, created_at FROM users WHERE id = ?',
      [userId]
    );

    success(res, users[0]);
  } catch (err) {
    console.error('更新用户信息失败:', err);
    error(res, '更新失败');
  }
};
