/**
 * 用户模型
 * 封装用户相关的数据库操作
 */
const db = require('./db');

/**
 * 用户类
 * 提供用户增删改查的静态方法
 */
class User {
  /**
   * 根据微信OpenID查找用户
   * 
   * @param {string} openid - 微信提供的用户唯一标识
   * @returns {Promise<Object|null>} 返回用户对象，如果不存在则返回null
   */
  static async findByOpenid(openid) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE openid = ?',
      [openid]
    );
    return rows[0];
  }

  /**
   * 根据用户ID查找用户
   * 
   * @param {number} id - 用户ID
   * @returns {Promise<Object|null>} 返回用户对象，如果不存在则返回null
   */
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  /**
   * 创建新用户
   * 
   * @param {Object} userData - 用户数据对象
   * @param {string} userData.openid - 微信OpenID
   * @param {string} userData.nickname - 用户昵称
   * @param {string} userData.avatar - 用户头像URL
   * @returns {Promise<number>} 返回新创建用户的ID
   */
  static async create(userData) {
    const { openid, nickname, avatar } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (openid, nickname, avatar) VALUES (?, ?, ?)',
      [openid, nickname, avatar]
    );
    return result.insertId;
  }

  /**
   * 更新用户信息
   * 
   * @param {number} id - 用户ID
   * @param {Object} userData - 用户更新数据
   * @param {string} userData.nickname - 用户昵称
   * @param {string} userData.avatar - 用户头像URL
   * @returns {Promise<void>}
   */
  static async update(id, userData) {
    const { nickname, avatar } = userData;
    await db.execute(
      'UPDATE users SET nickname = ?, avatar = ? WHERE id = ?',
      [nickname, avatar, id]
    );
  }
}

module.exports = User; 