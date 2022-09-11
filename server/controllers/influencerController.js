require('dotenv').config();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const saltedMd5 = require('salted-md5')
const Influencer = require('../models/influencer.model');
const Image = require('../models/image.model');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const { validatePhone } = require('../lib/functions/validation')
const firebaseAdmin = require('../config/firebase/admin')



// @desc Register new influencer
// @route POST /api/influencers
// @access Public
const registerInfluencer = asyncHandler(async (req, res) => {
	const { name, phone, password } = req.body;
	if (!name || !phone || !password) {
		res.status(400);
		throw new Error('Please add all fields');
	}
	//Check if the phone number is valid
	if (!validatePhone(phone)) {
		res.status(400);
		res.json({ success: false, message: 'Phone number is not valid' });
	}


	// Check if the influencer already exists
	const influencerExists = await Influencer.findOne({ phone });
	if (influencerExists) {
		res.status(400);
		res.json({ success: false, message: 'Influencer already exist' });
	}

	// Store profile image to 'images' collection
	const obj = {
		name: req.file.originalname,
		desc: '',
		img: {
			data: fs.readFileSync(
				path.join(
					`${__dirname}/../../uploads/images/${req.file.filename}`
				)
			),
			contentType: req.file.mimetype,
		},
	};
	const image = await Image.create(obj);

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	// Create influencer
	const influencer = await Influencer.create({
		name,
		phone,
		password: hashedPassword,
		profilePhoto: image.id,
	});

	// Remove the image from the uploads/images folder
	fs.unlink(
		path.join(`${__dirname}/../../uploads/images/${req.file.filename}`),
		(err) => {
			if (err) {
				console.error(err);
				return;
			}
			// image removed
		}
	);

	if (influencer) {
		res.status(201).json({
			influencer: {
				_id: influencer.id,
				name: influencer.name,
				phone: influencer.phone,
				confirmed: influencer.confirmed,
				category: influencer.category,
				token: generateToken(influencer._id),
			},
			success: true,
			message: 'influencer registred successfully',
		});
	} else {
		res.status(400);
		res.json({ success: false, message: 'Invalid credentials' });
	}
});

// @desc Authenticate a influencer
// @route POST /api/influencers/login
// @access Public
const loginInfluencer = asyncHandler(async (req, res) => {
	const { phone, password } = req.body;

	const influencer = await Influencer.findOne({ phone });

	if (influencer && (await bcrypt.compare(password, influencer.password))) {
		res.json({
			influencer: {
				_id: influencer.id,
				name: influencer.name,
				phone: influencer.phone,
				token: generateToken(influencer._id),
			},
			success: false,
			message: 'Login successful',
		});
	} else {
		res.status(400);
		res.json({
			success: true,
			message: 'Invalid credentials',
		});
	}
});

// @desc Get influencer data
// @route GET /api/influencers/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
	const {
		_id,
		name,
		phone,
		profilePhoto: imageId,
	} = await Influencer.findById(req.influencer.id);

	const image = await Image.findById(imageId);
	const final_image = {
		data: image.img.data.toString('base64'),
		contentType: image.img.contentType,
	};

	res.status(200).json({
		id: _id,
		name,
		phone,
		profilePhoto: final_image,
	});
});

const saveVideo = asyncHandler(async (req, res) => {
	const bucket = firebaseAdmin.storage().bucket()
	const name = saltedMd5(req.file.originalname, 'SUPER-S@LT!')
	const fileName = name + path.extname(req.file.originalname)

	bucket.file(`videos/${req.influencer.id}/${fileName}`).createWriteStream().end(req.file.buffer)

	res.status(201).json({
		success: true,
		message: 'video has been uploaded successfully',
	});
});

const getVideos = asyncHandler(async (req, res) => {
	const bucket = firebaseAdmin.storage().bucket()

	bucket.getFiles()
		.then(response => {
			const videos = response[0].map(v => {
				return ({
					name: v.name,
					contentType: v.metadata.contentType,
				})
			}).filter(v => v.contentType.startsWith('video'))

			res.status(200).json({
				response
			})
		})
		.catch(err => {
			res.send(err)
		})
});

const streamVideo = asyncHandler(async (req, res) => {
	const bucket = firebaseAdmin.storage().bucket()

	bucket.file(req.query.filename).createReadStream().pipe(res)
})

const downloadVideo = asyncHandler(async (req, res) => {
	const bucket = firebaseAdmin.storage().bucket()

	bucket.file(req.params.filename).download().then((response) => {
		res.status(201).json({
			success: true,
			message: "Video has been downloaded successfully"
		})
	})
})

const deleteVideo = asyncHandler(async (req, res) => {
	const bucket = firebaseAdmin.storage().bucket()

	bucket.file(req.query.filename).delete().then((response) => {
		res.status(201).json({
			success: true,
			message: "Video deleted successfully"
		})
	}).catch(err => {
		console.warn(err)
		res.status(500).json({
			success: false,
			message: "Error occurred while deleting this video",
			error: process.env.NODE_ENV === 'production' ? null : err
		})
	})
})


const resetPassword = asyncHandler(async (req, res) => {
	const { newPassword } = req.body
	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(newPassword, salt);

	const influencer = await Influencer.findByIdAndUpdate(req.body.id,
		{
			$set: { password: hashedPassword }
		},
		{ new: true },
		(err, doc) => {
			console.log(err)
		}
	)

	res.status(201).json({
		success: true,
		influencer
	})
})

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '12h',
	});
};

module.exports = {
	registerInfluencer,
	loginInfluencer,
	getMe,
	resetPassword,
	getVideos,
	saveVideo,
	streamVideo,
	downloadVideo,
	deleteVideo
};
