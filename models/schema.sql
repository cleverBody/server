-- 删除现有表(注意顺序,先删除有外键依赖的表)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS daily_pushes;
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS user_follows;
DROP TABLE IF EXISTS activity_participants;
DROP TABLE IF EXISTS activity_rewards;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS user_collections;
DROP TABLE IF EXISTS user_likes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS love_words;
DROP TABLE IF EXISTS users;

-- 用户表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(64) UNIQUE,
  nickname VARCHAR(32),
  avatar VARCHAR(255),
  gender TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL,
  description VARCHAR(255),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 情话表
CREATE TABLE love_words (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content TEXT NOT NULL,
  author VARCHAR(32),
  category_id INT,
  user_id INT,
  likes INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 评论表
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  love_word_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (love_word_id) REFERENCES love_words(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 用户点赞表
CREATE TABLE user_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('love', 'post') NOT NULL,
  target_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 用户收藏表
CREATE TABLE user_collections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('love', 'post') NOT NULL,
  target_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 插入一些测试数据
INSERT INTO categories (name, description) VALUES 
('甜蜜', '温馨浪漫的情话'),
('搞笑', '幽默有趣的情话'),
('文艺', '优美文艺的情话'),
('表白', '真挚动人的表白');

INSERT INTO love_words (content, author, category_id) VALUES 
('遇见你，是我最美的情话', '情话小王子', 1),
('你是我最想写的诗', '文艺青年', 3),
('你是我的小呀小苹果', '开心果', 2),
('我想牵着你的手，走过春夏秋冬', '浪漫派', 4);

-- 活动表
CREATE TABLE activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  banner VARCHAR(255),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status ENUM('upcoming', 'ongoing', 'ended') NOT NULL,
  participants INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 活动奖励表
CREATE TABLE activity_rewards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  activity_id INT NOT NULL,
  reward_rank VARCHAR(50) NOT NULL,
  prize VARCHAR(200) NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES activities(id)
);

-- 活动参与记录表
CREATE TABLE activity_participants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  activity_id INT NOT NULL,
  user_id INT NOT NULL,
  score INT DEFAULT 0,
  participant_rank INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (activity_id) REFERENCES activities(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_participant (activity_id, user_id)
);

-- 社区帖子表
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 帖子点赞表
CREATE TABLE post_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  UNIQUE KEY unique_post_like (user_id, post_id)
);

-- 帖子评论表
CREATE TABLE post_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- 用户关注表
CREATE TABLE user_follows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  follower_id INT NOT NULL,
  followed_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (followed_id) REFERENCES users(id),
  UNIQUE KEY unique_follow (follower_id, followed_id)
);

-- 每日推送记录表
CREATE TABLE daily_pushes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  love_word_id INT NOT NULL,
  push_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (love_word_id) REFERENCES love_words(id),
  UNIQUE KEY unique_daily_push (push_date)
);

-- 用户反馈表
CREATE TABLE feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('bug', 'suggestion', 'other') NOT NULL,
  content TEXT NOT NULL,
  status ENUM('pending', 'processing', 'resolved') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 系统通知表
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('system', 'activity', 'interaction') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 点赞表
CREATE TABLE likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- 关注表
CREATE TABLE follows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  follower_id INT NOT NULL,
  followed_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_follow (follower_id, followed_id),
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (followed_id) REFERENCES users(id)
);

-- 修改 user_collections 表结构
ALTER TABLE user_collections ADD COLUMN post_id INT;
ALTER TABLE user_collections ADD FOREIGN KEY (post_id) REFERENCES posts(id);

-- 添加生成器历史记录表
CREATE TABLE IF NOT EXISTS generator_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  prompt TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_category ON love_words(category);
CREATE INDEX idx_push_date ON daily_pushes(push_date); 

-- 添加标签表
CREATE TABLE tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL,
  count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加情话-标签关联表
CREATE TABLE love_word_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  love_word_id INT NOT NULL,
  tag_id INT NOT NULL,
  FOREIGN KEY (love_word_id) REFERENCES love_words(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- 浏览历史表
CREATE TABLE browse_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('love', 'post') NOT NULL,
  target_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);