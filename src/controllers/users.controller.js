const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const User = require("../models/user.model");
const {sendWelcomeEmail} = require('../utils/mail')
const Otp = require("../models/otp.model");
const fast2sms = require('fast-two-sms')
//const GoogleStrategy = require('passport-google-oauth20').Strategy;
require ('dotenv').config();

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const signup = async (req, res, next) => {
  const { name, email, area, age, phone, gender} = req.body
  try {
    if (!name || !email || !area ||!age || !phone || !gender) {
      throw new Error("All the fields should be valid", {
          cause: { status: 400 }
      })
  }
    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) {
      throw new Error(" Email already registered", 400);
    }
    const password = req.body["password"];
    //const Otp = Math.floor(1000 + Math.random() * 9000).toString();
    //console.log("password -->", password);
    // const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User(req.body)
    await newUser.save();
    const OTP = require('./models/otp');

    //sendWelcomeEmail(req.body.email,Otp)
    return res.json({
      success: true,
      data: "user registered successfully",
      // user:newPerson
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async(email)=>{
  try{
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const data = new Otp({email:email,otp:otp})
  .save()
  sendWelcomeEmail(req.body.email,Otp)
  res.status(200).json({
    success: true,
    data: data
})
}catch (error){
   next(error)
}
}

const verifyOtp =  async (email,otp) =>{
  const otp = await Otp.findOne({email:email})
  if(otp.otp === otp){
    
  }
   
}

const signin = async (req, res, next) => {
  try {
    //console.log(req)
    const phone = req.body.phone;
    const password = req.body.password;
    //const Otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    const user = await User.findOne({ phone });

    if (!user) throw new Error("No user found", 404);
    console.log(user)
    const checkPass = await bcrypt.compare(password, user.password);
    console.log(checkPass);

    if (!checkPass) throw new Error("Incorrect password", 412);

    const payload = {
      id: user.id,
      // name: user.name,
      // email: user.email,
      // phone: user.phone,
    };
    // console.log(Otp)
    // sendWelcomeEmail(Otp)
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
    //const email = req.body.email;

    const user = await User.findById(req._id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    //const useId = req.body.userId;

    const password = req.body.password;
    console.log(req._id)
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

// 


// async function sendOtp(phone) {
//   // Check if the phone number is already verified
//   const user = await User.findOne({ phone });
//   if (user && user.phoneVerified) {
//     throw new Error('Phone number is already verified');
//   }

//   // Generate a random OTP code
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   console.log(otp)

//   // Save the OTP code and its expiration time to the user document
//   const now = new Date();
//   const expires = new Date(now.getTime() + 10 * 60 * 1000); // OTP code will expire in 10 minutes
//   await User.updateOne({ phone }, { otp, otpExpires: expires });

//   // Send the OTP code to the user's phone number using Nexmo
//   const from = 'Your App';
//   const to = `+${phone}`;
//   const text = `Your OTP code is: ${otp}`;
//   nexmo.message.sendSms(from, to, text, (err, responseData) => {
//     if (err) {
//       console.error(`Failed to send OTP code to ${phone}:`, err);
//       throw new Error('Failed to send OTP code');
//     } else {
//       console.log(`OTP code sent to ${phone}: ${responseData.messages[0]['message-id']}`);
//     }
//   });
// }

// async function verifyOtp(phone, otp) {
//   // Check if the OTP code is valid and not expired
//   const user = await User.findOne({ phone });
//   if (!user || user.otp !== otp || user.otpExpires < new Date()) {
//     throw new Error('Invalid OTP code');
//   }

//   // Mark the phone number as verified
//   await User.updateOne({ phone }, { phoneVerified: true });
// }
// var options = {authorization:   process.env.API_KEY,message : "hiii",numbers: ['6263636197']}
// const sendOtp = async(req,res) => {
//  const response =  await fast2sms.sendMessage(options)
//   res.send(response)
// }

 module.exports = {signin,signup,securePassword,updatePassword,profile,searchLocation,verifyEmail,verifyOtp }