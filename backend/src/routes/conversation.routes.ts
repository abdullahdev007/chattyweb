import express, { RequestHandler, Router } from "express";

import { protectRoute, validate } from "@/middleware";
import {
  getConversation,
  getConversations,
  markMessagesAsReaded,
} from "@/controllers";
import {
  getConversationParamsSchema,
  markMessagesAsReadedParamsSchema,
} from "../validators/conversation.validation.js";

const router: Router = express.Router();

router.get("/", protectRoute, getConversations);
router.get(
  "/:id",
  protectRoute,
  validate({ params: getConversationParamsSchema }),
  getConversation as unknown as RequestHandler,
);
router.put(
  "/read/:id",
  protectRoute,
  validate({ params: markMessagesAsReadedParamsSchema }),
  markMessagesAsReaded as unknown as RequestHandler,
);

export default router;
