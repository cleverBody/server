const db = require('./db');

class User {
  static async findByOpenid(openid) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE openid = ?',
      [openid]
    );
    return rows[0];
  }

  static async create(userData) {
    const { openid, nickname, avatar } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (openid, nickname, avatar) VALUES (?, ?, ?)',
      [openid, nickname, avatar]
    );
    return result.insertId;
  }

  static async updateLastLogin(id) {
    await db.execute(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  }

  static async updateSettings(id, settings) {
    const { dailyPush, theme } = settings;
    await db.execute(
      'UPDATE users SET daily_push = ?, theme = ? WHERE id = ?',
      [dailyPush, theme, id]
    );
  }
}

module.exports = User; 