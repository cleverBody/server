/**
 * 认证控制器模块
 * 处理用户登录、身份验证和用户信息获取等功能
 */
const db = require('../models/db');
const { success, error } = require('../utils/response');
const jwt = require('jsonwebtoken');
const config = require('../config');
const axios = require('axios');
const User = require('../models/user');

/**
 * 认证控制器类
 * 提供用户认证和信息管理相关的方法
 */
class AuthController {
  /**
   * 微信小程序登录方法
   * 接收小程序登录code，获取openid并创建或更新用户信息
   * 
   * @param {Object} req - Express请求对象，包含code和用户信息
   * @param {Object} res - Express响应对象
   * @returns {Object} 返回登录结果，包含token和用户信息
   */
  async login(req, res) {
    try {
      const { code, userInfo } = req.body;
      console.log('后端收到的用户信息:', userInfo); // 调试日志

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

      // 生成JWT令牌
      const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpires
      });

      // 返回成功响应
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

  /**
   * 获取用户信息方法
   * 根据认证后的用户ID获取用户详细信息
   * 
   * @param {Object} req - Express请求对象，通过中间件注入了user对象
   * @param {Object} res - Express响应对象
   * @returns {Object} 返回用户详细信息
   */
  async getUserInfo(req, res) {
    try {
      const userId = req.user.id;
      // 查询用户基本信息
      const [users] = await db.query(
        'SELECT id, nickname, avatar, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return error(res, '用户不存在');
      }

      // 返回用户信息
      success(res, users[0]);
    } catch (err) {
      console.error('获取用户信息失败:', err);
      error(res, '获取用户信息失败');
    }
  }
}

module.exports = new AuthController();
