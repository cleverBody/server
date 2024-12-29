const multer = require('multer');

module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  // 确保响应格式一致
  const errorResponse = {
    code: -1,
    message: err.message || '服务器内部错误'
  };

  if (err instanceof multer.MulterError) {
    return res.status(400).json(errorResponse);
  }

  res.status(500).json(errorResponse);
}; 