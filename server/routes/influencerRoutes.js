const express = require('express');
const router = express.Router();
const {
	registerInfluencer,
	loginInfluencer,
	getMe,
} = require('../controllers/influencerController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/upload/image');

router.post('/', upload.single('profilePhoto'), registerInfluencer);
router.post('/login', loginInfluencer);
router.get('/me', protect, getMe);

module.exports = router;
