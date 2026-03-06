import express from "express"
import { getMeController, loginUserController, logoutUserController, registerUserController } from "../controllers/authControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

export const authRouter = express.Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.get("/getme", authMiddleware, getMeController);
authRouter.get("/logout", logoutUserController);