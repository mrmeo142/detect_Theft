// userModel.js
const { db } = require('../config');
const userRef = db.ref('user');

// Thêm người dùng mới
async function registerUser({ username, email, password }) {
  const snapshot = await userRef.orderByChild('email').equalTo(email).once('value');
  if (snapshot.exists()) {
    throw new Error('Email đã được sử dụng');
  }

  const newUserRef = userRef.push();
  await newUserRef.set({ username, email, password });
  return { id: newUserRef.key, username, email };
}

// Xác thực đăng nhập
async function loginUser({ email, password }) {
  const snapshot = await userRef.orderByChild('email').equalTo(email).once('value');

  if (!snapshot.exists()) {
    throw new Error('Tài khoản không tồn tại');
  }

  let user = null;
  snapshot.forEach((child) => {
    if (child.val().password === password) {
      user = { id: child.key, ...child.val() };
    }
  });

  if (!user) throw new Error('Sai mật khẩu');
  return user;
}

// Cập nhật thông tin người dùng
async function updateUser(id, data) {
  const userToUpdate = userRef.child(id);
  const snapshot = await userToUpdate.once('value');

  if (!snapshot.exists()) {
    throw new Error('Không tìm thấy người dùng để cập nhật');
  }

  await userToUpdate.update(data);
  return { id, ...snapshot.val(), ...data };
}

module.exports = {
  registerUser,
  loginUser,
  updateUser, 
};
