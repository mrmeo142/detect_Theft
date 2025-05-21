const { listenSensorData, writeSystemEnabled } = require('../models/sensorModel');

// Realtime Sensor (Socket.IO)
function initSensorListener(io) {
  listenSensorData((data) => {
    io.emit('sensor-update', data);
  });
}


// ✅ Ghi trạng thái bật/tắt báo động
function updateSystemEnabled(req, res) {
  const { systemEnabled } = req.body;
  if (systemEnabled !== 0 && systemEnabled !== 1) {
    return res.status(400).json({ error: 'Giá trị không hợp lệ' });
  }

  writeSystemEnabled(systemEnabled)
    .then(() => res.json({ success: true, systemEnabled }))
    .catch(err => res.status(500).json({ error: 'Lỗi ghi dữ liệu', detail: err.message }));
}

module.exports = {
  initSensorListener,
  updateSystemEnabled
};
