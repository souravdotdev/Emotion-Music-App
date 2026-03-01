import express from "express"
import { registerUserController } from "../controllers/authControllers";

export const authRouter = express.Router();

authRouter.post("/register", registerUserController);