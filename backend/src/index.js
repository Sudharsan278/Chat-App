import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDb } from "./lib/db.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(cookieParser());
app.use(express.json({limit : "10mb"}));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true       
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
    console.log("App listending to the port "+PORT);
    connectToDb();
})