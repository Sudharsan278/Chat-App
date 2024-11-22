import mongoose from "mongoose";
import validator from "validator"

const userSchema = new mongoose.Schema({

    name : {
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

    gender : {
        type : String,
        required : true,
        lowercase : true,
        enum : ["male", "female"],
        validate : {
            validator : function (value){
                return ["male", "female"].includes(value.toLowerCase())
            },
            message : "Gender Must be either Male or Female"
        }
    },
    
    profilePicture : {
        type : String,
        default : ""
    }
}, {timestamps : true}); 

const User = mongoose.model("User", userSchema);

export default User;