const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadFile } = require('../controllers/upload');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只能上传图片文件!'), false);
  }
};

// 创建 multer 实例
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 9
  }
}).single('file'); // 直接在这里配置 single

// 上传路由
router.post('/', (req, res, next) => {
  console.log('收到上传请求:', {
    headers: req.headers,
    body: req.body
  });

  upload(req, res, (err) => {
    if (err) {
      console.error('Multer 错误:', {
        error: err,
        message: err.message,
        code: err.code,
        field: err.field
      });
      
      return res.status(400).json({
        code: -1,
        message: err.message || '文件上传失败'
      });
    }
    
    if (!req.file) {
      console.error('未接收到文件');
      return res.status(400).json({
        code: -1,
        message: '未接收到文件'
      });
    }
    
    console.log('文件上传成功:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    next();
  });
}, uploadFile);

module.exports = router; 