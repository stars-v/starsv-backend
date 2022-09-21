const app = require("../app");
const mongoose = require("mongoose");
const assert = require('node:assert')
const request = require("supertest");


beforeEach((done) => {
  mongoose.connect("mongodb://localhost:27017/starsvTest",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});


test('GET influencers', async (req, res) => {
  request(app)
    .get('/api/app/influencers')
    .expect('Content-Type', /json/)
    .expect(function (res) {
      return Array.isArray(res.body.influencers)
    })
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      return done();
    })
})