import conferenceController from "@/controllers/conference-controller";
import { Router } from "express";
// import userController from "@/controllers/user-controller";
import authMiddleware from "@/middleware/auth-middleware";
// import { body } from "express-validator";
// import contractController from "@/controllers/contract-controller";

const router = Router()

router.post('/delete',  authMiddleware, conferenceController.delete)
router.post('/getRoomDataById', authMiddleware, conferenceController.getRoomDataById)

export default router;