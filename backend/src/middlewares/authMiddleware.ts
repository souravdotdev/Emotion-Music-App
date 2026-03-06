import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Token not found"
        })
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if(!JWT_SECRET){
        return res.status(500).json({
            message: "JWT secret is not defined in environment variables"
        })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {id: string, username: string}

    if(!decoded || typeof decoded === "string"){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    req.user = decoded;

    if(!req.user){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    next();
}