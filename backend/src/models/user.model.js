import mongoose from "mongoose";
import validator from "validator"

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
    }
}, {timestamps : true}); 

const User = mongoose.model("User", userSchema);

export default User;