/**
 * Global validation messages for Joi validation
 */
export const validationMessages = {
  // String validations
  "string.empty": "{#label} is required",
  "string.min": "{#label} must be at least {#limit} characters long",
  "string.max": "{#label} must be at most {#limit} characters long",
  "string.alphanum": "{#label} must only contain alphanumeric characters",

  // Any validations
  "any.required": "{#label} is required",
  "any.only": "{#label} does not match the required value",

  // Custom messages for specific fields
  "password.mismatch": "Passwords do not match",
  "gender.invalid": "Gender must be either male or female",
};
