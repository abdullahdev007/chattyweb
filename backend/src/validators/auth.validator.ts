import Joi from "joi";
import { validationMessages } from "./messages.js";

// Validation schema for signup request
export const signupSchema = Joi.object({
  fullName: Joi.string().required().min(3).max(15).label("Full name"),
  username: Joi.string().required().min(3).max(15).alphanum().label("Username"),
  password: Joi.string().required().min(6),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({ "any.only": validationMessages["password.mismatch"] }),
  gender: Joi.string()
    .required()
    .valid("male", "female")
    .messages({ "any.only": validationMessages["gender.invalid"] }),
}).messages(validationMessages);

// Validation schema for login request
export const loginSchema = Joi.object({
  username: Joi.string().required().label("Username"),
  password: Joi.string().required(),
}).messages(validationMessages);

// Validation schema for change password request
export const changePasswordSchema = Joi.object({
  password: Joi.string().required().min(6),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({ "any.only": validationMessages["password.mismatch"] }),
}).messages(validationMessages);

// Validation schema for update profile request
export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(30),
  username: Joi.string().required().min(3).max(20).alphanum(),
  gender: Joi.string()
    .valid("male", "female")
    .messages({ "any.only": validationMessages["gender.invalid"] }),
}).messages(validationMessages);
