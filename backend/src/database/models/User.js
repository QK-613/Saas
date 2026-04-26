const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dailyCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastResetDate: {
    type: DataTypes.DATE,
    defaultValue: new Date()
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: new Date()
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: new Date()
  }
}, {
  tableName: 'users'
});

// 同步数据库表
User.sync()
  .then(() => {
    console.log('用户表创建成功');
  })
  .catch(err => {
    console.error('用户表创建失败:', err);
  });

module.exports = User;