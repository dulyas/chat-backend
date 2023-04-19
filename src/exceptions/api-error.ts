import { ValidationError } from "express-validator"


export default class ApiError extends Error {
    status: number
    errors?: ValidationError[]

    constructor(status: number, message: string, errors?: ValidationError[]) {
        super(message) 
        this.status = status 
        if (errors) this.errors = errors
    }

    static UnauthorizedError() {
        return new ApiError(401, "Пользователь не зарегистрирован")
    }

    static BadRequest(message: string, errors: ValidationError[] = []) {
        return new ApiError(400, message, errors)
    }
}