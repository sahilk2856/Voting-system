const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bcryptSalt = process.env.BCRYPT_SALT;
const jsonwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        require: true
    },
    gender:{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        unique: true,
        require: true
    },
      otp: {
        type: String,
        required: true
    },
      createdAt: {
        type: Date,
        default: Date.now(),
        expires: 300 // otp will expire after 5 minutes
    },
    area: {
        type: String,
        enum: ["state", "district", "sector"],
        required: true
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function(){
    const user = this;
    
    user.password = await bcrypt.hash(user.password, 10);
    return user;
});

// userSchema.pre('findOneAndUpdate',async function(){
//     const user = this;
//     if(user.isModified('password')){
//         user.password = await bcrypt.hash(user.password, 10);

//     }
//     return user;
// })

userSchema.methods.toJSON = function (){
    console.log("here in methods")
    const user = this;
    console.log({user})
    const userObj = user.toObject();

    delete userObj.password;
    return userObj;

}

const User = mongoose.model('User', userSchema);


module.exports = User;