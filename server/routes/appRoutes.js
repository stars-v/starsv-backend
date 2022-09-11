const express = require('express');
const Grid = require('gridfs-stream');
const { default: mongoose } = require('mongoose');
const { connection } = require('../config/db');
const Influencer = require('../models/influencer.model');

const router = express.Router()


router.get('/influencers', async (req, res) => {
    const influencers = await Influencer.find({})

    return res.status(200).json({
        influencers
    })
});



module.exports = router;
