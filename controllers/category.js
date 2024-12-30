const db = require('../models/db');
const { success, error } = require('../utils/response');

class CategoryController {
  // 获取分类列表
  async getCategories(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.*,
          COUNT(l.id) as count
        FROM categories c
        LEFT JOIN love_words l ON c.id = l.category_id
        GROUP BY c.id
        ORDER BY c.id ASC
      `);

      success(res, rows);
    } catch (err) {
      console.error('获取分类列表失败:', err);
      error(res, '获取分类列表失败');
    }
  }

  // 获取分类详情
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await db.query(`
        SELECT 
          c.*,
          COUNT(l.id) as count
        FROM categories c
        LEFT JOIN love_words l ON c.id = l.category_id
        WHERE c.id = ?
        GROUP BY c.id
      `, [id]);

      if (rows.length === 0) {
        return error(res, '分类不存在');
      }

      success(res, rows[0]);
    } catch (err) {
      console.error('获取分类详情失败:', err);
      error(res, '获取分类详情失败');
    }
  }
}

module.exports = new CategoryController(); 