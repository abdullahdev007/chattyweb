import express, { Router } from "express";

import { protectRoute } from "@/middleware";
import { clearAll, getNotifications, markAsReaded } from "@/controllers";

const router: Router = express.Router();

router.get("/", protectRoute, getNotifications);
router.post("/markAsReaded", protectRoute, markAsReaded);
router.post("/clearAll", protectRoute, clearAll);

export default router;
