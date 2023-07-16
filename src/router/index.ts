import { Router } from "express";
import usersRoute from "@/router/user-router";
import conferenceRoute from "@/router/conference-router";
import messageRoute from "@/router/message-router";

const router = Router();

router.use("/user", usersRoute);
router.use("/conference", conferenceRoute);
router.use("/message", messageRoute);

export default router;
