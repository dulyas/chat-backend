import ConferenceModel, { Conference } from "@/models/conference-model";
import { DeleteResult } from "mongodb";

class ConfereceService {
    async getAllUserChats(id: string): Promise<Conference[]> {
        const chats = await ConferenceModel.find({usersIds: id})
        // console.log(chats)
        return chats
    }

    async delete(id: string): Promise<boolean> {
        // console.log(id)
        const conference = await ConferenceModel.deleteOne({_id: id})
        // console.log(conference)
        return !!conference.deletedCount
    }
}

export default new ConfereceService()