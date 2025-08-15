import express, { RequestHandler, Router } from "express";

import {
  getMessages,
  getUnReadedMessageCount,
  increaseUnReadedMessage,
  sendMessage,
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router: Router = express.Router();

router.get("/:id", protectRoute, getMessages as unknown as RequestHandler);
router.post(
  "/send/:id",
  protectRoute,
  sendMessage as unknown as RequestHandler,
);
router.get(
  "/unreadCount/:id",
  protectRoute,
  getUnReadedMessageCount as unknown as RequestHandler,
);
router.put(
  "/increaseUnreadCount/:id",
  protectRoute,
  increaseUnReadedMessage as unknown as RequestHandler,
);

export default router;
