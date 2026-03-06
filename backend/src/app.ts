import express from "express";
import { connectDB } from "./config/db";
import { authRouter } from "./routes/authRoutes";
import cookieParser from "cookie-parser";

export const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);


