const db = require('../models/db');
const { success, error } = require('../utils/response');

class HistoryController {
  // 获取浏览历史
  async getHistory(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const userId = req.user.id;
      const offset = (page - 1) * limit;

      const sql = `
        SELECT 
          h.*,
          CASE 
            WHEN h.type = 'love' THEN l.content
            WHEN h.type = 'post' THEN p.content
          END as content,
          CASE 
            WHEN h.type = 'love' THEN u1.nickname
            WHEN h.type = 'post' THEN u2.nickname
          END as author,
          CASE 
            WHEN h.type = 'love' THEN u1.avatar
            WHEN h.type = 'post' THEN u2.avatar
          END as avatar
        FROM browse_history h
        LEFT JOIN love_words l ON h.target_id = l.id AND h.type = 'love'
        LEFT JOIN posts p ON h.target_id = p.id AND h.type = 'post'
        LEFT JOIN users u1 ON l.created_by = u1.id
        LEFT JOIN users u2 ON p.user_id = u2.id
        WHERE h.user_id = ?
        ORDER BY h.created_at DESC
        LIMIT ? OFFSET ?
      `;

      const [rows] = await db.execute(sql, [userId, parseInt(limit), offset]);
      
      success(res, {
        list: rows,
        hasMore: rows.length === parseInt(limit)
      });
    } catch (err) {
      console.error('获取浏览历史失败:', err);
      error(res, '获取浏览历史失败');
    }
  }

  // 添加浏览记录
  async addHistory(req, res) {
    try {
      const { id, type } = req.body;
      const userId = req.user.id;

      await db.execute(
        'INSERT INTO browse_history (user_id, type, target_id) VALUES (?, ?, ?)',
        [userId, type, id]
      );

      success(res);
    } catch (err) {
      console.error('添加浏览记录失败:', err);
      error(res, '添加浏览记录失败');
    }
  }

  // 清空浏览历史
  async clearHistory(req, res) {
    try {
      const userId = req.user.id;

      await db.execute(
        'DELETE FROM browse_history WHERE user_id = ?',
        [userId]
      );

      success(res);
    } catch (err) {
      console.error('清空浏览历史失败:', err);
      error(res, '清空浏览历史失败');
    }
  }
}

module.exports = new HistoryController(); 