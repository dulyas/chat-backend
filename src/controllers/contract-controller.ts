import contractService from "@/service/contract-service";
import ApiError from "@/exceptions/api-error";
import { NextFunction, Request, Response } from 'express';
import config from "@/config";
import userService from "@/service/user-service";

class ContractController {
    async createContract(req: Request, res: Response, next: NextFunction) {

        try {
            const {from, to} = req.body

            await contractService.createContract(from, to)
            const user = await userService.findOneById(to)

            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async getFriendListFromId(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body

            const users = await contractService.getFriendListFromId(id)

            return res.json(users)

        } catch (e) {
            next(e)
        }
    }

    async deleteFriend(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, friendId } = req.body

            const deletedData = await contractService.deleteFriend(userId, friendId)

            return res.json(deletedData)

        } catch (e) {
            next(e)
        }
    }

}

export default new ContractController()