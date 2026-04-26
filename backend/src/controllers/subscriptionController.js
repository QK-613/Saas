const User = require('../database/models/User');

// 管理员密钥（可以在 .env 中配置）
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';

exports.upgrade = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: '请先登录' });
    }
    
    // 获取用户信息
    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }
    
    // 模拟支付成功，升级为付费会员
    user.isPremium = true;
    user.dailyCount = 0; // 重置每日计数
    await user.save();
    
    // 更新 session
    req.session.user = {
      id: user.id,
      email: user.email,
      isPremium: user.isPremium,
      dailyCount: user.dailyCount
    };
    
    res.status(200).json({ 
      message: '升级成功！您现在是高级会员',
      user: req.session.user
    });
  } catch (error) {
    console.error('升级失败:', error);
    res.status(500).json({ error: '升级失败' });
  }
};

// 手动开通接口（管理员使用）
exports.manualUpgrade = async (req, res) => {
  try {
    const { userId, adminKey } = req.body;

    // 验证管理员密钥
    if (adminKey !== ADMIN_KEY) {
      return res.status(401).json({ error: '管理员密钥错误' });
    }

    // 查找用户
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 标记为高级会员
    user.isPremium = true;
    user.dailyCount = 0; // 重置每日计数
    await user.save();

    res.status(200).json({ 
      message: '手动开通成功',
      user: {
        id: user.id,
        email: user.email,
        isPremium: user.isPremium,
        dailyCount: user.dailyCount
      }
    });
  } catch (error) {
    console.error('手动开通失败:', error);
    res.status(500).json({ error: '手动开通失败' });
  }
};