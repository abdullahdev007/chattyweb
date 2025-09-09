import Joi from "joi";
import { validationMessages } from "./messages.js";

export const getUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required().label("User ID"),
}).messages(validationMessages);

export const getUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().label("Page number"),
}).messages(validationMessages);
