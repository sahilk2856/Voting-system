const Joi = require("joi");
const signupVerification = Joi.object().keys({
  name: Joi.string().min(1).required(),
  email: Joi.string().email(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().min(10).required(),
  age: Joi.string().min(2).required(),
  gender: Joi.string().min(1).required(),
  area: Joi.string().min(3).required(),
});

const signinVerification = Joi.object().keys({
  phone: Joi.string().min(10).required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  signupVerification,
  signinVerification
};