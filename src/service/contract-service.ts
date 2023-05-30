
import ApiError from "@/exceptions/api-error";
import ContractModel, {Contract} from "@/models/contract-model";
import userService from "./user-service";
import UserDto from "@/dtos/user-dto";
import ConferenceModel, {Conference} from "@/models/conference-model";



class ContractService {
    async createContract(from: string, to: string): Promise<Conference> {
        const contract = await ContractModel.findOne({$or: [
            {
                from,
                to
            },
            {
                from: to,
                to: from
            }
        ]})

        if (contract) {
            throw ApiError.BadRequest('This users already friends')
        } 

        await ContractModel.create({
            from,
            to,
            isAccepted: true
        })

        const createdConference = await ConferenceModel.create({
            users: [from, to],
            unreadMessageCount: 0
        })

        // console.log(createdConference)

        return createdConference

    }

    async getFriendListFromId(id: string): Promise<(UserDto | void)[]> {

        const friendsId: string[] = []

        const contracts = await ContractModel.find({$or: [
            {
                from: id
            },
            {
                to: id
            }
        ]})

        for (const contract of contracts) {
            friendsId.push(contract.from === id ? contract.to : contract.from)
        }

        const friends: (UserDto | void)[] = await Promise.all(
                friendsId.map(friendId => 
                    userService.findOneById(friendId)
                )
            )


        return friends

    }

    async deleteFriend(userId: string, friendId: string): Promise<{
        status: boolean,
        userId: string
    }> {
        const deletedResult = await ContractModel.deleteOne({$or: [
            {
                from: userId,
                to: friendId
            },
            {
                from: userId,
                to: friendId
            },
        ]})

        const deletedUser = await userService.findOneById(friendId)

        return {
            status: !!deletedResult.deletedCount,
            userId: deletedUser?.id ?? ''
        }
    }

}

export default new ContractService()