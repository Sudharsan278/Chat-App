import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDb } from "./lib/db.js";
import cors from "cors";
import {app, server} from './lib/socket.io.js'

dotenv.config();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json({limit : "10mb"}));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true       
}))
app.set('trust proxy', 1); // Trust the first proxy 

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log("App listending to the port "+PORT);
    connectToDb();
})