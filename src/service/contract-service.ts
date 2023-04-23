import config from "@/config";
import ApiError from "@/exceptions/api-error";
import ContractModel from "@/models/contract-model";

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
}

export default new ContractService()