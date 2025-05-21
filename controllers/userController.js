const { registerUser, loginUser, updateUser } = require('../models/userModel');

// Đăng ký người dùng mới
async function handleRegister(req, res) {
  const { username, email, password } = req.body;
  try {
    const user = await registerUser({ username, email, password });
    res.status(201).json({ message: 'Đăng ký thành công', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Đăng nhập người dùng
async function handleLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await loginUser({ email, password });
    res.status(200).json({ message: 'Đăng nhập thành công', user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

// ✅ Cập nhật người dùng
async function handleUpdateUser(req, res) {
  const { id } = req.params; 
  const updates = req.body;  

  try {
    const updatedUser = await updateUser(id, updates);
    res.status(200).json({ message: 'Cập nhật thành công', user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  handleRegister,
  handleLogin,
  handleUpdateUser, 
};
