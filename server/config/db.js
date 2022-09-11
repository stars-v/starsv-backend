require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const mongoUri = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : "mongodb://localhost:27017/StarsV"
		const conn = await mongoose.connect(
			mongoUri
		);
		console.log(
			`Mongodb connected: ${conn.connection.host}`.cyan.underline
		);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

const connection = mongoose.connection

module.exports = {
	connectDB,
	connection
};
