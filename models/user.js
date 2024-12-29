const db = require('./db');

class User {
  static async findByOpenid(openid) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE openid = ?',
      [openid]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
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

  static async update(id, userData) {
    const { nickname, avatar } = userData;
    await db.execute(
      'UPDATE users SET nickname = ?, avatar = ? WHERE id = ?',
      [nickname, avatar, id]
    );
  }
}

module.exports = User; 