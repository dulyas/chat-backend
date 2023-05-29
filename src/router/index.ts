import { Router } from "express";
import usersRoute from '@/router/user-route'
import conferenceRoute from '@/router/conference'

const router = Router()



router.use('/user', usersRoute)
router.use('/conference', conferenceRoute)



export default router