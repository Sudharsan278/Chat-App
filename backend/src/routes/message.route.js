import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessagesBetweenUsers, getSideBarUsers, sendMessageToUser } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/getusers", protectRoute, getSideBarUsers)
router.get("/:id" , protectRoute, getMessagesBetweenUsers);
router.post("/send/:id", protectRoute, sendMessageToUser)

export default router;