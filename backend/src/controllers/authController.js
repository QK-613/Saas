const bcrypt = require('bcrypt');
const User = require('../database/models/User');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // 创建新用户
    const newUser = await User.create({
      email,
      password: hashedPassword,
      isPremium: false,
      dailyCount: 0,
      lastResetDate: new Date()
    });
    
    // 设置 session
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      isPremium: newUser.isPremium,
      dailyCount: newUser.dailyCount
    };
    
    res.status(201).json({ 
      message: 'Registration successful', 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // 重置每日计数（如果是新的一天）
    const today = new Date().toDateString();
    const lastReset = new Date(user.lastResetDate).toDateString();
    if (today !== lastReset) {
      user.dailyCount = 0;
      user.lastResetDate = new Date();
      await user.save();
    }
    
    // 设置 session
    req.session.user = {
      id: user.id,
      email: user.email,
      isPremium: user.isPremium,
      dailyCount: user.dailyCount
    };
    
    res.status(200).json({ 
      message: 'Login successful', 
      user: req.session.user 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
};

exports.getStatus = async (req, res) => {
  if (req.session.user) {
    // 更新用户信息
    const user = await User.findByPk(req.session.user.id);
    if (user) {
      // 重置每日计数（如果是新的一天）
      const today = new Date().toDateString();
      const lastReset = new Date(user.lastResetDate).toDateString();
      if (today !== lastReset) {
        user.dailyCount = 0;
        user.lastResetDate = new Date();
        await user.save();
      }
      
      req.session.user = {
        id: user.id,
        email: user.email,
        isPremium: user.isPremium,
        dailyCount: user.dailyCount
      };
    }
    
    res.status(200).json({ 
      isLoggedIn: true, 
      user: req.session.user 
    });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
};