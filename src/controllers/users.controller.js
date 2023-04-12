const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const twilio = require('twilio');
const bodyParser = require('body-parser');
const User = require("../models/user.model");
//const GoogleStrategy = require('passport-google-oauth20').Strategy;

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const signup = async (req, res, next) => {
  try {
    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) {
      throw new Error(" Email already registered", 400);
    }

    const password = req.body["password"];
    //console.log("password -->", password);
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

const signin = async (req, res, next) => {
  try {
    //console.log(req)
    const phone = req.body.phone;
    const password = req.body.password;

    const user = await User.findOne({ phone });

    if (!user) throw new Error("No user found", 404);
    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) throw new Error("Incorrect password", 412);

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

const profile = async (req, res, next) => {
  try {
    // const email = req.body.email;

    const user = await User.findById(req._id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
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

const searchLocation = async (req, res,next) => {
  const { state, district, sector  } = req.query;
  try{
  const results = await searchLocation.find({
    state: { $regex: new RegExp(state, 'i') },
    sector: { $regex: new RegExp(sector, 'i') },
    district: { $regex: new RegExp(district, 'i') }
  });
  res.status(200).json({
    success: true,
    data: results
})
}
catch (error) {
next(error)
}
}
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: config.google.clientID,
//       clientSecret: config.google.clientSecret,
//       callbackURL: config.google.callbackURL,
//     },
//     const GoogleStrategy = async (accessToken, refreshToken, profile, done) => {
//       try {
//         const user = await User.findOne({ socialId: profile.id, provider: 'google' });
//         if (user) {
//           return done(null, user);
//         }
//         const newUser = await User.create({
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           socialId: profile.id,
//           provider: 'google',
//         });
//         done(null, newUser);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );

// Send OTP 
const sendOtp =  async (req, res) => {
  const { mobileNumber } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
  const accountSid = 'your_account_sid';
  const authToken = 'your_auth_token';
  const client = twilio(accountSid, authToken);
  
  try {
    await User.findOneAndDelete({ mobileNumber }); // Delete any existing user with the same mobile number
    const newUser = new User({ mobileNumber, otp });
    await newUser.save();
    
    // Send the OTP to the user's mobile number
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: 'your_twilio_phone_number',
      to: mobileNumber
    });
    res.status(200).send('OTP sent successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

// Verify OTP 
const verifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;
  try {
    const user = await User.findOne({ mobileNumber, otp });
    if (!user) {
      res.status(400).send('Invalid OTP');
    } else {
      res.status(200).send('OTP verified successfully');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};


 module.exports = {signin,signup,securePassword,updatePassword,profile,searchLocation, sendOtp, verifyOtp}