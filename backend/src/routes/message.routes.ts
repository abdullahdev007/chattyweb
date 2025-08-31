import express, { RequestHandler, Router } from "express";

import {
  getMessages,
  getUnReadedMessageCount,
  increaseUnReadedMessage,
  sendMessage,
} from "@/controllers";
import { protectRoute, validate } from "@/middleware";
import {
  getMessagesParamsSchema,
  getUnReadedMessageCountParamsSchema,
  increaseUnReadedMessageParamsSchema,
  sendMessageBodySchema,
  sendMessageParamsSchema,
} from "../validators/message.validator.js";

const router: Router = express.Router();

router.post(
  "/send/:id",
  protectRoute,
  validate({ params: sendMessageParamsSchema, body: sendMessageBodySchema }),
  sendMessage as unknown as RequestHandler,
);
router.get(
  "/:id",
  protectRoute,
  validate({ params: getMessagesParamsSchema }),
  getMessages as unknown as RequestHandler,
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

export default router;
