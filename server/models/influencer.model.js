const mongoose = require('mongoose');

const influencerSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a full name'],
		},
		phone: {
			type: String,
			required: [true, 'Please add a phone'],
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
		},
		profilePhoto: {
			type: String,
		},
		// videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
		category: {
			type: String,
			enum: {
				values: [
					'Footballer',
					'Singer',
					'Influencer',
					'Dancer',
					'Content creator',
				],
				message: '{VALUE} is not supported',
			},
			default: 'Influencer',
		},
		available: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
