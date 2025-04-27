/**
 * 服务器入口文件
 * 负责初始化和启动Express服务器
 */
const app = require('./app');
const config = require('./config');

// 定义服务器监听端口，优先使用配置中的端口，默认为3000
const PORT = config.port || 3000;

/**
 * 启动Express服务器实例
 * 监听指定端口并输出服务器状态信息
 */
app.listen(PORT, () => {
  console.log(`
    🚀 Server is running!
    🔉 Listening on port ${PORT}
    📭 API endpoint: http://localhost:${PORT}/api
    🔧 Environment: ${process.env.NODE_ENV || 'prod'}
  `);
});
