import { Schema, model } from "mongoose";
import { User } from "./user-model";
import { Conference } from "./conference-model";

export interface Message {
    userId: User
    roomId: Conference
    readed: boolean
    edited: boolean
    date: Date | number
    textMessage: string
}

const MessageSchema = new Schema<Message> ({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Conference",
        required: true
    },

    readed: {
        type: Boolean,
        required: true,
        default: false
    },

    edited: {
        type: Boolean,
        required: true,
        default: false
    },

    date: {
        type: Schema.Types.Date,
        required: true
    },

    textMessage: {
        type: String,
        required: true
    }

})



export default model<Message>('Message', MessageSchema)