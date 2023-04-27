import config from "@/config";
import ApiError from "@/exceptions/api-error";
import ContractModel from "@/models/contract-model";
import userModel, { User } from "@/models/user-model";
import userService from "./user-service";
import UserDto from "@/dtos/user-dto";
import contractModel from "@/models/contract-model";

class ContractService {
    async createContract(from: string, to: string) {
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

        const createContract = await ContractModel.create({
            from,
            to,
            isAccepted: true
        })

        return createContract

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
        const deletedResult = await contractModel.deleteOne({$or: [
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