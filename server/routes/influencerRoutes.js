const express = require('express');
const router = express.Router();
const {
	registerInfluencer,
	loginInfluencer,
	getMe,
	getProfilePhoto,
	resetPassword,
	getVideos,
	saveVideo,
	streamVideo,
	downloadVideo,
	deleteVideo
} = require('../controllers/influencerController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../utils/upload/image');
const { uploadVideo } = require('../utils/upload/video');


router.post('/', uploadImage.single('profilePhoto'), registerInfluencer);
router.post('/login', loginInfluencer);
router.get('/me', protect, getMe);
router.get('/profile', protect, getProfilePhoto);

// -> upload a video
router.post('/videos', protect, uploadVideo.single('video'), saveVideo);

// -> get all videos
router.get('/videos', protect, getVideos);

// -> Stream a video
router.get('/videos/:filename/stream', streamVideo);

// -> Download a video
router.get('/videos/:filename/download', downloadVideo);

// -> Delete a video
router.delete('/videos/delete', protect, deleteVideo);

router.post('/reset-password', resetPassword)

module.exports = router;