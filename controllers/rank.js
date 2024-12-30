const db = require('../models/db');
const { success, error } = require('../utils/response');

class RankController {
  // 获取排行榜
  async getRankList(req, res) {
    try {
      // 禁用缓存
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const { type = 'daily' } = req.query;
      
      // 根据类型确定时间范围
      let timeRange = '';
      if (type === 'daily') {
        timeRange = 'DATE(l.created_at) = CURDATE()';
      } else if (type === 'weekly') {
        timeRange = 'YEARWEEK(l.created_at) = YEARWEEK(NOW())';
      } else if (type === 'monthly') {
        timeRange = 'DATE_FORMAT(l.created_at, "%Y-%m") = DATE_FORMAT(NOW(), "%Y-%m")';
      }

      const sql = `
        SELECT 
          l.id,
          l.content,
          COALESCE(u.nickname, l.author, '佚名') as author,
          COALESCE(u.avatar, '/assets/images/default-avatar.png') as avatar,
          COUNT(DISTINCT CASE WHEN ul.type = 'love' THEN ul.id END) as like_count,
          COUNT(DISTINCT CASE WHEN uc.type = 'love' THEN uc.id END) as collect_count
        FROM love_words l
        LEFT JOIN users u ON l.user_id = u.id
        LEFT JOIN user_likes ul ON l.id = ul.target_id
        LEFT JOIN user_collections uc ON l.id = uc.target_id
        WHERE ${timeRange}
        GROUP BY l.id, l.content, u.nickname, l.author, u.avatar
        ORDER BY like_count DESC, collect_count DESC
        LIMIT 50
      `;

      const [rows] = await db.query(sql);
      
      success(res, rows);
    } catch (err) {
      console.error('获取排行榜失败:', err);
      error(res, '获取排行榜失败');
    }
  }
}

module.exports = new RankController();
