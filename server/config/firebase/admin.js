const admin = require('firebase-admin');

const serviceAccount = require('../../../serviceAccountKey.json');

const firebaseAdmin = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: 'starsv-cd719.appspot.com',
});

module.exports = firebaseAdmin;
