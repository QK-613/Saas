const User = require('../database/models/User');
const { generateCopies } = require('../services/deepseekService');

// 文案生成控制器
exports.generate = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: '请输入文本' });
    }
    
    if (!req.session.user) {
      return res.status(401).json({ error: '请先登录' });
    }
    
    // 获取用户信息
    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }
    
    // 重置每日计数（如果是新的一天）
    const today = new Date().toDateString();
    const lastReset = new Date(user.lastResetDate).toDateString();
    if (today !== lastReset) {
      user.dailyCount = 0;
      user.lastResetDate = new Date();
      await user.save();
    }
    
    // 检查每日次数限制
    const DAILY_LIMIT = 3;
    if (!user.isPremium && user.dailyCount >= DAILY_LIMIT) {
      return res.status(403).json({ 
        error: '今日生成次数已达上限，请升级会员解锁无限次数',
        isLimitReached: true
      });
    }
    
    // 增加每日计数
    if (!user.isPremium) {
      user.dailyCount += 1;
      await user.save();
      
      // 更新 session
      req.session.user.dailyCount = user.dailyCount;
    }
    
    // 调用 DeepSeek API 生成文案
    const [dishName, features] = text.split('，');
    const copies = await generateCopies(dishName, features);
    
    res.status(200).json({ 
      copies,
      dailyCount: user.dailyCount,
      isPremium: user.isPremium
    });
  } catch (error) {
    console.error('生成文案错误:', error);
    res.status(500).json({ error: error.message || '生成文案失败' });
  }
};