const express = require('express');
const router = express.Router();

const votingController= require('../controllers/candidates.controller');

router.get('/vote', votingController.vote);

module.exports = router;