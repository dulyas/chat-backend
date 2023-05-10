import ConferenceModel, { Conference } from "@/models/conference-model";

class ConfereceService {
    async getAllUserChats(id: string): Promise<Conference[]> {
        const chats = await ConferenceModel.find({usersIds: id})
        console.log(chats)
        return chats
    }
}

export default new ConfereceService()