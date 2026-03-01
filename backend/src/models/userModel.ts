import mongoose from "mongoose"
import type { UserType } from "../../types"
import bcrypt from "bcrypt"

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
        required: [true, "Password is required"],
        select: false
    }
}, {timestamps: true})

userSchema.pre<UserType>("save", async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

export const userModel = mongoose.model("users", userSchema);

