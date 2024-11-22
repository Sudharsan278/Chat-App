import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req,res,next) => {

    try {

        console.log(req.cookies);
        const token = req.cookies.jwt;
        
        if(!token){
            return res.status(401).json({message : "Unauthorized => Authentication Token Not Provided!"})
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        if(!decodedToken){
            return res.status(401).json({message : "Unauthorized => Authentication Token is invalid!"});
        }

        const user = await User.findById(decodedToken.userId);

        if(!user){
            return res.status(404).json({message : "User not found!"});
        }

        req.user = user;
        next();
        
    } catch (error) {
        console.log("Error in Protect Route ", error.message);
        return res.status(500).json({message : "Internal Server Error!"});
    }
} 