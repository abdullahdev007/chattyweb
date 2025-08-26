import Joi from "joi";
import { objectIdSchema } from "./common.js";

// GET /conversations/:id
export const getConversationParamsSchema = Joi.object({
  id: objectIdSchema.label("Conversation ID"),
});

// PUT /conversations/markMessagesAsReaded/:id
export const markMessagesAsReadedParamsSchema = Joi.object({
  id: objectIdSchema.label("Conversation ID"),
});
