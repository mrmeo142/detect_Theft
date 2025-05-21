const path = require('path');
const { initSensorListener, updateSystemEnabled } = require('../controllers/sensorController');
const { handleRegister, handleLogin, handleUpdateUser } = require('../controllers/userController');

function route(app) {
  // Trang chủ sau khi đăng nhập
  app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../statics/home.html'));
  });

  // Lắng nghe cảm biến
  app.get('/api/sensors', initSensorListener);

  // Bật/tắt báo động
  app.post('/api/alarm', updateSystemEnabled); 

  // Trang login mặc định
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../statics/login.html'));
  });

  // Đăng ký người dùng
  app.post('/api/register', handleRegister);

  // Đăng nhập
  app.post('/api/login', handleLogin);

  // Cập nhật người dùng
  app.put('/api/user/:id', handleUpdateUser);
}

module.exports = route;
