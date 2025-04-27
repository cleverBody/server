/**
 * 首页控制器模块
 * 处理应用首页相关的请求，包括推荐内容、分类列表等功能
 */
const db = require('../models/db');
const { success, error } = require('../utils/response');

/**
 * 首页控制器类
 * 提供首页各功能的实现方法
 */
class HomeController {
  /**
   * 获取每日推荐情话
   * 随机返回一条情话内容
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} res - Express响应对象
   * @returns {Object} 返回随机推荐的情话内容
   */
  async getDailyRecommend(req, res) {
    try {
      const pool = db.getPool();
      const [rows] = await pool.execute(`
        SELECT 
          l.id,
          l.content,
          l.author,
          l.category_id,
          l.likes,
          CASE WHEN ul.id IS NOT NULL THEN 1 ELSE 0 END as isLiked
        FROM love_words l
        LEFT JOIN user_likes ul ON l.id = ul.target_id 
          AND ul.user_id = ?
        ORDER BY RAND()
        LIMIT 1
      `, [req.user?.id || '']);

      success(res, rows[0]);
    } catch (err) {
      console.error('获取每日推荐失败:', err);
      error(res, '获取推荐失败');
    }
  }

  /**
   * 获取情话分类列表
   * 返回所有分类及其包含的情话数量
   * 
   * @param {Object} req - Express请求对象
   * @param {Object} res - Express响应对象
   * @returns {Array} 返回分类列表数组
   */
  async getCategories(req, res) {
    try {
      // 禁用缓存
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const pool = db.getPool();
      // 查询所有分类并统计每个分类下的情话数量
      const [rows] = await pool.execute(`
        SELECT 
          c.id,
          c.name,
          c.description,
          c.image,
          COUNT(l.id) as count
        FROM categories c
        LEFT JOIN love_words l ON c.id = l.category_id
        GROUP BY c.id
        ORDER BY count DESC
      `);

      // 为没有图片的分类添加默认图片
      const categories = rows.map(category => ({
        ...category,
        image: category.image || '/assets/images/category-default.jpg'
      }));

      success(res, categories);
    } catch (err) {
      console.error('获取分类失败:', err);
      error(res, '获取分类失败');
    }
  }

  /**
   * 获取推荐情话列表
   * 支持分页，返回情话列表及分页信息
   * 
   * @param {Object} req - Express请求对象，包含分页参数
   * @param {Object} res - Express响应对象
   * @returns {Object} 返回情话列表、总数和是否有更多数据
   */
  async getRecommendations(req, res) {
    try {
      const pool = db.getPool();
      // 解析分页参数
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // 查询情话列表，包含分类、用户、点赞和评论信息
      const [rows] = await pool.query(
        `SELECT 
          l.id,
          l.content,
          l.author,
          c.name as category,
          l.likes,
          l.created_at,
          u.avatar,
          u.nickname as author_name,
          CASE WHEN ul.id IS NOT NULL THEN 1 ELSE 0 END as isLiked,
          (SELECT COUNT(*) FROM comments WHERE target_id = l.id) as comments
        FROM love_words l
        LEFT JOIN categories c ON l.category_id = c.id
        LEFT JOIN users u ON l.user_id = u.id
        LEFT JOIN user_likes ul ON l.id = ul.target_id AND ul.user_id = ?
        WHERE l.status = 1
        ORDER BY l.likes DESC, l.created_at DESC
        LIMIT ?, ?`,
        [req.user?.id || '', offset, limit]
      );

      // 获取总记录数用于分页
      const [totalResult] = await pool.query(
        'SELECT COUNT(*) as total FROM love_words WHERE status = 1'
      );
      const total = totalResult[0].total;

      // 处理数据，设置默认值和格式化时间
      const list = rows.map(item => ({
        ...item,
        avatar: item.avatar || '/assets/images/default-avatar.png',
        author_name: item.author_name || '佚名',
        created_at: new Date(item.created_at).toISOString()
      }));

      // 返回结果，包含列表、总数和是否有更多数据
      success(res, {
        list,
        total,
        hasMore: offset + rows.length < total
      });
    } catch (err) {
      console.error('获取推荐列表失败:', err);
      error(res, '获取推荐列表失败');
    }
  }

  /**
   * AI生成情话
   * 根据用户提供的提示生成情话内容
   * 
   * @param {Object} req - Express请求对象，包含生成提示
   * @param {Object} res - Express响应对象
   * @returns {Object} 返回生成的情话内容
   */
  async generateLoveWords(req, res) {
    try {
      const { prompt } = req.body;
      // 这里可以接入实际的 AI 服务
      const content = await aiService.generate(prompt);

      success(res, { content });
    } catch (err) {
      console.error('AI生成失败:', err);
      error(res, 'AI生成失败');
    }
  }

  /**
   * 处理用户收藏
   * 将指定内容添加到用户收藏列表
   * 
   * @param {Object} req - Express请求对象，包含收藏目标ID和类型
   * @param {Object} res - Express响应对象
   * @returns {Object} 返回收藏结果
   */
  async handleCollect(req, res) {
    try {
      const { id, type } = req.body;
      const userId = req.user.id;

      // 添加收藏记录
      await db.execute(
        'INSERT INTO user_collections (user_id, type, target_id) VALUES (?, ?, ?)',
        [userId, type, id]
      );

      success(res);
    } catch (err) {
      console.error('收藏失败:', err);
      error(res, '收藏失败');
    }
  }

  /**
   * 处理用户点赞
   * 为指定内容添加点赞记录
   * 
   * @param {Object} req - Express请求对象，包含点赞目标ID和类型
   * @param {Object} res - Express响应对象
   * @returns {Object} 返回点赞结果
   */
  async handleLike(req, res) {
    try {
      const { id, type } = req.body;
      const userId = req.user.id;

      // 添加点赞记录
      await db.execute(
        'INSERT INTO user_likes (user_id, type, target_id) VALUES (?, ?, ?)',
        [userId, type, id]
      );

      success(res);
    } catch (err) {
      console.error('点赞失败:', err);
      error(res, '点赞失败');
    }
  }
}

module.exports = new HomeController();
