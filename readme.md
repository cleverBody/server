# 图微情话服务端

图微情话是一个提供情话内容分享、收藏和生成的微信小程序后端服务。本项目使用 Node.js 和 Express 框架构建，提供完整的 RESTful API 接口。

## 项目功能

- 用户管理：微信登录、个人信息获取与更新
- 情话内容：分类浏览、每日推荐、热门排行
- 互动功能：点赞、收藏、评论
- AI生成：基于用户提示生成个性化情话内容
- 历史记录：用户浏览记录管理
- 内容管理：用户发布内容审核与管理

## 技术栈

- **Node.js**: 运行环境
- **Express**: Web 应用框架
- **MySQL**: 数据库
- **JWT**: 用户认证
- **dotenv**: 环境变量管理
- **axios**: HTTP 客户端
- **cors**: 跨域资源共享处理
- **morgan**: HTTP 请求日志记录

## 安装与运行

### 环境要求

- Node.js >= 14.x
- MySQL >= 5.7

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/tuweiqinghua-server.git
cd tuweiqinghua-server
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```
编辑 `.env` 文件，填写相关配置信息。

4. 初始化数据库
```bash
npm run init
```

5. 运行服务
```bash
# 开发环境
npm run dev

# 生产环境
npm start
```

## API 文档

### 认证相关

- `POST /api/auth/login`: 微信小程序登录
- `GET /api/auth/user`: 获取当前用户信息

### 首页相关

- `GET /api/home/daily`: 获取每日推荐情话
- `GET /api/home/categories`: 获取情话分类列表
- `GET /api/home/recommendations`: 获取推荐情话列表
- `POST /api/home/like`: 点赞情话
- `POST /api/home/collect`: 收藏情话
- `POST /api/home/generate`: AI生成情话

### 内容相关

- `GET /api/love-words`: 获取情话列表
- `GET /api/love-words/:id`: 获取情话详情
- `POST /api/love-words`: 创建新情话
- `GET /api/categories`: 获取所有分类
- `GET /api/posts`: 获取社区帖子列表
- `GET /api/posts/:id`: 获取帖子详情
- `POST /api/posts`: 发布新帖子

### 用户中心

- `GET /api/user/profile`: 获取个人资料
- `PUT /api/user/profile`: 更新个人资料
- `GET /api/collections`: 获取收藏列表
- `GET /api/history`: 获取历史记录

## 项目结构

```
.
├── app.js              # 应用入口配置
├── config/             # 配置文件目录
├── controllers/        # 业务逻辑控制器
├── middleware/         # 中间件
├── models/             # 数据模型
├── routes/             # 路由定义
├── scripts/            # 脚本工具
├── sql/                # SQL脚本
├── tests/              # 测试文件
├── utils/              # 工具函数
└── public/             # 静态资源目录
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证，详情请参阅 [LICENSE](LICENSE) 文件。

## 联系方式

如有问题或建议，请提交 issue 或联系开发团队。
