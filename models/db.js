/**
 * 数据库连接模块
 * 提供统一的数据库连接管理和操作接口
 */
const mysql = require('mysql2/promise');
const config = require('../config');

/**
 * 数据库类
 * 封装MySQL连接池和数据库操作方法
 */
class Database {
  constructor() {
    this.pool = null; // 数据库连接池
  }

  /**
   * 初始化并连接到MySQL数据库
   * 使用配置文件中的数据库参数创建连接池
   * @returns {Promise<void>}
   * @throws {Error} 数据库连接失败时抛出错误
   */
  async connect() {
    try {
      this.pool = await mysql.createPool({
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        waitForConnections: true, // 当没有可用连接时等待，而不是立即抛出错误
        connectionLimit: 10,      // 最大连接数
        queueLimit: 0             // 队列中等待连接的最大请求数，0表示无限制
      });

      console.log('Database connected successfully');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }

  /**
   * 执行SQL查询并返回结果
   * @param {string} sql - SQL查询语句
   * @param {Array} params - 查询参数
   * @returns {Promise<Array>} 查询结果
   * @throws {Error} 数据库未连接或查询失败时抛出错误
   */
  async query(sql, params = []) {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool.query(sql, params);
  }

  /**
   * 执行SQL语句并返回结果
   * 与query方法类似，但更安全，适用于INSERT、UPDATE、DELETE等操作
   * @param {string} sql - SQL语句
   * @param {Array} params - 查询参数
   * @returns {Promise<Array>} 执行结果
   * @throws {Error} 数据库未连接或执行失败时抛出错误
   */
  async execute(sql, params = []) {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool.execute(sql, params);
  }

  /**
   * 获取数据库连接池实例
   * @returns {Object} 数据库连接池
   * @throws {Error} 数据库未连接时抛出错误
   */
  getPool() {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool;
  }
}

// 创建数据库实例
const db = new Database();

module.exports = db; 