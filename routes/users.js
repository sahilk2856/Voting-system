const express = require('express');
const router = express.Router();

const usersConroller=require('../controllers/users_controller');

router.get('/sign-in', usersConroller.signIn);
router.post('/sign-up', usersConroller.signUp);

module.exports = router;    