// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// ให้บริการไฟล์ static จาก build ของ React (ถ้ามี)
app.use(express.static(path.join(__dirname, 'build')));

// ถ้าไม่มี route ไหนตรง ให้ส่ง index.html ของ React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ตอบสำหรับ favicon.ico
app.get('./public/favicon.ico', (req, res) => res.status(204).send());

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});