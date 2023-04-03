import jwt from "jsonwebtoken"
import TokenModel from "../models/token-model.js"
import config from "../config/index.js"

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({user: userId}) 
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await TokenModel.create({user: userId, refreshToken})
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await TokenModel.deleteOne({refreshToken})
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({refreshToken})
        return tokenData
    }


    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, config.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, config.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }
}

export default new TokenService()