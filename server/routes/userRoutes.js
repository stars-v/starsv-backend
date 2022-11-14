const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	getMe,
	getUserByPhone,
	getProfilePhoto,
	sendVerification,
	verifyOTP,
	confirmAccount,
	resetPassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../utils/upload/image');

router.post('/', uploadImage.single('profilePhoto'), registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/profile', getProfilePhoto);
router.post('/send-verification', protect, sendVerification);
router.post('/verify-otp', protect, verifyOTP, confirmAccount);
router.post('/reset-password', resetPassword);
router.post('/user-exist', getUserByPhone);

module.exports = router;
