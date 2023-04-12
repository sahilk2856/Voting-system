const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const bodyParser = require('body-parser');
const twilio = require('twilio');
const userValidation=require('../middleware/user')
const usersController=require('../controllers/users.controller');

router.post('/sign-in', userValidation.signinVerificationMiddleware, usersController.signin);
router.post('/sign-up', userValidation.signupVerificationMiddleware, usersController.signup);
router.get('/profile', auth, usersController.profile);
router.get('/searchLocation', usersController.searchLocation);
router.post('/updatePassword',  usersController.updatePassword);
router.post('/send-otp',  usersController.sendOtp);
router.post('/verify-otp',  usersController.verifyOtp);


module.exports = router;    