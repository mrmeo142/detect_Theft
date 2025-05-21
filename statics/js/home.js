const socket = io('http://192.168.0.100:3000');

// Nhận dữ liệu từ server và cập nhật giao diện
socket.on('sensor-update', (data) => {
  document.getElementById('acc').textContent = data.acceleration ?? 'N/A';
  document.getElementById('sensor').textContent = data.sensor ?? 'N/A';
  document.getElementById('alert').textContent = data.alert ?? 'N/A';

  // Cập nhật trạng thái nút dựa vào systemEnabled
  const toggleBtn = document.getElementById('alarmToggleBtn');
  if (data.systemEnabled !== undefined) {
    toggleBtn.textContent = data.systemEnabled === 1 ? 'Tắt' : 'Bật';
    toggleBtn.dataset.enabled = data.systemEnabled;
  }
});

// Xử lý khi nhấn nút
document.getElementById('alarmToggleBtn').addEventListener('click', () => {
  const btn = document.getElementById('alarmToggleBtn');
  const isEnabled = btn.dataset.enabled === '1';
  const newStatus = isEnabled ? 0 : 1;

  fetch('/api/alarm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemEnabled: newStatus })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      // Sau khi gửi thành công, nút sẽ được cập nhật khi socket nhận lại dữ liệu mới
      console.log('Đã cập nhật trạng thái báo động:', newStatus);
    }
  })
  .catch(err => {
    console.error('Lỗi khi gửi yêu cầu:', err);
  });
});
