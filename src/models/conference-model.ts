import { Schema, model } from "mongoose";
import { Message } from "./message-model";
import { ObjectId } from "mongodb";
import { User } from "./user-model";
import UserDto from "@/dtos/user-dto";

export interface Conference {
    id: string
    users: (User | UserDto)[]
    avatarUrl: string
    lastMessage: Message
    unreadMessageCount: number 
}



const ConferenceSchema = new Schema<Conference> ({

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],

    unreadMessageCount: {
        type: Number,
        required: true,
        default: 0
    },

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    },

    avatarUrl: {
        type: String
    },

    id: {
        type: String
    }

})



export default model<Conference>('Conference', ConferenceSchema)