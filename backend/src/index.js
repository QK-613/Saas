const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 允许跨域
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// 健康检查路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 根路径
app.get('/', (req, res) => {
  res.send('小店爆文助手后端服务');
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});