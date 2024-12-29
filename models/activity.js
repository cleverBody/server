const db = require('./db');

class Activity {
  // 创建活动
  static async create(data) {
    const { title, description, banner, start_time, end_time } = data;
    const [result] = await db.execute(
      'INSERT INTO activities (title, description, banner, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, banner, start_time, end_time, 'upcoming']
    );
    return result.insertId;
  }

  // 获取活动列表
  static async findAll(status, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await db.execute(
      'SELECT * FROM activities WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [status, limit, offset]
    );
    return rows;
  }

  // 获取活动详情（包括奖励信息）
  static async findById(id) {
    const [activities] = await db.execute(
      'SELECT * FROM activities WHERE id = ?',
      [id]
    );
    if (!activities[0]) return null;

    const [rewards] = await db.execute(
      'SELECT * FROM activity_rewards WHERE activity_id = ?',
      [id]
    );

    return {
      ...activities[0],
      rewards
    };
  }

  // 更新活动状态
  static async updateStatus(id, status) {
    await db.execute(
      'UPDATE activities SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  // 增加参与人数
  static async incrementParticipants(id) {
    await db.execute(
      'UPDATE activities SET participants = participants + 1 WHERE id = ?',
      [id]
    );
  }
}

module.exports = Activity; 