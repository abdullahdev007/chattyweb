import express, { Router } from "express";

import protectRoute from "../middleware/protectRoute.js";
import {
  clearAll,
  getNotifications,
  markAsReaded,
} from "../controllers/notification.controller.js";

const router: Router = express.Router();

router.get("/", protectRoute, getNotifications);
router.post("/markAsReaded", protectRoute, markAsReaded);
router.post("/clearAll", protectRoute, clearAll);

export default router;
