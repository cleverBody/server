const db = require('../models/db');
const { success, error } = require('../utils/response');
const jwt = require('jsonwebtoken');
const config = require('../config');
const axios = require('axios');
const User = require('../models/user');

class AuthController {
  // 微信登录
  async login(req, res) {
    try {
      const { code, userInfo } = req.body;
      console.log('后端收到的用户信息:', userInfo); // 添加日志

      // 调用微信接口获取openid
      const wxRes = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid: config.wx.appId,
          secret: config.wx.appSecret,
          js_code: code,
          grant_type: 'authorization_code'
        }
      });

      const { openid } = wxRes.data;
      if (!openid) {
        return error(res, '登录失败');
      }

      // 查找或创建用户
      let user = await User.findByOpenid(openid);
      
      if (!user) {
        // 创建新用户
        const userId = await User.create({
          openid,
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        });
        user = await User.findById(userId);
      } else {
        // 更新现有用户信息
        await User.update(user.id, {
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        });
        // 重新获取用户信息
        user = await User.findById(user.id);
      }

      // 生成token
      const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpires
      });

      success(res, {
        token,
        userInfo: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar
        }
      });
    } catch (err) {
      console.error('登录失败:', err);
      error(res, '登录失败');
    }
  }

  // 获取用户信息
  async getUserInfo(req, res) {
    try {
      const userId = req.user.id;
      const [users] = await db.query(
        'SELECT id, nickname, avatar, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return error(res, '用户不存在');
      }

      success(res, users[0]);
    } catch (err) {
      console.error('获取用户信息失败:', err);
      error(res, '获取用户信息失败');
    }
  }
}

module.exports = new AuthController();
