import contractService from "@/service/contract-service";
import ApiError from "@/exceptions/api-error";
import { NextFunction, Request, Response } from 'express';
import config from "@/config";
import userService from "@/service/user-service";
import messageService from "@/service/message-service";

class MessageController {
    async getMessagesForConferenceFromId(req: Request, res: Response, next: NextFunction) {

        try {
            const {roomId} = req.body

            const messages =  await messageService.getMessagesForConferenceFromId(roomId)

            return res.json({
                messages
            })
        } catch (e) {
            next(e)
        }
    }

    async createMessage(req: Request, res: Response, next: NextFunction) {

        try {
            const {roomId, userId, textMessage} = req.body

            const message =  await messageService.createMessage(roomId, userId, textMessage)

            return res.json({
                message
            })
        } catch (e) {
            next(e)
        }
    }

    async editMessage(req: Request, res: Response, next: NextFunction) {

        try {
            const {messageId, textMessage} = req.body

            const message =  await messageService.editMessage(messageId, textMessage)

            return res.json({
                message
            })
        } catch (e) {
            next(e)
        }
    }

    async readMessage(req: Request, res: Response, next: NextFunction) {

        try {
            const {messageId, textMessage} = req.body

            const message =  await messageService.readMessage(messageId)

            return res.json({
                message
            })
        } catch (e) {
            next(e)
        }
    }





}

export default new MessageController()