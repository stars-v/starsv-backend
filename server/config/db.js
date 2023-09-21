require('dotenv').config();
const mongoose = require('mongoose');

function connectToDatabase() {
	// Replace 'your-database-connection-string' with your actual MongoDB connection string.
	// const connectionString = 'mongodb://localhost:27017/starsv';

	// Connect to the MongoDB database
	mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	// Get the default connection
	const db = mongoose.connection;

	// Handle connection events (optional)
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
	db.once('open', () => {
		console.log('Mongodb connected'.cyan.underline);
	});
}

module.exports = connectToDatabase;
