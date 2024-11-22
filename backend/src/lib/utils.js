import jwt from "jsonwebtoken"
import dotenv from "dotenv"

export const generateToken = (userId, res) => {

    dotenv.config();
    
    const token = jwt.sign({userId}, process.env.SECRET_KEY, {
        expiresIn : "7d"
    });

    res.cookie("jwt", token, {
        maxAge : 7 * 24 * 60 * 60 * 100,
        httpOnly: true, //prevents XSS attacks (cross-site scripting attacks)
        sameSite : "strict", //CSRF attacks (cross-site request forgery attacks)
        secure : process.env.NODE_ENV !== "development"
         
    })
    return token;
}