import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.io.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../lib/socket.io.js";

export const getSideBarUsers = async (req, res) => {

    try {

        const loggedUserId = req.user._id;
        const sideBarUsers = await User.find({_id : {$ne : loggedUserId}});

        return res.status(200).json({message : "Success", sideBarUsers});

    } catch (error) {
        console.log("Error in sideBarUsers Controller", error.message);
        return res.status(500).json({message : "Internal Server Error!"});
    }
}

export const getMessagesBetweenUsers = async (req, res) => {

    try {
        
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or : [
                {senderId, receiverId},
                {senderId : receiverId, receiverId : senderId}
            ]
        })

        // console.log(messages);

        return res.status(200).json({message : "Success" , messages});
    } catch (error) {
        console.log("Error in getMessagesBetweenUsers Controller!", error.message);
        return res.status(500).json({message : "Internal Server Error!"});
    }
}

export const sendMessageToUser = async (req, res) => {

    try {
        
        const{text, image} = req.body;
        const {id: receiverId} = req.params;

        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;      
        }

        const newMessage = new Message ({
            senderId,
            receiverId,
            image : imageUrl,
            message : text
        });

        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId);

        if(receiverSocketId) //User is online
            io.to(receiverSocketId).emit("newMessage", newMessage);

        return res.status(201).json({message : "Success", newMessage});
    } catch (error) {
        console.log("Error in sendMessageToUser Controller!", error.message);
        return res.status(500).json({message : "Internal Server Error!"});
    }
}