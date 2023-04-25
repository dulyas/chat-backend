import config from "@/config";
import ApiError from "@/exceptions/api-error";
import ContractModel from "@/models/contract-model";
import { User } from "@/models/user-model";
import userService from "./user-service";
import UserDto from "@/dtos/user-dto";

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

    async getFriendListFromId(id: string): Promise<(UserDto | undefined)[]> {

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

        const friends: (UserDto | undefined)[] = await Promise.all(friendsId.map(friendId => userService.findOneById(friendId)))


        return friends

    }
}

export default new ContractService()