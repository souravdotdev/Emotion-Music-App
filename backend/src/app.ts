import express from "express";
import { connectDB } from "./config/db";
import { authRouter } from "./routes/authRoutes";

export const app = express();
connectDB();

app.use(express.json());

app.use("/api/auth", authRouter);


