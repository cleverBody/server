-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nickname VARCHAR(50) NOT NULL,
  avatar VARCHAR(255),
  openid VARCHAR(50) UNIQUE,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入测试用户
INSERT INTO users (nickname, avatar, openid) VALUES 
('小明', 'https://img2.baidu.com/it/u=257878692,2906839917&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400', 'test_openid_1'),
('小红', 'https://img2.baidu.com/it/u=2534517003,3853694950&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_openid_2'),
('小华', 'https://img1.baidu.com/it/u=4027572546,1772471837&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_openid_3');

-- 创建帖子表
CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content TEXT NOT NULL,
  images TEXT,
  user_id INT NOT NULL,
  status TINYINT DEFAULT 1,
  like_count INT DEFAULT 0,
  collect_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content TEXT NOT NULL,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- 创建点赞和收藏表
CREATE TABLE IF NOT EXISTS user_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(20) NOT NULL,
  target_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY `unique_like` (`user_id`, `type`, `target_id`)
);

CREATE TABLE IF NOT EXISTS user_collections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(20) NOT NULL,
  target_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY `unique_collection` (`user_id`, `type`, `target_id`)
);

-- 插入测试帖子数据
INSERT INTO posts (content, images, user_id) VALUES 
('今天遇到一个特别可爱的女孩子，想对她说："你是我的小太阳，可以挂在我的天空吗？"', 
 '[\"https://img1.baidu.com/it/u=1407750889,3441968730&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=799\"]', 
 1),
('分享一个撩妹金句："你知道你和星星有什么区别吗？星星在天上，你在我心里。"', 
 NULL, 
 1),
('今天学会了一句土味情话："你知道你和白雪公主有什么区别吗？她吃毒苹果睡着了，而你不吃苹果就让我睡不着。"', 
 '[\"https://img1.baidu.com/it/u=2763925838,1749614172&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500\"]', 
 2),
('有人说："你是我的小猪佩奇，我的乔治。"这是什么水平？', 
 NULL, 
 2),
('刚才对女朋友说："你知道你和月亮有什么区别吗？月亮每天都在变，而你永远这么美。"她好像很开心！', 
 '[\"https://img2.baidu.com/it/u=2948738562,1338050330&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=333\"]', 
 1);

-- 插入测试评论
INSERT INTO comments (content, user_id, post_id) VALUES 
('太甜了吧！', 2, 1),
('学到了学到了', 3, 1),
('这个有点土哈哈', 1, 3),
('我也想学！', 2, 2),
('好浪漫啊', 3, 5);

-- 插入测试点赞记录
INSERT INTO user_likes (user_id, type, target_id) VALUES 
(1, 'post', 2),
(2, 'post', 1),
(3, 'post', 1),
(1, 'post', 3),
(2, 'post', 5);

-- 插入测试收藏记录
INSERT INTO user_collections (user_id, type, target_id) VALUES 
(1, 'post', 3),
(2, 'post', 1),
(3, 'post', 2),
(1, 'post', 5),
(2, 'post', 4);
(2, 'post', 5);