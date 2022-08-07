require('dotenv').config();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Influencer = require('../models/influencer.model');
const Image = require('../models/image.model');

// @desc Register new influencer
// @route POST /api/influencers
// @access Public
const registerInfluencer = asyncHandler(async (req, res) => {
	const { fullName, email, password } = req.body;
	if (!fullName || !email || !password) {
		res.status(400);
		throw new Error('Please add all fields');
	}

	// Check if the influencer already exists
	const influencerExists = await Influencer.findOne({ email });
	if (influencerExists) {
		res.status(400);
		res.json({ success: false, msg: 'Influencer already exist' });
	}

	// Get profile image id
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
		fullName,
		email,
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
				fullName: influencer.fullName,
				email: influencer.email,
				token: generateToken(influencer._id),
			},
			success: true,
			msg: 'influencer registred successfully',
		});
	} else {
		res.status(400);
		res.json({ success: false, msg: 'Invalid credentials' });
	}
});

// @desc Authenticate a influencer
// @route POST /api/influencers/login
// @access Public
const loginInfluencer = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const influencer = await Influencer.findOne({ email });

	if (influencer && (await bcrypt.compare(password, influencer.password))) {
		res.json({
			influencer: {
				_id: influencer.id,
				name: influencer.name,
				email: influencer.email,
				token: generateToken(influencer._id),
			},
			empty: false,
			msg: 'Login successful',
		});
	} else {
		res.status(400);
		res.json({
			empty: true,
			msg: 'Invalid credentials',
		});
	}
});

// @desc Get influencer data
// @route GET /api/influencers/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
	const {
		_id,
		fullName,
		email,
		profilePhoto: imageId,
	} = await Influencer.findById(req.influencer.id);

	const image = await Image.findById(imageId);
	const final_image = {
		data: image.img.data.toString('base64'),
		contentType: image.img.contentType,
	};

	res.status(200).json({
		id: _id,
		fullName,
		email,
		profilePhoto: final_image,
	});
});

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '12h',
	});
};

module.exports = {
	registerInfluencer,
	loginInfluencer,
	getMe,
};
