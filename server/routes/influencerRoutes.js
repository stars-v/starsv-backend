const express = require('express');
const router = express.Router();
const {
	getAllInfluencers,
	registerInfluencer,
	loginInfluencer,
	getMe,
	getProfilePhoto,
	resetPassword,
	getVideos,
	saveVideo,
	streamVideo,
	downloadVideo,
	deleteVideo,
} = require('../controllers/influencerController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../utils/upload/image');
const { uploadVideo } = require('../utils/upload/video');

// -> Get all influencers | Register influencer
router
	.get('/', getAllInfluencers)
	.post('/', uploadImage.single('profilePhoto'), registerInfluencer);

// -> Login influencer
router.post('/login', loginInfluencer);

// -> Get influencer data
router.get('/me', protect, getMe);

// -> Get profile image as a stream
router.get('/profile', protect, getProfilePhoto);

// -> upload a video
router.post('/videos', protect, uploadVideo.single('video'), saveVideo);

// -> get all videos
router.get('/videos', getVideos);

// -> Stream a video
router.get('/videos/stream', streamVideo);

// -> Download a video
router.get('/videos/download', downloadVideo);

// -> Delete a video
router.delete('/videos/delete', protect, deleteVideo);

router.post('/reset-password', resetPassword);

module.exports = router;
