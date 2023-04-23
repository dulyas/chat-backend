import { Router } from "express";
import usersRoute from '@/router/user-route'


const router = Router()



router.use('/user', usersRoute)




export default router