import Joi from "joi";
import { validationMessages } from "./messages.js";
  
export const getUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required().label("User ID"),
}).messages(validationMessages);
