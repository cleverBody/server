const db = require('../models/db');
const {success, error} = require('../utils/response');

class PostController {
    // 获取帖子列表
    async getPosts(req, res) {
        try {
            const {type = 'latest', page = 1, limit = 10} = req.query;
            const offset = (page - 1) * limit;
            const userId = req.user?.id;

            let orderBy = 'p.created_at DESC';
            if (type === 'hot') {
                orderBy = 'like_count DESC, comment_count DESC, p.created_at DESC';
            }

            let sql = `
        SELECT 
          p.*,
          u.nickname as author,
          u.avatar,
          COALESCE(c.comment_count, 0) as comment_count,
          COALESCE(l.like_count, 0) as like_count,
          COALESCE(col.collect_count, 0) as collect_count,
          COALESCE(ul2.is_liked, 0) as is_liked,
          COALESCE(uc2.is_collected, 0) as is_collected
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN (
          SELECT post_id, COUNT(*) as comment_count 
          FROM comments 
          WHERE status = 1 
          GROUP BY post_id
        ) c ON p.id = c.post_id
        LEFT JOIN (
          SELECT target_id, COUNT(*) as like_count 
          FROM user_likes 
          WHERE type = 'post' 
          GROUP BY target_id
        ) l ON p.id = l.target_id
        LEFT JOIN (
          SELECT target_id, COUNT(*) as collect_count 
          FROM user_collections 
          WHERE type = 'post' 
          GROUP BY target_id
        ) col ON p.id = col.target_id
        LEFT JOIN (
          SELECT target_id, 1 as is_liked 
          FROM user_likes 
          WHERE type = 'post' AND user_id = ?
        ) ul2 ON p.id = ul2.target_id
        LEFT JOIN (
          SELECT target_id, 1 as is_collected 
          FROM user_collections 
          WHERE type = 'post' AND user_id = ?
        ) uc2 ON p.id = uc2.target_id
        WHERE p.status = 1
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
      `;

            console.log("查询SQL：{}", sql)
            const [rows] = await db.query(sql, [userId || 0, userId || 0, parseInt(limit), offset]);

            // 处理图片数组和默认值
            const posts = rows.map(post => {
                let images = [];
                try {
                    images = post.images ? JSON.parse(post.images) : [];
                } catch (err) {
                    console.error('解析图片数据失败:', err);
                }

                return {
                    ...post,
                    images,
                    author: post.author || '匿名用户',
                    avatar: post.avatar || 'https://img2.baidu.com/it/u=257878692,2906839917&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
                    like_count: parseInt(post.like_count) || 0,
                    collect_count: parseInt(post.collect_count) || 0,
                    comment_count: parseInt(post.comment_count) || 0,
                    is_liked: !!post.is_liked,
                    is_collected: !!post.is_collected
                };
            });

            success(res, {
                list: posts,
                hasMore: posts.length === parseInt(limit)
            });
        } catch (err) {
            console.error('获取帖子列表失败:', err);
            error(res, '获取帖子列表失败');
        }
    }

    // 获取帖子详情
    async getPostById(req, res) {
        try {
            const {id} = req.params;
            const userId = req.user?.id;

            const [posts] = await db.query(`
        SELECT 
          p.*,
          u.nickname as author,
          u.avatar,
          COUNT(DISTINCT c.id) as comment_count,
          COUNT(DISTINCT ul.id) as like_count,
          COUNT(DISTINCT uc.id) as collect_count,
          IF(ul2.id IS NOT NULL, 1, 0) as is_liked,
          IF(uc2.id IS NOT NULL, 1, 0) as is_collected
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN user_likes ul ON p.id = ul.target_id AND ul.type = 'post'
        LEFT JOIN user_collections uc ON p.id = uc.target_id AND uc.type = 'post'
        LEFT JOIN user_likes ul2 ON p.id = ul2.target_id AND ul2.type = 'post' AND ul2.user_id = ?
        LEFT JOIN user_collections uc2 ON p.id = uc2.target_id AND uc2.type = 'post' AND uc2.user_id = ?
        WHERE p.id = ? AND p.status = 1
        GROUP BY p.id
      `, [userId || 0, userId || 0, id]);

            if (posts.length === 0) {
                return error(res, '帖子不存在');
            }

            const post = posts[0];
            post.images = post.images ? JSON.parse(post.images) : [];

            success(res, post);
        } catch (err) {
            console.error('获取帖子详情失败:', err);
            error(res, '获取帖子详情失败');
        }
    }

    // 创建帖子
    async createPost(req, res) {
        try {
            const {content, images = []} = req.body;
            const userId = req.user.id;

            if (!content) {
                return error(res, '内容不能为空');
            }

            await db.execute(
                'INSERT INTO posts (content, images, user_id) VALUES (?, ?, ?)',
                [content, JSON.stringify(images), userId]
            );

            success(res);
        } catch (err) {
            console.error('发布帖子失败:', err);
            error(res, '发布失败');
        }
    }

    // 点赞帖子
    async handleLike(req, res) {
        try {
            const {id} = req.params;
            const userId = req.user.id;

            await db.execute(
                'INSERT INTO user_likes (user_id, type, target_id) VALUES (?, ?, ?)',
                [userId, 'post', id]
            );

            success(res);
        } catch (err) {
            console.error('点赞失败:', err);
            error(res, '点赞失败');
        }
    }

    // 收藏帖子
    async handleCollect(req, res) {
        try {
            const {id} = req.params;
            const userId = req.user.id;

            await db.execute(
                'INSERT INTO user_collections (user_id, type, target_id) VALUES (?, ?, ?)',
                [userId, 'post', id]
            );

            success(res);
        } catch (err) {
            console.error('收藏失败:', err);
            error(res, '收藏失败');
        }
    }

    // 创建评论
    async createComment(req, res) {
        try {
            const {id} = req.params;
            const {content} = req.body;
            const userId = req.user.id;

            if (!content) {
                return error(res, '评论内容不能为空');
            }

            await db.execute(
                'INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)',
                [content, userId, id]
            );

            success(res);
        } catch (err) {
            console.error('评论失败:', err);
            error(res, '评论失败');
        }
    }

    // 删除帖子
    async deletePost(req, res) {
        try {
            const {id} = req.params;
            const userId = req.user.id;

            // 检查是否是帖子作者
            const [posts] = await db.query(
                'SELECT user_id FROM posts WHERE id = ?',
                [id]
            );

            if (posts.length === 0) {
                return error(res, '帖子不存在');
            }

            if (posts[0].user_id !== userId) {
                return error(res, '无权删除此帖子');
            }

            await db.execute(
                'UPDATE posts SET status = 0 WHERE id = ?',
                [id]
            );

            success(res);
        } catch (err) {
            console.error('删除帖子失败:', err);
            error(res, '删除失败');
        }
    }
}

module.exports = new PostController();
