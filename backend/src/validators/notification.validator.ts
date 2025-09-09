import Joi from "joi";
import { validationMessages } from "./messages.js";

export const getNotificationsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().label("Page number"),
}).messages(validationMessages);
