import express from "express"
import { loginUserController, registerUserController } from "../controllers/authControllers";

export const authRouter = express.Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);