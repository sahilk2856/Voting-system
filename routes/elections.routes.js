const express = require('express');
const router = express.Router();

const votingConroller=require('../controllers/elections.controller');

router.post('/voting', votingConroller.vote);

module.exports = router;