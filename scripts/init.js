const fs = require('fs');
const path = require('path');

// 创建必要的目录
const dirs = [
  'public',
  'public/uploads'
];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    // 设置目录权限
    fs.chmodSync(dirPath, 0o755);
    console.log(`Created directory: ${dirPath}`);
  }
}); 