import { Request, Response } from "express";
import { userModel } from "../models/userModel";

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

    res.status(201).json({
        message: "User created successfully",
        user: {
            email: newUser.email,
            username: newUser.username
        }
    })
}