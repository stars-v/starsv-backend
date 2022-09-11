const admin = require("firebase-admin");

const serviceAccount = require("../../../serviceAccountKey.json");

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.BUCKET_URL
});


module.exports = firebaseAdmin