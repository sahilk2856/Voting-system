const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user.model");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) {
      throw new ErrorHandler(" Email already registered", 400);
    }

    const password = req.body["password"];
    console.log("password -->", password);
    // const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password,
      phone: req.body.phone,
      age: req.body.age,
      area: req.body.area,
      gender: req.body.gender,
    });
    await newUser.save();

    return res.json({
      success: true,
      data: "user registered successfully",
      // user:newPerson
    });
  } catch (error) {
    next(error);
  }
};

module.exports.signin = async (req, res, next) => {
  try {
    //console.log(req)
    const phone = req.body.phone;
    const password = req.body.password;

    const user = await User.findOne({ phone });

    if (!user) throw new ErrorHandler("No user found", 404);
    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) throw new ErrorHandler("Incorrect password", 412);

    const payload = {
      id: user.id,
      // name: user.name,
      // email: user.email,
      // phone: user.phone,
    };

    const jwtParams = { expiresIn: 3600 };
    const token = jsonwt.sign(payload, process.env.JWT_KEY, jwtParams);

    return res.status(200).json({
      success: true,
      data: { token },
      // user:newPerson
    });
  } catch (error) {
    next(error);
  }
};

module.exports.profile = async (req, res, next) => {
  try {
    // const email = req.body.email;

    const user = await User.findById(req._id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.updatePassword = async (req, res, next) => {
  try {
    // const userId = req.body.userId;

    const password = req.body.password;

    const data = await User.findOne({ _id: req._id });

    if (data) {
      const newPassword = await securePassword(password);

      const userData = await User.findByIdAndUpdate(
        { _id: req._id },

        {
          $set: {
            password: newPassword,
          },
        }
      );

      return res
        .status(200)
        .send({ success: true, data: "password updated"});
    }
  } catch (error) {
    next(error);
  }
};
