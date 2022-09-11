require('dotenv').config();
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const { errorHandler } = require('./server/middleware/errorMiddleware');
const { connectDB } = require('./server/config/db');


const app = express();

connectDB();


app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.send("Server running...")
});

app.use('/api/users', require('./server/routes/userRoutes'));
app.use('/api/influencers', require('./server/routes/influencerRoutes'));
app.use('/api/app', require('./server/routes/appRoutes'))

app.use(errorHandler);

module.exports = app;
