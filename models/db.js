const mysql = require('mysql2/promise');
const config = require('../config');

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    try {
      this.pool = mysql.createPool({
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        port: config.db.port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // 测试连接
      const connection = await this.pool.getConnection();
      console.log('✅ Database connected successfully');
      connection.release();

      return this.pool;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  getPool() {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool;
  }
}

const db = new Database();

module.exports = db; 