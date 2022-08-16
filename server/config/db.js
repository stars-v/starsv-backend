require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(
			process.env.MONGO_URI || 'mongodb://localhost:27017/starV'
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
