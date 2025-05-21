function showLogin() {
  document.getElementById('loginForm').classList.add('active');
  document.getElementById('registerForm').classList.remove('active');
}

function showRegister() {
  document.getElementById('registerForm').classList.add('active');
  document.getElementById('loginForm').classList.remove('active');
}

// Đăng nhập
async function handleLogin(event) {
  event.preventDefault(); 

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/home';
    } else {
      alert('Đăng nhập thất bại: ' + data.error);
    }
  } catch (err) {
    alert('Lỗi kết nối máy chủ.');
  }
}

// Đăng ký
async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showLogin();
    } else {
      alert('Đăng ký thất bại: ' + data.error);
    }
  } catch (err) {
    alert('Lỗi kết nối máy chủ.');
  }
}
