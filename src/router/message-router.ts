import messageController from "@/controllers/message-controller";
import { Router } from "express";
// import userController from "@/controllers/user-controller";
import authMiddleware from "@/middleware/auth-middleware";
// import { body } from "express-validator";
// import contractController from "@/controllers/contract-controller";

const router = Router();

router.post(
	"/getMessagesForConferenceFromId",
	authMiddleware,
	messageController.getMessagesForConferenceFromId,
);

router.post("/createMessage", authMiddleware, messageController.createMessage);
router.post("/editMessage", authMiddleware, messageController.editMessage);
router.post("/readMessage", authMiddleware, messageController.readMessage);

export default router;
