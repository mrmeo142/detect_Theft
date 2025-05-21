document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.sidebar nav ul li');
  const mainContent = document.getElementById('mainContent');
  const userInfoForm = document.getElementById('userInfoForm');
  const navMonitor = document.getElementById('navMonitor');
  const navUserInfo = document.getElementById('navUserInfo');

  navItems.forEach((li) => {
    li.addEventListener('click', () => {
      if (li.textContent.includes('Thông tin người dùng')) {
        showUserForm();
        navUserInfo.classList.add('active');
        navMonitor.classList.remove('active');
        mainContent.style.display = 'none';
        userInfoForm.style.display = 'block';
      } else if (li.textContent.includes('Giám sát')) {
        hideUserForm();
        navMonitor.classList.add('active');
        navUserInfo.classList.remove('active');
        mainContent.style.display = 'block';
      } else if (li.textContent.includes('Đăng xuất')) {
        localStorage.removeItem('user'); 
        location.replace('/');
      }
    });
  });

  // Form cập nhật user
  const editForm = document.getElementById('editUserForm');
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedData = {
      username: document.getElementById('editUsername').value,
      email: document.getElementById('editEmail').value,
      password: document.getElementById('editPassword').value || user.password,
    };

    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(result.user));
        hideUserForm();
        mainContent.style.display = 'block';
        navMonitor.classList.add('active');
        navUserInfo.classList.remove('active');
      } else {
        alert(result.error || 'Lỗi khi cập nhật');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối server');
    }
  });
});

function showUserForm() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return alert('Chưa đăng nhập');

  document.getElementById('editUsername').value = user.username;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editPassword').value = '';

  document.getElementById('userInfoForm').style.display = 'block';
}

function hideUserForm() {
  document.getElementById('userInfoForm').style.display = 'none';
}
