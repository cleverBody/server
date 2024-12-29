const LoveWord = require('../models/loveWord');
const { success, error } = require('../utils/response');

class GeneratorController {
  // 随机生成情话
  async generateRandom(req, res) {
    try {
      // 获取情话模板
      const templates = [
        '遇见你是我最美丽的意外，${name}',
        '你知道${name}和星星有什么区别吗？星星在天上，你在我心里',
        '如果${name}是一首诗，我愿意做最忠实的读者',
        '${name}，你是我平淡生活里的一抹惊喜',
        '我想把${name}写进诗里，但又怕诗的浪漫不及你万分之一'
      ];

      // 随机选择一个模板
      const template = templates[Math.floor(Math.random() * templates.length)];

      // 生成情话
      const loveWord = template.replace('${name}', '你');

      success(res, { content: loveWord });
    } catch (err) {
      error(res, err.message);
    }
  }

  // 个性化生成情话
  async generateCustom(req, res) {
    try {
      const { name, keywords = [] } = req.body;

      // 基于关键词的情话模板
      const keywordTemplates = {
        sweet: [
          `${name}，你是我所有美好故事的开始`,
          `遇见${name}的那一刻，我才知道什么叫${keywords[0] || '心动'}`,
          `你说${keywords[0] || '星星'}很美，但在我眼里，${name}更美`
        ],
        romantic: [
          `如果${keywords[0] || '爱情'}是一首诗，那${name}就是最美的诗句`,
          `${name}，你是${keywords[0] || '四季'}里最美的风景`,
          `愿用${keywords[0] || '三生'}烟火，换${name}一世迷离`
        ],
        funny: [
          `${name}，你知道你和${keywords[0] || '月亮'}的区别吗？月亮在天上，你在我心里`,
          `我想把${keywords[0] || '喜欢'}写成一首歌，把${name}唱进我的生活`,
          `如果把${name}比作${keywords[0] || '甜甜圈'}，那我就是那个最中意的馅儿`
        ]
      };

      // 随机选择一个类型
      const types = Object.keys(keywordTemplates);
      const randomType = types[Math.floor(Math.random() * types.length)];

      // 从选中类型中随机选择一个模板
      const templates = keywordTemplates[randomType];
      const template = templates[Math.floor(Math.random() * templates.length)];

      // 保存生成的情话
      const [result] = await LoveWord.execute(
        'INSERT INTO love_words (content, category, created_by) VALUES (?, ?, ?)',
        [template, randomType, req.user?.id || null]
      );

      success(res, {
        id: result.insertId,
        content: template,
        category: randomType
      });
    } catch (err) {
      error(res, err.message);
    }
  }

  // 获取生成历史
  async getHistory(req, res) {
    try {
      const { user_id } = req.query;
      const [rows] = await LoveWord.execute(
        `SELECT * FROM love_words 
         WHERE created_by = ? 
         ORDER BY created_at DESC 
         LIMIT 10`,
        [user_id]
      );
      
      success(res, rows);
    } catch (err) {
      error(res, err.message);
    }
  }

  // 保存生成的情话
  async save(req, res) {
    try {
      const { content, category = 'sweet' } = req.body;
      const user_id = req.user?.id;

      const [result] = await LoveWord.execute(
        'INSERT INTO love_words (content, category, created_by) VALUES (?, ?, ?)',
        [content, category, user_id]
      );

      success(res, {
        id: result.insertId,
        content,
        category
      });
    } catch (err) {
      error(res, err.message);
    }
  }
}

module.exports = new GeneratorController(); 