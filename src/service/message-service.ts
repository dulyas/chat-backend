// import UserDto from "@/dtos/user-dto";
import ApiError from "@/exceptions/api-error";
// import ConferenceModel, { Conference } from "@/models/conference-model";
// import { User } from "@/models/user-model";
// import { DeleteResult } from "mongodb";
import MessageModel, { Message } from "@/models/message-model";
import { DeleteResult } from "mongodb";

class MessageService {
	async getMessagesForConferenceFromId(roomId: string): Promise<Message[]> {
		const messages = await MessageModel.find({ roomId }).sort({ _id: -1 });

		return messages;
	}

	async deleteFromConferenceId(id: string): Promise<DeleteResult> {
		const deleteResult = await MessageModel.deleteMany({ roomId: id });
		return deleteResult;
	}

	async createMessage(
		roomId: string,
		userId: string,
		textMessage: string,
	): Promise<Message> {
		const message = await MessageModel.create({
			userId,
			roomId,
			readed: false,
			edited: false,
			date: Date.now(),
			textMessage,
		});

		return message;
	}

	async editMessage(
		messageId: string,
		textMessage: string,
	): Promise<Message> {
		const updateStatus = await MessageModel.updateOne(
			{ _id: messageId },
			{
				$set: {
					textMessage,
					edited: true,
				},
			},
		);
		const message = await MessageModel.findById({ _id: messageId });
		if (!updateStatus.matchedCount || !message)
			throw ApiError.BadRequest(`No message with this id, ${messageId}`);
		return message;
	}

	async readMessage(messageId: string): Promise<Message> {
		const updateStatus = await MessageModel.updateOne(
			{ _id: messageId },
			{
				$set: {
					readed: true,
				},
			},
		);
		const message = await MessageModel.findById({ _id: messageId });
		if (!updateStatus.matchedCount || !message)
			throw ApiError.BadRequest(`No message with this id, ${messageId}`);
		return message;
	}

	// async getAllUserChats(id: string): Promise<Conference[]> {
	//     const chats = await ConferenceModel.find({users: id})
	//     // console.log(chats)
	//     return chats
	// }

	// async delete(id: string): Promise<boolean> {
	//     // console.log(id)
	//     const conference = await ConferenceModel.deleteOne({_id: id})
	//     // console.log(conference)
	//     return !!conference.deletedCount
	// }

	// async getConferenceById(id: string): Promise<Conference> {
	//     const conference = await ConferenceModel.findById(id)

	//     if (!conference) throw ApiError.BadRequest('no conference for this id')

	//     return conference
	// }

	// async getRoomDataById(id: string): Promise<Conference> {
	//     // console.log(id)
	//     const conference = await ConferenceModel.findById(id).populate('users').lean()

	//     if (!conference) throw ApiError.BadRequest('no conference for this id')

	//     conference.users = conference.users.map(user => user instanceof UserDto ? user : new UserDto(user))

	//     return conference
	// }
}

export default new MessageService();
