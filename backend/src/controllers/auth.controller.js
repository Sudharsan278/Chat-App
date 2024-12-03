import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js"
import crypto from 'crypto'
import { sendEmail } from "../lib/mail.js";

export const signup = async (req,res) => {

    const {fullName, email, password} = req.body;
    // console.log(req.body)
    try {
        
        
        if(!fullName  || !email || !password){
           
            return res.status(400).json({message : "Required credentials are not provided!"});
        }

        if(password.length < 6){
          
            return res.status(400).json({message : "Password should contain atleast 6 characters"});
        }

        if(fullName.length < 3){
            return res.status(400).json({message : "Name should contain atleast 3 characters"});
        }

        const user = await User.findOne({email});

        if(user){
           
            return res.status(401).json({message : "User Already Exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password : hashedPassword,
            
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
        const user = await User.findByIdAndUpdate(userId, {profilePic : (await uploadProfilePicture).secure_url}, {new : true}) 
        //profilePicture : uploadProfilePicture.secure_url
    
        return res.status(200).json({message : "Profile Updated!", user});
    } catch (error) {
        console.log("Error in UpdateProfile Controller", error.message);
        return res.status(500).json({message : "Internal Server Error!"});
    }
}

export const updateName = async (req, res) => {

   try {
    
        const userId = req.user._id;
        const {fullName : updatedFullName} = req.body;

        if(!updatedFullName || updatedFullName.trim().length < 3)
            return res.status(400).json({message : "Name should contain atleast 3 characters!"});

        const user = await User.findByIdAndUpdate(userId, {fullName : updatedFullName}, {new : true});

        if(!user)
            return res.status(404).json({message : "Invalid Credentials!"});

        return res.status(200).json({message : "Success", user});

   } catch (error) {
        console.log("Error in updateName Controller :- ", error.message);
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

export const forgotPassword = async (req, res) => {

    try {
    
        const {email} = req.body;

        if(!email)
            return res.status(400).json({message : "Email not Provided!"});

        const user = await User.findOne({email});

        if(!user)
            return res.status(404).json({message : "Invalid Credentials!"});

        const resetToken = user.createPasswordResetToken();

        await user.save({validateBeforeSave : false});

        const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
        const message = `We have received a request to change your password. If you did not make this request, please ignore this email.

        To reset your password, click on the link below:
        
        ${resetURL}
        
        Please note that this password reset link will expire in 10 minutes for security purposes.`;

        try{
            await sendEmail({
                email : user.email,
                subject : 'Request to change the Password!',
                message : message

            })
            return res.status(200).json({message : 'Password Reset email sent successfully!'})

        }catch(error){

            user.passwordResetToken = undefined;
            user.passwordResetTokenExpires = undefined;
            user.save({validateBeforeSave : false});

            return res.status(500).json({message : 'There was an error in sending the password reset email. Please try again later! '})
        }
        
    } catch (error) {
        console.log('Error in forgotPassword controller ',error.message)
        return res.status(500).json({message : "Internal Server Error!"})
    }
}

export const resetPassword = async (req, res) => {

    try {
        
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({passwordResetToken : token, passwordResetTokenExpires : {$gt : Date.now()}});

        if(!user)
            return res.status(400).json({message : "Provided Password Reset Token is invalid or expired!"})


        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.passwordChangedAt = Date.now();

        await user.save();

        return res.status(200).json({message : "Password Changed Successfully!"});

    }catch (error) {
        console.log("Error in resetPassword controller ",error.message);
        return res.status(500).json({message : "Internal Server Error!"});
    }
}