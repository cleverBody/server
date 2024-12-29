// 成功响应
exports.success = (res, data = null, message = 'success') => {
  res.json({
    code: 0,
    message,
    data
  });
};

// 错误响应
exports.error = (res, message = 'error', code = 500) => {
  res.status(code).json({
    code,
    message,
    data: null
  });
}; 