import ApiError from "@/exceptions/api-error";
import tokenService from "@/service/token-service";


export default function(req, res, next) {
    try {
        const authrizationHeader = req.headers.authorization

        if (!authrizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        const accessToken =  authrizationHeader.split(' ')[1]

        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)

        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()

    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}