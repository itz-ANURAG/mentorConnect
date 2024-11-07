const express = require('express');
const mongoose = require('mongoose');
const Mentee = require('../models/Mentee');  // Import Mentee model
const Tag = require('../models/Tag');        // Import Tag model
const Review = require('../models/Review');
const router = express.Router();

router.get('/joinedCommunities', async (req, res) => {
    
});


module.exports = router;