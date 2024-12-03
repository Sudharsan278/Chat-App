import mongoose from "mongoose";
import validator from "validator"
import crypto from 'crypto';

const userSchema = new mongoose.Schema({

    fullName : {
        type : String,
        required : [true,"Enter your name"],
        minlength : [3,"Name should have atleast 3 characters"],
    },

    email : {
        type : String,
        required : [true,"Enter your email"],
        unique : true,
        validate: [validator.isEmail, "Enter a valid Email"]
    },

    password : {
        type : String,
        required : [true,"Please enter a valid password"],
        minlength : [6,"Enter a password with atleast 6 characters"],
        select : false,
    },
    
    profilePic : {
        type : String,
        default : ""
    },

    passwordResetToken : String,
    passwordResetTokenExpires : Date,
    passwordChangedAt : Date

}, {timestamps : true}); 


userSchema.methods.createPasswordResetToken = function () {

    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log('First:- ', resetToken);

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    console.log('Updated or hashed :- ', resetToken);

    return resetToken
}

const User = mongoose.model("User", userSchema);

export default User;