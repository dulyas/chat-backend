import { Schema, model } from "mongoose";

export interface User {
    email: string
    password: string
    isActivated: boolean
    activationLink: string
    _id: string
    name: string
    avatarUrl: string
}

const UserSchema = new Schema<User> ({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    activationLink: {
        type: String
    },
    avatarUrl: {
        type: String
    },
    name: {
        type: String
    }
})



export default model<User>('User', UserSchema)