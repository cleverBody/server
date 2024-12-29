const path = require('path');
const fs = require('fs');
const { success, error } = require('../utils/response');

exports.uploadFile = (req, res) => {
  try {
    const filePath = req.file.path;
    
    // 验证文件是否成功保存
    if (!fs.existsSync(filePath)) {
      console.error('文件未保存:', {
        path: filePath,
        file: req.file
      });
      throw new Error('文件保存失败');
    }

    // 返回相对路径
    const url = `/uploads/${path.basename(filePath)}`;
    
    // 打印调试信息
    console.log('处理上传文件:', {
      originalPath: filePath,
      publicUrl: url,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    // 发送响应
    const response = {
      code: 0,
      message: 'success',
      data: { url }
    };
    
    console.log('发送响应:', response);
    res.json(response);
  } catch (err) {
    console.error('上传处理失败:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
    
    res.status(500).json({
      code: -1,
      message: err.message || '文件上传失败'
    });
  }
}; 