require('dotenv').config();
const mongoose = require('mongoose');

function connectToDatabase() {
	// Replace 'your-database-connection-string' with your actual MongoDB connection string.
	const connectionString =
		'mongodb+srv://mdhamed:GmWIDgt53cm6knv3@cluster0.aimxzsp.mongodb.net/?retryWrites=true&w=majority';

	// Connect to the MongoDB database
	mongoose.connect(connectionString, {
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
