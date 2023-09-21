require('dotenv').config();
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const { errorHandler } = require('./server/middleware/errorMiddleware');
const connectToDatabase = require('./server/config/db');

const app = express();

// Connect to database
connectToDatabase();

// CORS configuration
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Check whether the server is running
app.get('/health', (req, res) => {
	res.json({ message: 'Server is running...' });
});

app.use('/api/users', require('./server/routes/userRoutes'));
app.use('/api/influencers', require('./server/routes/influencerRoutes'));

app.use(errorHandler);

module.exports = app;
