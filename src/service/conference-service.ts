import UserDto from "@/dtos/user-dto";
import ApiError from "@/exceptions/api-error";
import ConferenceModel, { Conference } from "@/models/conference-model";
import { User } from "@/models/user-model";
import { DeleteResult } from "mongodb";
import messageService from "./message-service";

class ConfereceService {
	async getAllUserChats(id: string): Promise<Conference[]> {
		const chats = await ConferenceModel.find({ users: id });
		// console.log(chats)
		return chats;
	}

	async delete(id: string): Promise<boolean> {
		// console.log(id)
		const conference = await ConferenceModel.deleteOne({ _id: id });

		const deleteMessages = await messageService.deleteFromConferenceId(id);

		// console.log(conference)
		return !!conference.deletedCount;
	}

	async getConferenceById(id: string): Promise<Conference> {
		const conference = await ConferenceModel.findById(id);

		if (!conference) throw ApiError.BadRequest("no conference for this id");

		return conference;
	}

	async getRoomDataById(id: string): Promise<Conference> {
		// console.log(id)
		const conference = await ConferenceModel.findById(id)
			.populate("users")
			.lean();

		if (!conference) throw ApiError.BadRequest("no conference for this id");

		conference.users = conference.users.map((user) =>
			user instanceof UserDto ? user : new UserDto(user),
		);

		return conference;
	}
}

export default new ConfereceService();
