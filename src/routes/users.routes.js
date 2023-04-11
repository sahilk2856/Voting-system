const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const userValidation=require('../middleware/user')
const usersController=require('../controllers/users.controller');

router.post('/sign-in', userValidation.signinVerificationMiddleware, usersController.signin);
router.post('/sign-up', userValidation.signupVerificationMiddleware, usersController.signup);
router.get('/profile', auth, usersController.profile);
router.post('/updatePassword', auth, usersController.updatePassword);

module.exports = router;    