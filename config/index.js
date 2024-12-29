require('dotenv').config();

module.exports = {
  port: process.env.PORT || 300,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'tuweiqinghua',
    port: process.env.DB_PORT || 3306
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d'
  }
};
