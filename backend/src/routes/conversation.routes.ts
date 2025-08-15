import express, { RequestHandler, Router } from "express";

import protectRoute from "../middleware/protectRoute.js";
import {
  getConversation,
  getConversations,
  markMessagesAsReaded,
} from "../controllers/conversation.controller.js";

const router: Router = express.Router();

router.get("/", protectRoute, getConversations);
router.get("/:id", protectRoute, getConversation as unknown as RequestHandler);
router.put(
  "/read/:id",
  protectRoute,
  markMessagesAsReaded as unknown as RequestHandler,
);

export default router;
