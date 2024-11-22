import express from "express";
import {signup, login, logout, updateProfile, userDetails} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/updateprofile", protectRoute, updateProfile);

router.get("/userdetails", protectRoute, userDetails);

export default router;