import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUserController(req: Request, res: Response){
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message: "All the fields are required"
        })
    }

    const isUserAlreadyExist = await userModel.findOne({$or:[
        {username},
        {email}
    ]})

    if(isUserAlreadyExist){
        return res.status(422).json({
            message: "User already exists"
        })
    }

    const newUser = await userModel.create({
        email,
        username,
        password
    })

    await newUser.save();

    const JWT_SECRET = process.env.JWT_SECRET;

    if(!JWT_SECRET){
        return res.status(500).json({
            message: "JWT secret is not defined in environment variables"
        })
    }

    const token = jwt.sign({id: newUser._id, username: newUser.username}, JWT_SECRET, {expiresIn: "1h"});

    res.cookie("token", token);


    res.status(201).json({
        message: "User created successfully",
        user: {
            email: newUser.email,
            username: newUser.username
        }
    })

}

export async function loginUserController(req: Request, res: Response){
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message: "All the fields are required"
        })
    }

    const isUserExists = await userModel.findOne({email}).select("+password");

    if(!isUserExists){
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, isUserExists.password);
    
    if(!isPasswordCorrect){
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if(!JWT_SECRET){
        return res.status(500).json({
            message: "JWT secret is not defined in environment variables"
        })
    }

    const token = jwt.sign({id: isUserExists._id, username: isUserExists.username}, JWT_SECRET, {expiresIn: "1h"})

    res.cookie("token", token);

    // If email and password are correct, return success response
    res.status(200).json({
        message: "Login successful",
        user: {
            email: isUserExists.email,
            username: isUserExists.username
        }
    })

    
}