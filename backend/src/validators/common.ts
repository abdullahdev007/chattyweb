// src/validators/common.ts
import Joi from "joi";
import { validationMessages } from "./messages";

export const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .label("ID")
  .messages({
    "string.empty": validationMessages["string.empty"],
    "any.required": validationMessages["any.required"],
    "string.pattern.base": "{#label} is invalid",
  });

export const objectIdSchemaOptional = Joi.string()
  .optional()
  .allow(null)
  .empty(true)
  .label("ID")
  .messages({
    "string.pattern.base": "{#label} is invalid",
  });
