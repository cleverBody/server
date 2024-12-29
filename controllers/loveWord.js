const db = require('../models/db');
const { success, error } = require('../utils/response');

class LoveWordController {
  // 获取情话列表
  async getLoveWords(req, res) {
    try {
      const { category, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const userId = req.user?.id;

      let sql = `
        SELECT 
          l.id,
          l.content,
          l.created_at,
          l.category_id,
          u.nickname as author,
          u.avatar,
          COUNT(DISTINCT ul.id) as like_count,
          COUNT(DISTINCT uc.id) as collect_count,
          MAX(CASE WHEN ul2.id IS NOT NULL THEN 1 ELSE 0 END) as is_liked,
          MAX(CASE WHEN uc2.id IS NOT NULL THEN 1 ELSE 0 END) as is_collected
        FROM love_words l
        LEFT JOIN users u ON l.user_id = u.id
        LEFT JOIN user_likes ul ON l.id = ul.target_id AND ul.type = 'love'
        LEFT JOIN user_collections uc ON l.id = uc.target_id AND uc.type = 'love'
        LEFT JOIN user_likes ul2 ON l.id = ul2.target_id AND ul2.type = 'love' AND ul2.user_id = ?
        LEFT JOIN user_collections uc2 ON l.id = uc2.target_id AND uc2.type = 'love' AND uc2.user_id = ?
      `;

      const params = [userId || 0, userId || 0];

      if (category) {
        sql += ' WHERE l.category_id = ?';
        params.push(category);
      }

      sql += ` GROUP BY l.id, l.content, l.created_at, l.category_id, u.nickname, u.avatar
              ORDER BY l.created_at DESC
              LIMIT ? OFFSET ?`;
      
      params.push(parseInt(limit), offset);

      const [rows] = await db.query(sql, params);

      success(res, {
        list: rows,
        hasMore: rows.length === parseInt(limit)
      });
    } catch (err) {
      console.error('获取情话列表失败:', err);
      error(res, '获取情话列表失败');
    }
  }

  // 获取情话详情
  async getLoveWordById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const [rows] = await db.query(`
        SELECT 
          l.*,
          u.nickname as author,
          u.avatar,
          COUNT(DISTINCT CASE WHEN ul.type = 'love' THEN ul.id END) as like_count,
          COUNT(DISTINCT CASE WHEN uc.type = 'love' THEN uc.id END) as collect_count,
          IF(ul2.id IS NOT NULL, 1, 0) as is_liked,
          IF(uc2.id IS NOT NULL, 1, 0) as is_collected
        FROM love_words l
        LEFT JOIN users u ON l.user_id = u.id
        LEFT JOIN user_likes ul ON l.id = ul.target_id AND ul.type = 'love'
        LEFT JOIN user_collections uc ON l.id = uc.target_id AND uc.type = 'love'
        LEFT JOIN user_likes ul2 ON l.id = ul2.target_id AND ul2.type = 'love' AND ul2.user_id = ?
        LEFT JOIN user_collections uc2 ON l.id = uc2.target_id AND uc2.type = 'love' AND uc2.user_id = ?
        WHERE l.id = ?
        GROUP BY l.id
      `, [userId || 0, userId || 0, id]);

      if (rows.length === 0) {
        return error(res, '情话不存在');
      }

      success(res, rows[0]);
    } catch (err) {
      console.error('获取情话详情失败:', err);
      error(res, '获取情话详情失败');
    }
  }

  // 点赞情话
  async handleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await db.execute(
        'INSERT INTO user_likes (user_id, type, target_id) VALUES (?, ?, ?)',
        [userId, 'love', id]
      );

      success(res);
    } catch (err) {
      console.error('点赞失败:', err);
      error(res, '点赞失败');
    }
  }

  // 收藏情话
  async handleCollect(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await db.execute(
        'INSERT INTO user_collections (user_id, type, target_id) VALUES (?, ?, ?)',
        [userId, 'love', id]
      );

      success(res);
    } catch (err) {
      console.error('收藏失败:', err);
      error(res, '收藏失败');
    }
  }
}

module.exports = new LoveWordController();
