require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

// 托管静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 路由重定向：访问 / 自动跳转到会员登录页
app.get('/', (req, res) => {
    res.redirect('/member/login.html');
});

app.listen(PORT, () => {
    console.log(`智慧康养系统会员端已启动`);
    console.log(`Server is running on port ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}/member/login.html`);
});
