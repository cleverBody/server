const app = require('./app');
const config = require('./config');

const PORT = config.port || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`
    🚀 Server is running!
    🔉 Listening on port ${PORT}
    📭 API endpoint: http://localhost:${PORT}/api
    🔧 Environment: ${process.env.NODE_ENV || 'prod'}
  `);
});
