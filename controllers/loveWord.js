const db = require('../models/db');
const { success, error } = require('../utils/response');

// 获取情话列表
exports.getLoveWords = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user?.id;

    let sql = `
      SELECT 
        l.*,
        IF(uc.id IS NOT NULL, 1, 0) as is_collected,
        IF(ul.id IS NOT NULL, 1, 0) as is_liked
      FROM love_words l
      LEFT JOIN user_collections uc ON l.id = uc.target_id 
        AND uc.type = 'love' AND uc.user_id = ?
      LEFT JOIN user_likes ul ON l.id = ul.target_id 
        AND ul.type = 'love' AND ul.user_id = ?
    `;

    const params = [userId, userId];

    if (category && category !== 'all') {
      sql += ' WHERE l.category = ?';
      params.push(category);
    }

    sql += ' ORDER BY RAND()';
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await db.execute(sql, params);
    success(res, rows);
  } catch (err) {
    console.error('获取情话列表失败:', err);
    error(res, '获取情话列表失败');
  }
};

// 获取每日推送
exports.getDailyPush = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 检查今日是否已有推送
    let [dailyPush] = await db.query(`
      SELECT 
        dp.*,
        lw.content,
        lw.author,
        lw.category
      FROM daily_pushes dp
      LEFT JOIN love_words lw ON dp.love_word_id = lw.id
      WHERE dp.push_date = ?
    `, [today]);

    if (!dailyPush) {
      // 随机选择一条情话作为今日推送
      const [randomLoveWord] = await db.query(
        'SELECT * FROM love_words ORDER BY RAND() LIMIT 1'
      );

      if (!randomLoveWord) {
        return error(res, '暂无可用的情话');
      }

      // 保存今日推送
      const result = await db.query(
        'INSERT INTO daily_pushes (love_word_id, push_date) VALUES (?, ?)',
        [randomLoveWord.id, today]
      );

      dailyPush = {
        id: result.insertId,
        push_date: today,
        love_word_id: randomLoveWord.id,
        content: randomLoveWord.content,
        author: randomLoveWord.author,
        category: randomLoveWord.category
      };
    }

    // 设置响应头，禁用缓存
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    success(res, dailyPush);
  } catch (err) {
    console.error('获取每日推送失败:', err);
    error(res, '获取每日推送失败');
  }
};

// 点赞情话
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 检查情话是否存在
    const [loveWord] = await db.query(
      'SELECT id FROM love_words WHERE id = ?',
      [id]
    );
    if (!loveWord) {
      return error(res, '情话不存在');
    }

    // 检查是否已点赞
    const [like] = await db.query(
      'SELECT id FROM user_likes WHERE user_id = ? AND love_word_id = ?',
      [userId, id]
    );

    if (like) {
      // 取消点赞
      await db.query(
        'DELETE FROM user_likes WHERE user_id = ? AND love_word_id = ?',
        [userId, id]
      );
      await db.query(
        'UPDATE love_words SET likes = likes - 1 WHERE id = ?',
        [id]
      );
    } else {
      // 添加点赞
      await db.query(
        'INSERT INTO user_likes (user_id, love_word_id) VALUES (?, ?)',
        [userId, id]
      );
      await db.query(
        'UPDATE love_words SET likes = likes + 1 WHERE id = ?',
        [id]
      );
    }

    success(res);
  } catch (err) {
    console.error('点赞操作失败:', err);
    error(res, '操作失败');
  }
};

// 收藏情话
exports.toggleCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 检查情话是否存在
    const [loveWord] = await db.query(
      'SELECT id FROM love_words WHERE id = ?',
      [id]
    );
    if (!loveWord) {
      return error(res, '情话不存在');
    }

    // 检查是否已收藏
    const [collection] = await db.query(
      'SELECT id FROM user_collections WHERE user_id = ? AND love_word_id = ?',
      [userId, id]
    );

    if (collection) {
      // 取消收藏
      await db.query(
        'DELETE FROM user_collections WHERE user_id = ? AND love_word_id = ?',
        [userId, id]
      );
      await db.query(
        'UPDATE love_words SET collections = collections - 1 WHERE id = ?',
        [id]
      );
    } else {
      // 添加收藏
      await db.query(
        'INSERT INTO user_collections (user_id, love_word_id) VALUES (?, ?)',
        [userId, id]
      );
      await db.query(
        'UPDATE love_words SET collections = collections + 1 WHERE id = ?',
        [id]
      );
    }

    success(res);
  } catch (err) {
    console.error('收藏操作失败:', err);
    error(res, '操作失败');
  }
};

// 获取情话分类
exports.getCategories = async (req, res) => {
  try {
    const sql = `
      SELECT 
        category,
        COUNT(*) as count,
        MIN(id) as sample_id,
        (
          SELECT content 
          FROM love_words 
          WHERE category = l.category 
          ORDER BY RAND() 
          LIMIT 1
        ) as sample_content
      FROM love_words l
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `;

    const categories = await db.query(sql);

    // 设置响应头，禁用缓存
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    success(res, categories);
  } catch (err) {
    console.error('获取分类失败:', err);
    error(res, '获取分类失败');
  }
};
