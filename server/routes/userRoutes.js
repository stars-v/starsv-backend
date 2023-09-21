const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	getMe,
	getUserByPhone,
	getProfilePhoto,
	resetPassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../utils/upload/image');

router.post('/', uploadImage.single('profilePhoto'), registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/profile', getProfilePhoto);
router.post('/reset-password', resetPassword);
router.post('/user-exist', getUserByPhone);

module.exports = router;
