const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;

const route = require('./routes/index');
const { initSensorListener } = require('./controllers/sensorController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'statics')));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Gọi router
route(app);

// Khởi động lắng nghe realtime từ Firebase
initSensorListener(io);

server.listen(port, '0.0.0.0', () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});

