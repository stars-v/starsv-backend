const mongoose = require('mongoose');

const influencerSchema = mongoose.Schema(
	{
		fullName: {
			type: String,
			required: [true, 'Please add a full name'],
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
		},
		profilePhoto: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Image',
		},
	},
	{
		timestamps: true,
	}
);

const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
