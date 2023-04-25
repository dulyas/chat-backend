import userService from "@/service/user-service"
import { Result, ValidationError, validationResult } from "express-validator"
import ApiError from "@/exceptions/api-error"
import { NextFunction, Request, Response } from 'express';
import config from "@/config";

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {

        try {
            const errors: Result<ValidationError> = validationResult(req)

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }

            const {email, password} = req.body

            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (e){
            next(e)
        }
    }

    
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e){
            next(e)
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(config.CLIENT_URL)
        } catch (e){
            next(e)
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies
            // console.log('refreshtoken',refreshToken)
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (e){
            next(e)
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e){
            next(e)
        }
    }

    async findByEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body
            const users = await userService.findUsers(email)

            return res.json(users)
        } catch (e) {
            next(e)
        }
    }   

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body
            
            const user = await userService.findOneById(id)

            return res.json(user)
        } catch (e) {
            next(e)
        }
    }   



}


export default new UserController()