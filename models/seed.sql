-- 1. 首先插入用户数据
INSERT INTO users (openid, nickname, avatar) VALUES
('test_user_1', '情话小王子', '/images/avatar1.png'),
('test_user_2', '浪漫达人', '/images/avatar2.png'),
('test_user_3', '情话达人', '/images/avatar3.png'),
('test_user_4', '甜蜜使者', '/images/avatar4.png'),
('test_user_5', '浪漫诗人', '/images/avatar5.png');

-- 2. 插入情话数据
INSERT INTO love_words (content, author, category, created_at) VALUES
('你知道你和星星有什么区别吗？星星在天上，你在我心里。', '情话小王子', 'sweet', NOW()),
('你是我温暖的手套，冰冷的啤酒，带着阳光味道的衬衫，和一切美好的记忆。', '浪漫达人', 'sweet', NOW()),
('你是我的夏日限定，清爽可口，让人心动。', '情话小王子', 'sweet', NOW()),
('你是我的平行宇宙，我的独家记忆，我的所有浪漫。', '浪漫达人', 'sweet', NOW()),
('你知道我最喜欢什么星座吗？是你的微笑，因为它最闪耀。', '情话小王子', 'sweet', NOW()),
('遇见你，是我最美的意外，也是我最幸运的必然。', '浪漫达人', 'sweet', NOW()),
('我想把温柔揉进风里，让它陪你度过每个夜晚。', '情话小王子', 'sweet', NOW()),
('你是我的小太阳，每天都给我带来温暖和希望。', '浪漫达人', 'sweet', NOW()),
('你的眼睛像星辰大海，我愿意溺死在里面。', '情话小王子', 'sweet', NOW()),
('我想要和你一起慢慢变老，看遍世间美好，数尽人间星光。', '浪漫达人', 'sweet', NOW());

-- 3. 插入用户关注关系
INSERT INTO user_follows (follower_id, followed_id) VALUES
(1, 2), (1, 3), (1, 4),
(2, 1), (2, 3), (2, 5),
(3, 1), (3, 2), (3, 4),
(4, 1), (4, 2), (4, 5),
(5, 1), (5, 3), (5, 4);

-- 4. 插入帖子数据
INSERT INTO posts (user_id, content, images) VALUES
(1, '今天的心情特别好，想分享一句情话：你是我温暖的手套，冰冷的啤酒，带着阳光味道的衬衫，和一切美好的记忆。', '[]'),
(2, '分享一个小技巧：情话要走心不要太肉麻，要真诚不要太做作。', '[]'),
(1, '有人喜欢土味情话吗？来交流一下~', '[]'),
(3, '推荐一句我最近很喜欢的情话：你闻起来香香的，像阳光晒过的棉花糖。', '["images/post1.jpg"]'),
(4, '刚刚在街上看到一对情侣，男生对女生说：你知道你和月亮有什么区别吗？月亮每天都在变，而你永远这么美。好甜啊！', '[]'),
(5, '分享一个撩人技巧：要记住对方说过的每一句话，在Ta最意想不到的时候说出来，这样会让Ta觉得很感动。', '[]'),
(1, '今天天气真好，想对喜欢的人说：你是我平淡生活里的一抹惊喜。', '["images/post2.jpg"]'),
(2, '问：情话怎么说才不会显得太油腻？欢迎大家来讨论~', '[]'),
(3, '记录下今天想到的一句话：你是我所有的惊喜和意外，是我整个青春的期待。', '[]'),
(4, '向大家请教：第一次约会，准备对女生说"你的眼睛真好看，像星星一样"，会不会太老套？', '[]'),
(5, '分享一个小技巧：情话要结合当下的场景，比如下雨天就可以说"有你在的地方，下雨也是晴天"。', '[]');

-- 5. 插入点赞数据
INSERT INTO user_likes (user_id, love_word_id) VALUES
(1, 1), (1, 3), (1, 5),
(2, 2), (2, 4), (2, 6);

-- 6. 插入收藏数据
INSERT INTO user_collections (user_id, love_word_id) VALUES
(1, 2), (1, 4), (1, 6),
(2, 1), (2, 3), (2, 5);

-- 7. 插入帖子点赞数据
INSERT INTO post_likes (user_id, post_id) VALUES
(1, 2), (2, 1), (2, 3),
(3, 1), (3, 2), (3, 4),
(4, 2), (4, 3), (4, 5),
(5, 1), (5, 3), (5, 6),
(1, 4), (1, 6), (1, 8),
(2, 5), (2, 7), (2, 8);

