import express from "express";
import { connectDB } from "./config/db";

export const app = express();

connectDB();


