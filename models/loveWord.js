const db = require('./db');

class LoveWord {
  static async execute(sql, params = []) {
    try {
      const sanitizedParams = params.map(param => {
        if (typeof param === 'number') {
          return parseInt(param, 10);
        }
        return param;
      });

      const [rows] = await db.query(sql, sanitizedParams);
      return rows;
    } catch (err) {
      console.error('SQL Error:', err);
      console.error('SQL:', sql);
      console.error('Params:', params);
      throw err;
    }
  }

  // 获取情话列表
  static async findAll({ category = null, page = 1, limit = 10 }) {
    const offset = parseInt((page - 1) * limit, 10);
    const pageSize = parseInt(limit, 10);

    let sql = `
      SELECT 
        lw.*,
        (SELECT COUNT(*) FROM user_likes WHERE love_word_id = lw.id) as like_count,
        (SELECT COUNT(*) FROM user_collections WHERE love_word_id = lw.id) as collection_count
      FROM love_words lw
    `;

    const params = [];

    if (category) {
      sql += ' WHERE lw.category = ?';
      params.push(category);
    }

    sql += ` ORDER BY lw.created_at DESC LIMIT ?, ?`;
    params.push(offset, pageSize);

    const rows = await this.execute(sql, params);

    return rows.map(row => ({
      ...row,
      is_liked: false,
      is_collected: false,
      icons: {
        like: '/assets/icons/点赞.png',
        like_active: '/assets/icons/点赞选中.png',
        collect: '/assets/icons/收藏.png',
        collect_active: '/assets/icons/收藏选中.png'
      }
    }));
  }

  // 根据ID查找
  static async findById(id) {
    const sql = `
      SELECT 
        lw.*,
        (SELECT COUNT(*) FROM user_likes WHERE love_word_id = lw.id) as like_count,
        (SELECT COUNT(*) FROM user_collections WHERE love_word_id = lw.id) as collection_count
      FROM love_words lw
      WHERE lw.id = ?
    `;

    const rows = await this.execute(sql, [id]);
    const row = rows[0];

    if (row) {
      return {
        ...row,
        is_liked: false,
        is_collected: false
      };
    }

    return null;
  }

  // 搜索情话
  static async search(keyword) {
    const sql = `
      SELECT 
        lw.*,
        (SELECT COUNT(*) FROM user_likes WHERE love_word_id = lw.id) as like_count,
        (SELECT COUNT(*) FROM user_collections WHERE love_word_id = lw.id) as collection_count
      FROM love_words lw
      WHERE lw.content LIKE ?
      ORDER BY lw.created_at DESC
      LIMIT 20
    `;

    const rows = await this.execute(sql, [`%${keyword}%`]);

    return rows.map(row => ({
      ...row,
      is_liked: false,
      is_collected: false
    }));
  }

  // 点赞
  static async like(userId, loveWordId) {
    const sql = 'INSERT INTO user_likes (user_id, love_word_id) VALUES (?, ?)';
    return await this.execute(sql, [userId, loveWordId]);
  }

  // 收藏
  static async collect(userId, loveWordId) {
    const sql = 'INSERT INTO user_collections (user_id, love_word_id) VALUES (?, ?)';
    return await this.execute(sql, [userId, loveWordId]);
  }
}

module.exports = LoveWord;
