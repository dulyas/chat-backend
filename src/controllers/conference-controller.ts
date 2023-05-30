import contractService from "@/service/contract-service";
import ApiError from "@/exceptions/api-error";
import { NextFunction, Request, Response } from 'express';
import config from "@/config";
import userService from "@/service/user-service";
import ConferenceService from "@/service/conference-service";

class ConferenceController {
    async delete(req: Request, res: Response, next: NextFunction) {

        try {
            const {id} = req.body

            const deleteResult = await ConferenceService.delete(id)

            return res.json({
                deleteResult
            })
        } catch (e) {
            next(e)
        }
    }

   async getConferenceById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body 

            const conference = ConferenceService.getConferenceById(id)

            return res.json({
                conference
            })

        } catch (error) {
            next(error)
        }
   } 

   async getRoomDataById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.body 

            const roomData = await ConferenceService.getRoomDataById(id)


            

            return res.json({
                ...roomData
            })

        } catch (error) {
            next(error)
        }
    } 

}

export default new ConferenceController()