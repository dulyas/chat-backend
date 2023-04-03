import UserModel from "../models/user-model.js"
import bcrypt from 'bcrypt'
import {v4} from 'uuid';
import mailService from "./mail-service.js"
import tokenService from "./token-service.js"
import UserDto from "../dtos/user-dto.js"
import config from "../config/index.js";
import ApiError from "../exceptions/api-error.js";

class UserService {

    async generateAndSaveTokens(user) {
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            tokens,
            userDto
        }
    }

    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest('Email already exist')
        } 
        const hashPassword = await bcrypt.hash(password, 3)

        const activationLink = v4()
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${config.API_URL}/api/activate/${activationLink}`)
        
        const {tokens, userDto} = await this.generateAndSaveTokens(user)

        return {
            ...tokens,
            user: userDto
        }

    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw new ApiError.BadRequest('wrong link')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('Пользователь не был найден')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }

        const {tokens, userDto} = await this.generateAndSaveTokens(user)

        return {
            ...tokens,
            user: userDto
        }

    }

    async logout(refreshToken) {
        const token = tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)

        const {tokens, userDto} = await this.generateAndSaveTokens(user)

        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        try {
            const users = await UserModel.find()
            return users
        } catch (e) {
            console.log(e)
        }
    }
}

export default new UserService()