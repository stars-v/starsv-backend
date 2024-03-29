require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const { validatePhone } = require('../lib/functions/validation');
const firebaseAdmin = require('../config/firebase/admin');

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
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

	// Check if the user already exists
	const userExists = await User.findOne({ phone });
	if (userExists) {
		res.status(400);
		res.json({ success: false, message: 'User already exist' });
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	// Create user
	const user = await User.create({
		name,
		phone,
		password: hashedPassword,
		profilePhoto: null,
	});

	/* const bucket = firebaseAdmin.storage().bucket();
	const imageName = user._id;
	const fileName = imageName + path.extname(req.file.originalname);

	bucket
		.file(`images/profile/${fileName}`)
		.createWriteStream()
		.end(req.file.buffer);

	await User.findByIdAndUpdate(user._id, {
		profilePhoto: fileName,
	}); */

	if (user) {
		// res.send('ok');
		res.json({
			user: {
				_id: user.id,
				name: user.name,
				phone: user.phone,
				profilePhoto: user.profilePhoto,
				token: generateToken(user._id),
			},
			success: true,
			message: 'User was registered successfully',
		});
	} else {
		res.json({
			success: false,
			message: 'Invalid credentials',
		});
	}
});

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
	const { phone, password } = req.body;

	const user = await User.findOne({ phone });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.json({
			user: {
				...user,
				token: generateToken(user._id),
			},
			success: true,
			message: 'Login successful',
		});
	} else {
		res.json({
			success: false,
			message: 'Invalid credentials',
		});
	}
});

// @desc Get user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
	const { _id, name, phone, profilePhoto } = await User.findById(req.user.id);

	res.status(200).json({
		id: _id,
		name,
		phone,
		profilePhoto,
	});
});

const uploadProfilePhoto = asyncHandler(async (req, res) => {
	const bucket = firebaseAdmin.storage().bucket();
	const imageName = req.user.id;
	const fileName = imageName + path.extname(req.file.originalname);

	bucket
		.file(`images/profile/${fileName}`)
		.createWriteStream()
		.end(req.file.buffer);

	await User.findByIdAndUpdate(user._id, {
		profilePhoto: fileName,
	});

	res.status(201).json({
		success: true,
		message: 'Profile photo was uploaded successfully',
	});
});

const getProfilePhoto = asyncHandler(async (req, res) => {
	const { profilePhoto } = await User.findById(req.query.id);

	const bucket = firebaseAdmin.storage().bucket();
	bucket.file(`images/profile/${profilePhoto}`).createReadStream().pipe(res);
});

// const sendVerification = asyncHandler(async (req, res) => {
// 	const user = await User.findById(req.user.id);
// 	const { phone } = user;

// 	client.verify
// 		.services(process.env.VERIFY_SERVICE_SID)
// 		.verifications.create({ to: `+${phone}`, channel: 'sms' })
// 		.then((data) => {
// 			res.status(200).json({
// 				message: 'Verification is sent!!',
// 				phone: req.query.phone,
// 				data,
// 			});
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 			res.status(500).send(e);
// 		});
// });

// const verifyOTP = asyncHandler(async (req, res) => {
// 	const user = await User.findById(req.user.id);
// 	const { phone } = user;

// 	await client.verify
// 		.services(process.env.VERIFY_SERVICE_SID)
// 		.verificationChecks.create({ to: `+${phone}`, code: req.body.otp })
// 		.then((data) => {
// 			if (data.status === 'approved') {
// 				res.status(200).json({
// 					success: true,
// 					message: 'Account is verified',
// 					data,
// 				});
// 			} else {
// 				res.status(400).json({
// 					success: false,
// 					message: 'Account is not verified',
// 					data,
// 				});
// 			}
// 		})
// 		.catch((e) => {
// 			console.log(e);
// 			res.status(500).send(e);
// 		});
// });

const confirmAccount = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(req.user.id, {
		$set: { confirmed: true },
	});
	res.end();
});

const getUserByPhone = asyncHandler(async (req, res) => {
	const user = await User.findOne({
		phone: req.body.phone,
	});

	if (user)
		res.status(201).json({
			success: true,
			message: 'User exists',
			token: generateToken(user._id),
		});
	else
		res.json({
			success: false,
			message: 'User does not exist',
		});
});

const resetPassword = asyncHandler(async (req, res) => {
	const { phone, newPassword } = req.body;
	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(newPassword, salt);

	const user = await User.updateOne(
		{
			phone,
		},
		{
			password: hashedPassword,
		}
	);

	if (user)
		res.status(201).json({
			success: true,
			message: 'Password was changed with success',
		});
	else
		res.status(400).json({
			success: false,
			message: 'Invalid phone number',
		});
});

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '12h',
	});
};

module.exports = {
	registerUser,
	loginUser,
	getMe,
	getUserByPhone,
	getProfilePhoto,
	confirmAccount,
	resetPassword,
};
