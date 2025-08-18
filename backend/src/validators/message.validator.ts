import Joi from "joi";
import { validationMessages } from "./messages";
import { objectIdSchema } from "./common";

// POST /:id

export const sendMessageParamsSchema = Joi.object({
  id: objectIdSchema.label("User ID"),
}).messages(validationMessages);


// GET /:id
export const getMessagesParamsSchema = Joi.object({
  id: objectIdSchema.label("Conversation ID"),
});

// GET /unreadCount/:id
export const getUnReadedMessageCountParamsSchema = Joi.object({
  id: objectIdSchema.label("Conversation ID"),
});

// PUT /increaseUnreadCount/:id
export const increaseUnReadedMessageParamsSchema = Joi.object({
  id: objectIdSchema.label("Conversation ID"),
});

// Schema for body (message)
export const sendMessageBodySchema = Joi.object({
  message: Joi.string().required().min(1).max(500).label("Message"),
}).messages(validationMessages); 