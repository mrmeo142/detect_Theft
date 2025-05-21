const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require("./my-project-3d250-firebase-adminsdk-fbsvc-1859dfdf5b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://my-project-3d250-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database();
module.exports = {db}; 