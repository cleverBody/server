const db = require('../models/db');
const fs = require('fs').promises;
const path = require('path');

async function initDatabase() {
  try {
    // 读取 schema.sql
    const schemaPath = path.join(__dirname, '../models/schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    // 读取 seed.sql
    const seedPath = path.join(__dirname, '../models/seed.sql');
    const seed = await fs.readFile(seedPath, 'utf8');

    console.log('开始初始化数据库...');

    // 执行建表语句
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (let stmt of statements) {
      if (stmt.trim()) {
        await db.execute(stmt);
      }
    }
    console.log('表结构创建完成');

    // 执行种子数据语句
    const seedStatements = seed.split(';').filter(stmt => stmt.trim());
    for (let stmt of seedStatements) {
      if (stmt.trim()) {
        await db.execute(stmt);
      }
    }
    console.log('测试数据插入完成');

    console.log('数据库初始化成功！');
    process.exit(0);
  } catch (err) {
    console.error('数据库初始化失败:', err);
    process.exit(1);
  }
}

initDatabase(); 