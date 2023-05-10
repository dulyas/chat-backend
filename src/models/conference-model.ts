import { Schema, model } from "mongoose";
import { Message } from "./message-model";

export interface Conference {
    id: string
    usersIds: string[]
    avatarUrl: string
    lastMessage: Message
    unreadMessageCount: number 
}

const ConferenceSchema = new Schema<Conference> ({

    usersIds: {
        type: [String],
        required: true
    },

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