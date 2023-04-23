import { Schema, model } from "mongoose";

export interface Contract {
    from: string
    to: string
    isAccepted: boolean
}

const ContractSchema = new Schema<Contract> ({

    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    isAccepted: {
        type: Boolean,
        required: true
    }


})



export default model<Contract>('Contract', ContractSchema)