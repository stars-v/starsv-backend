const app = require('../app');
const mongoose = require('mongoose');
// const assert = require('node:assert');
// const { describe, test, it } = require('node:test');
const request = require('supertest');
const {test} = require('node:test');

// beforeAll((done) => {
// 	mongoose.connect(
// 		'mongodb://localhost:27017/starsvTEST',
// 		{ useNewUrlParser: true, useUnifiedTopology: true },
// 		() => done()
// 	);
// });

// afterEach((done) => {
// 	mongoose.connection.db.dropDatabase(() => {
// 		mongoose.connection.close(() => done());
// 	});
// });

test('GET influencers', async (req, res) => {
	request(app)
		.get('/api/influencers')
		.expect('Content-Type', /json/)
		.expect(function (res) {
			return Array.isArray(res.body.influencers);
		})
		.expect(200)
		// .end(function (err, res) {
		// 	if (err) return done(err);
		// 	return done();
		// });
});
