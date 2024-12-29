const mysql = require('mysql2/promise');
const config = require('../config');

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    try {
      this.pool = await mysql.createPool({
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      console.log('Database connected successfully');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }

  async query(sql, params = []) {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool.query(sql, params);
  }

  async execute(sql, params = []) {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool.execute(sql, params);
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