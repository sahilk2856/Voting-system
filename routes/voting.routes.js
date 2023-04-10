const express = require('express');
const router = express.Router();

const votingConroller=require('../controllers/candidates.controller');

router.get('/vote', votingConroller.vote);

module.exports = router;