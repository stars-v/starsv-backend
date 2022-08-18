require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { fullName, email, password } = req.body;
	if (!fullName || !email || !password) {
		res.status(400);
		throw new Error('Please add all fields');
	}

	// Check if the user already exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		res.json({ success: false, msg: 'User already exist' });
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	// Create user
	const user = await User.create({
		fullName,
		email,
		password: hashedPassword,
	});

	if (user) {
		res.status(201).json({
			user: {
				_id: user.id,
				fullName: user.fullName,
				email: user.email,
				token: generateToken(user._id),
			},
			success: true,
			msg: 'User registred successfully',
		});
	} else {
		res.status(400);
		res.json({ success: false, msg: 'Invalid credentials' });
	}
});

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.json({
			user: {
				_id: user.id,
				name: user.name,
				email: user.email,
				token: generateToken(user._id),
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

// @desc Get user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
	const { _id, fullName, email } = await User.findById(req.user.id);
	res.status(200).send({
		id: _id,
		fullName,
		email,
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
};
