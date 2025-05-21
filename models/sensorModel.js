const { db } = require('../config');
const info = db.ref('Test');
const detect = db.ref('button');

// Lắng nghe dữ liệu từ node "Test"
function listenSensorData(callback) {
  info.on('value', async (snapshot) => {
    const data = snapshot.val();

    // Lấy giá trị systemEnabled từ "button"
    const systemSnap = await detect.child('systemEnabled').once('value');
    const systemEnabled = systemSnap.val();

    callback({
      ...data,
      systemEnabled: systemEnabled ?? 0
    });
  });

  // Lắng nghe riêng khi chỉ systemEnabled thay đổi
  detect.child('systemEnabled').on('value', async (snapshot) => {
    const systemEnabled = snapshot.val();

    const infoSnap = await info.once('value');
    const data = infoSnap.val();

    callback({
      ...data,
      systemEnabled: systemEnabled ?? 0
    });
  });
}

// Ghi giá trị mới cho systemEnabled
function writeSystemEnabled(value) {
  return detect.child('systemEnabled').set(value);
}

module.exports = {
  listenSensorData,
  writeSystemEnabled
};
