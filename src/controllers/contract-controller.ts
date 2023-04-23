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

}

export default new ContractController()