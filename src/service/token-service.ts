import jwt from "jsonwebtoken"
import TokenModel, { UserToken } from "@/models/token-model"
import config from "@/config/index"


class TokenService {
    generateTokens(payload: string | object | Buffer) {
        const accessToken: string = jwt.sign(payload, config.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken: string = jwt.sign(payload, config.JWT_REFRESH_SECRET, {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await TokenModel.findOne({user: userId}) 
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await TokenModel.create({user: userId, refreshToken})
        return token
    }

    async removeToken(refreshToken: string) {
        const tokenData = await TokenModel.deleteOne({refreshToken})
        return tokenData
    }

    async findToken(refreshToken: string) {
        const tokenData = await TokenModel.findOne({refreshToken})
        return tokenData
    }


    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, config.JWT_ACCESS_SECRET)
            return userData as UserToken
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, config.JWT_REFRESH_SECRET)
            return userData as UserToken
        } catch (e) {
            return null
        }
    }
}

export default new TokenService()