-- 8. 最后插入评论数据
INSERT INTO post_comments (user_id, post_id, content) VALUES
(2, 1, '写得真好，我也想到一句：你是我的夏日限定，清爽可口，让人心动。'),
(1, 2, '说得对，最重要的是真诚。'),
(1, 3, '我最喜欢："你知道你和星星有什么区别吗？星星在天上，你在我心里。"'),
(3, 1, '这句真的很棒！保存了！'),
(4, 1, '好喜欢这种温暖的感觉'),
(5, 2, '确实，真诚最重要'),
(1, 3, '我也是土味情话爱好者，交个朋友吧~'),
(2, 3, '推荐一句：你是我最想写的诗，最想唱的歌，最想讲的故事'),
(3, 4, '天气好的时候，心情也会变得很美好呢'),
(4, 5, '关键是要真情实感，不要为了说情话而说情话'),
(5, 6, '写得真好，文采不错'),
(1, 7, '我觉得还行，重要的是你说的时候要真诚'),
(2, 8, '说得对，要结合场景，这样会显得更自然');

-- 插入测试情话数据
INSERT INTO love_words (content, author, category) VALUES
('你是我温暖的太阳，照亮我的每一天', '佚名', 'sweet'),
('和你在一起的时光，总是过得特别快', '佚名', 'sweet'),
('遇见你是我最美好的意外', '佚名', 'sweet'),
('今天也是想你的一天', '佚名', 'daily'),
('希望每天都能看到你的笑容', '佚名', 'daily'),
('你是我最想分享快乐的人', '佚名', 'daily'),
('有你的节日才是完整的', '佚名', 'festival'),
('愿你的节日充满欢乐', '佚名', 'festival'),
('和你一起过节真好', '佚名', 'festival'),
('你的笑容比阳光还温暖', '佚名', 'funny'),
('想和你一起数星星', '佚名', 'funny'),
('你是我最想逗笑的人', '佚名', 'funny');

-- 确保每个分类都有数据
UPDATE love_words SET category = 'sweet' WHERE category IS NULL LIMIT 3; 

-- 插入分类数据
INSERT INTO categories (id, name, icon, count) VALUES
('sweet', '甜蜜', '/assets/icons/甜蜜.png', 0),
('romantic', '浪漫', '/assets/icons/浪漫.png', 0),
('daily', '日常', '/assets/icons/日常.png', 0),
('funny', '搞笑', '/assets/icons/搞笑.png', 0);

-- 插入情话数据
INSERT INTO love_words (content, author, category, likes) VALUES
('你是我温暖的手套，冰冷的啤酒，带着阳光味道的衬衫，和一切美好的记忆。', '情话小王子', '温暖', 1234),
('遇见你是我所有美好故事的开始。', '浪漫诗人', '浪漫', 888),
('你知道我最喜欢什么星座吗？是你的微笑，因为它最闪耀。', '甜蜜达人', '甜蜜', 666),
('我想把温柔揉进风里，让它陪你度过每个夜晚。', '情话王子', '温暖', 520);

-- 更新分类数量
UPDATE categories c 
SET count = (
  SELECT COUNT(*) 
  FROM love_words 
  WHERE category = c.name
); 

-- 插入测试用户
INSERT INTO users (nickname, avatar) VALUES
('测试用户1', '/images/avatar1.png'),
('测试用户2', '/images/avatar2.png'),
('测试用户3', '/images/avatar3.png');

-- 插入测试情话
INSERT INTO love_words (content, author, category, created_by) VALUES
('你是我温暖的手套，冰冷的啤酒，带着阳光味道的衬衫，和一切美好的记忆。', '情话小王子', 'sweet', 1),
('遇见你是我所有美好故事的开始。', '浪漫诗人', 'romantic', 2),
('你知道我最喜欢什么星座吗？是你的微笑，因为它最闪耀。', '甜蜜达人', 'sweet', 3);

-- 插入测试帖子
INSERT INTO posts (user_id, content) VALUES
(1, '分享一个小技巧：情话要走心不要太肉麻，要真诚不要太做作。'),
(2, '推荐一句我最近很喜欢的情话：你闻起来香香的，像阳光晒过的棉花糖。'),
(3, '今天天气真好，想对喜欢的人说：你是我平淡生活里的一抹惊喜。');

-- 插入测试收藏
INSERT INTO user_collections (user_id, type, target_id) VALUES
(1, 'love', 1),
(1, 'post', 2),
(2, 'love', 2),
(2, 'post', 1),
(3, 'love', 3);

-- 插入测试点赞
INSERT INTO user_likes (user_id, type, target_id) VALUES
(1, 'love', 2),
(1, 'post', 3),
(2, 'love', 1),
(2, 'post', 2),
(3, 'love', 1);

-- 插入测试浏览历史
INSERT INTO browse_history (user_id, type, target_id) VALUES
(1, 'love', 1),
(1, 'post', 2),
(2, 'love', 3),
(2, 'post', 1),
(3, 'love', 2); 