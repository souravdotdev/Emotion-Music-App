import mongoose from "mongoose"
import type { UserType } from "../../types"

const userSchema = new mongoose.Schema<UserType>({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"],
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
        lowercase: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    }
})

export const userModel = mongoose.model("users", userSchema);

