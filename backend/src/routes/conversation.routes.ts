import express, { RequestHandler, Router } from "express";

import { protectRoute, validate } from "@/middleware";
import {
  getConversation,
  getConversations,
  markMessagesAsReaded,
  getUnReadedMessageCount,
  increaseUnReadedMessage,
  getConversationInsights,
} from "@/controllers";
import {
  getConversationParamsSchema,
  markMessagesAsReadedParamsSchema,
  getUnReadedMessageCountParamsSchema,
  increaseUnReadedMessageParamsSchema,
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
router.get(
  "/unreadCount/:id",
  protectRoute,
  validate({ params: getUnReadedMessageCountParamsSchema }),
  getUnReadedMessageCount as unknown as RequestHandler,
);
router.put(
  "/increaseUnreadCount/:id",
  protectRoute,
  validate({ params: increaseUnReadedMessageParamsSchema }),
  increaseUnReadedMessage as unknown as RequestHandler,
);

router.post(
  "/insights/:id",
  protectRoute,
  validate({ params: getConversationParamsSchema }),
  getConversationInsights as unknown as RequestHandler,
);

export default router;
