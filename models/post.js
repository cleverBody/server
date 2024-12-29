const db = require('./db');

class Post {
  static async execute(sql, params = []) {
    try {
      const [rows] = await db.query(sql, params);
      return rows;
    } catch (err) {
      console.error('SQL Error:', err);
      console.error('SQL:', sql);
      console.error('Params:', params);
      throw err;
    }
  }

  // 获取帖子列表
  static async findAll({ type = 'hot', page = 1, limit = 10, userId = null }) {
    const offset = (page - 1) * limit;

    let sql = `
      SELECT 
        p.*,
        u.nickname as author_name,
        u.avatar as author_avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comment_count,
        IF(pl.id IS NOT NULL, 1, 0) as is_liked
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN post_likes pl ON p.id = pl.post_id AND pl.user_id = ?
    `;

    const params = [userId || 0];

    // 根据类型排序
    if (type === 'hot') {
      sql += ' ORDER BY like_count DESC, created_at DESC';
    } else if (type === 'new') {
      sql += ' ORDER BY created_at DESC';
    } else if (type === 'follow') {
      sql += ' WHERE EXISTS (SELECT 1 FROM user_follows WHERE follower_id = ? AND followed_id = p.user_id)';
      params.push(userId || 0);
      sql += ' ORDER BY created_at DESC';
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = await this.execute(sql, params);

    return rows;
  }

  // 创建帖子
  static async create({ userId, content, images = [] }) {
    const sql = 'INSERT INTO posts (user_id, content, images) VALUES (?, ?, ?)';
    const result = await this.execute(sql, [userId, content, JSON.stringify(images)]);
    return result.insertId;
  }

  // 点赞帖子
  static async like(userId, postId) {
    const sql = 'INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)';
    return await this.execute(sql, [userId, postId]);
  }

  // 取消点赞
  static async unlike(userId, postId) {
    const sql = 'DELETE FROM post_likes WHERE user_id = ? AND post_id = ?';
    return await this.execute(sql, [userId, postId]);
  }

  // 评论帖子
  static async comment(userId, postId, content) {
    const sql = 'INSERT INTO post_comments (user_id, post_id, content) VALUES (?, ?, ?)';
    return await this.execute(sql, [userId, postId, content]);
  }

  // 获取帖子评论
  static async getComments(postId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT 
        c.*,
        u.nickname as author_name,
        u.avatar as author_avatar
      FROM post_comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return await this.execute(sql, [postId, limit, offset]);
  }

  // 检查是否已点赞
  static async checkLike(userId, postId) {
    const sql = 'SELECT id FROM post_likes WHERE user_id = ? AND post_id = ?';
    const rows = await this.execute(sql, [userId, postId]);
    return rows.length > 0;
  }
}

module.exports = Post;
