import mongoose from "mongoose";

interface blacklistInterface {
    token: string
}

const blacklistSchema = new mongoose.Schema<blacklistInterface>({
    token:{
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps: true})

export const blacklistModel = mongoose.model("blacklist", blacklistSchema);