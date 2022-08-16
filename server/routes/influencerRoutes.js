const express = require('express');
const mongoose = require('mongoose');
const { connection } = require('../config/db');
const router = express.Router();
const {
	registerInfluencer,
	loginInfluencer,
	getMe,
	referenceVideo,
} = require('../controllers/influencerController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../utils/upload/image');
const { uploadVideo } = require('../utils/upload/video');
const Influencer = require('../models/influencer.model');
const Grid = require('gridfs-stream');

router.post('/', uploadImage.single('profilePhoto'), registerInfluencer);
router.post('/login', loginInfluencer);
router.get('/me', protect, getMe);

//Handling videos uploading
// * upload a video
router.post('/videos', protect, uploadVideo.single('video'), referenceVideo);

// * get all videos
router.get('/videos', protect, async (req, res) => {
	// init gfs
	const gfs = Grid(connection.db, mongoose.mongo);
	gfs.collection('videos');
	// influencers videos ids
	const influencer = await Influencer.findById(req.influencer.id);
	const videosIds = influencer.videos;

	gfs.files.find({ _id: { $in: videosIds } }).toArray((err, files) => {
		return res.json({ videos: files });
	});
});

router.get('/videos/:filename', async (req, res) => {
	// init gfs
	const gfs = Grid(connection.db, mongoose.mongo);
	gfs.collection('videos');

	const gridFsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
		bucketName: 'videos',
	});

	gfs.files.findOne(
		{
			filename: req.params.filename,
		},
		(err, file) => {
			if (err) return res.status(404).send(err);
			if (!file || file.length === 0)
				return res.status(404).send('Video not found');

			const readStream = gridFsBucket.openDownloadStream(file._id);
			readStream.pipe(res);
		}
	);
});

module.exports = router;
