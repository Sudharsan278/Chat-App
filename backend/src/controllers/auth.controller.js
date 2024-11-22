import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res) => {

    const {name, email, password, gender} = req.body;
    console.log(req.body)
    try {
        
        if(!name || !name || !gender || !password){
            return res.status(400).json({message : "Required credentials are not provided!"});
        }

        if(password.length < 6){
            return res.status(400).json({message : "Password should contain atleast 6 characters"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(401).json({message : "User Already Exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password : hashedPassword,
            gender,
        });

        if(newUser){
            //Generate Token for the user
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({message : "success", newUser});
        }else{
            return res.status(400).json({message : "Invalid User Details!"});
        }


    } catch (err) {
        console.log("Error in signup controller ", err.message)
        return res.status(500).json({message : "Internal Server Error!"});
    }
}

export const login = async (req, res) => {

    const {email, password} = req.body;

    try {

        if(!email || !password){
            return res.status(400).json({message : "Invalid Credentials"});
        }
    
        const user = await User.findOne({email}).select("+password");
        
        if(!user){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const isPasswordMatches = await bcrypt.compare(password, user.password);
    
        if(!isPasswordMatches){
            return res.status(400).json({message : "Invalid Credentials"});
        }
    
        generateToken(user._id, res);
    
        return res.status(200).json({message : "Success", user})
        
    } catch (error) {
        console.log("Error in Login controller!", error.message);
        return res.status(500).json({message : "Internal Server Error!"});
    }
}

export const logout = async (req, res) => {

    try {
        res.cookie("jwt", "", {maxAge : 0});
        res.status(200).json({message : "Logged Out Successfully!"});
    } catch (error) {
        console.log("Error in Logout controller!", error.message);
        return res.status(500).json({message : "Internal Server Error!"});
    }
}

export const updateProfile = async (req,res) => {

    const userId = req.user._id;

    try {
        const {profilePic} = req.body;
    
        if(!profilePic){
            return res.status(400).json({message : "Profile Picture is not provided!"});
        }
    
        const uploadProfilePicture = cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePicture : (await uploadProfilePicture).secure_url}, {new : true}) 
        //profilePicture : uploadProfilePicture.secure_url
    
        return res.status(200).json({message : "Profile Updated!", updatedUser});
    } catch (error) {
        console.log("Error in UpdateProfile Controller", error.message);
        return res.status(500).json({message : "Internal Server Error!"});
    }
}

export const userDetails = (req, res) => {

    try {
        return res.status(200).json({message : "Success", user : req.user});
    } catch (error) {
        console.log("Error in UserDetails Controller", error.message);
        return res.status(500).json({message : "Internal Server Error!"})
    }
} 