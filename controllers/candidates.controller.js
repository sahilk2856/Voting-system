const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const Candidate = require("../models/candidate.model");

module.exports.vote = async (req, res, next) => {
  try {
    // const email = req.body.email;
    
    const candidate = await Candidate.find()
    console.log('this is candidate :'+candidate)
      return res.status(200).json({ success: true, data: candidate });
     } catch (error) {
      next(error);
     }
};