const db = require('../models/db');
const { success, error } = require('../utils/response');

class CollectionController {
  // 获取收藏列表
  async getCollections(req, res) {
    try {
      const { type = 'love', page = 1, limit = 10 } = req.query;
      const userId = req.user.id;
      const offset = (page - 1) * limit;

      let sql = '';
      if (type === 'love') {
        sql = `
          SELECT 
            l.*,
            u.nickname as author,
            u.avatar,
            c.created_at as collect_time
          FROM user_collections c
          LEFT JOIN love_words l ON c.target_id = l.id
          LEFT JOIN users u ON l.created_by = u.id
          WHERE c.user_id = ? AND c.type = 'love'
          ORDER BY c.created_at DESC
          LIMIT ? OFFSET ?
        `;
      } else {
        sql = `
          SELECT 
            p.*,
            u.nickname as author_name,
            u.avatar as author_avatar,
            c.created_at as collect_time
          FROM user_collections c
          LEFT JOIN posts p ON c.target_id = p.id
          LEFT JOIN users u ON p.user_id = u.id
          WHERE c.user_id = ? AND c.type = 'post'
          ORDER BY c.created_at DESC
          LIMIT ? OFFSET ?
        `;
      }

      const [rows] = await db.execute(sql, [userId, parseInt(limit), offset]);
      
      success(res, {
        list: rows,
        hasMore: rows.length === parseInt(limit)
      });
    } catch (err) {
      console.error('获取收藏列表失败:', err);
      error(res, '获取收藏列表失败');
    }
  }

  // 添加收藏
  async addCollection(req, res) {
    try {
      const { id, type } = req.body;
      const userId = req.user.id;

      // 检查是否已收藏
      const [existing] = await db.execute(
        'SELECT id FROM user_collections WHERE user_id = ? AND type = ? AND target_id = ?',
        [userId, type, id]
      );

      if (existing.length > 0) {
        return error(res, '已经收藏过了');
      }

      await db.execute(
        'INSERT INTO user_collections (user_id, type, target_id) VALUES (?, ?, ?)',
        [userId, type, id]
      );

      success(res);
    } catch (err) {
      console.error('添加收藏失败:', err);
      error(res, '添加收藏失败');
    }
  }

  // 取消收藏
  async removeCollection(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await db.execute(
        'DELETE FROM user_collections WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      success(res);
    } catch (err) {
      console.error('取消收藏失败:', err);
      error(res, '取消收藏失败');
    }
  }
}

module.exports = new CollectionController(); 