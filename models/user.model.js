const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
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
    area: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        require: true
    }
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