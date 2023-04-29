import UserModel, { User } from "@/models/user-model"
import bcrypt from 'bcrypt'
import {v4} from 'uuid';
import tokenService from "@/service/token-service"
import UserDto from "@/dtos/user-dto"
import ApiError from "@/exceptions/api-error";
import { DeleteResult } from "mongodb";
import contractModel from "@/models/contract-model";

class UserService {

    async generateAndSaveTokens(user: User): Promise<any> {
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            tokens,
            userDto
        }
    }

    async registration(email: string, password: string) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest('Email already exist')
        } 
        const hashPassword = await bcrypt.hash(password, 3)

        const activationLink = v4()
        const user = await UserModel.create({email, password: hashPassword, activationLink})

        // await mailService.sendActivationMail(email, `${config.API_URL}/api/activate/${activationLink}`)
        
        const {tokens, userDto} = await this.generateAndSaveTokens(user)

        return {
            ...tokens,
            user: userDto
        }

    }

    async activate(activationLink: string): Promise<void> {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('wrong link')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email: string, password: string) {
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

    async logout(refreshToken: string) :Promise<DeleteResult> {
        const token = tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        const userData: any = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)

        if (!user) throw ApiError.BadRequest('No User for this token')

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

    async findUsers(searchString: string): Promise<UserDto[] | void> {
        try {
            const users = await UserModel.find({
                $or: [
                    {email: {
                        $regex: searchString,
                        $options: 'i'
                    }},
                    {name: {
                        $regex: searchString,
                        $options: 'i'
                    }},
                ]
            })
            return users.map(user => new UserDto(user))
        } catch (e) {
            console.log(e)
        }
    }
    
    async findFriendCandidatesForUserFromId(id: string, searchString: string): Promise<UserDto[] | void> {
        try {

            const users = await this.findUsers(searchString)

            if (users) {
                const alreadyFriends = (await Promise.all(users.map(async user => await contractModel.findOne({$or: [
                    {
                        from: user.id,
                        to: id
                    },
                    {
                        to: user.id,
                        from: id
                    }
                ]}) ? null : user))).filter(user => user instanceof UserDto)



                return alreadyFriends as UserDto[]
            }

            return []

        } catch (e) {
            console.log(e)
        }
    }

    async findOneById(id: string): Promise<UserDto | void> {
        try {
            const user = await UserModel.findById(id)
            
            if (user) {
                return new UserDto(user)
            } else {
                throw ApiError.BadRequest('User not found')
            }
        } catch (e) {
            console.log(e)
        }
    }

}

export default new UserService()