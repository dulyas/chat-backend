import { Router } from "express";
import userController from "@/controllers/user-controller";
import authMiddleware from "@/middleware/auth-middleware";
import { body } from "express-validator";
import contractController from "@/controllers/contract-controller";

const router = Router()


router.get('/', authMiddleware, userController.getUsers)
router.post('/findByEmail', authMiddleware, userController.findByEmail)
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration)

router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.post('/addFriend', authMiddleware, contractController.createContract)
router.post('/findOneById', authMiddleware, userController.findById)
router.post('/getFriendListFromId', authMiddleware, contractController.getFriendListFromId)
router.post('/deleteFriend', authMiddleware, contractController.deleteFriend)

export default router;