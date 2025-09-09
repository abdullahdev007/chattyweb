import express, { Router } from "express";

import { protectRoute, validate } from "@/middleware";
import { clearAll, getNotifications, markAsReaded } from "@/controllers";
import { getNotificationsQuerySchema } from "../validators/notification.validator.js";

const router: Router = express.Router();

router.get(
  "/",
  protectRoute,
  validate({ query: getNotificationsQuerySchema }),
  getNotifications
);
router.post("/markAsReaded", protectRoute, markAsReaded);
router.post("/clearAll", protectRoute, clearAll);

export default router;
