// src/validators/friend.validation.ts
import Joi from "joi";
import { objectIdSchema } from "./common";
import { validationMessages } from "./messages";

// sendFriendRequest
export const sendFriendRequestParamsSchema = Joi.object({
  id: objectIdSchema.label("Friend ID"),
});

// respondFriendRequest
export const respondFriendRequestParamsSchema = Joi.object({
  id: objectIdSchema.label("Request User ID"),
});

export const respondFriendRequestBodySchema = Joi.object({
  response: Joi.string()
    .valid("accept", "reject")
    .required()
    .messages({
      "any.required": validationMessages["any.required"],
      "any.only": "Response must be either 'accept' or 'reject'",
    })
    .label("Response"),
});

// deleteFriend
export const deleteFriendParamsSchema = Joi.object({
  id: objectIdSchema.label("Friend ID"),
});
