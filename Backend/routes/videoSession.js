const express = require('express');
const bookSessionWithJWT = require('../controllers/bookSessionController');
const router = express.Router();

router.post('/book', bookSessionWithJWT);

module.exports = router;
