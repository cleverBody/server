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

-- 插入默认用户数据
INSERT INTO users (nickname, avatar, openid) VALUES 
('土味情话小王子', 'https://img2.baidu.com/it/u=2534517003,3853694950&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_user_1'),
('撩妹高手', 'https://img1.baidu.com/it/u=4027572546,1772471837&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_user_2'),
('情话达人', 'https://img2.baidu.com/it/u=257878692,2906839917&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400', 'test_user_3'),
('甜言蜜语', 'https://img0.baidu.com/it/u=3145022701,3943645695&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_user_4'),
('浪漫小天使', 'https://img2.baidu.com/it/u=2147543766,3793021693&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_user_5'),
('情话收藏家', 'https://img0.baidu.com/it/u=3119944092,850300173&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_user_6'),
('恋爱顾问', 'https://img0.baidu.com/it/u=1057288082,2473596146&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_user_7'),
('情话创作者', 'https://img1.baidu.com/it/u=2796144188,3775602300&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_user_8'),
('爱情诗人', 'https://img1.baidu.com/it/u=2267591472,3867511392&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_user_9'),
('浪漫使者', 'https://img2.baidu.com/it/u=3672751361,910039073&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'test_user_10');

-- 插入管理员用户
INSERT INTO users (nickname, avatar, openid) VALUES 
('系统管理员', 'https://img1.baidu.com/it/u=2267591472,3867511392&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'admin_user_1'),
('内容审核员', 'https://img2.baidu.com/it/u=3672751361,910039073&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'admin_user_2');

-- 插入测试机器人用户
INSERT INTO users (nickname, avatar, openid) VALUES 
('情话小助手', 'https://img0.baidu.com/it/u=3119944092,850300173&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'bot_user_1'),
('AI情话生成器', 'https://img0.baidu.com/it/u=1057288082,2473596146&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 'bot_user_2'); 