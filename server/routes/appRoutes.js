const express = require('express');
const Influencer = require('../models/influencer.model');

const router = express.Router()


router.get('/influencers', async (req, res) => {
    const influencers = await Influencer.find({})

    return res.status(200).json({
        influencers
    })
});



module.exports = router;
