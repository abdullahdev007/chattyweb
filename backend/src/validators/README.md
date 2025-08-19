# Validation Layer

This directory contains validation schemas for request validation using Joi.

## Structure

- `auth.validator.js` - Validation schemas for authentication-related endpoints
- Additional validator files will be added for other modules

## Usage

Validation schemas are used with the `validate` middleware to validate request data before it reaches the controller.

```typescript
import { validate } from "../middleware/validate.js";
import { signupSchema } from "../validators/auth.validator.js";

router.post("/signup", validate(signupSchema), signupController);
```

## Benefits

- Separation of concerns: Validation logic is separated from business logic
- Reusability: Validation schemas can be reused across different routes
- Consistency: Standardized validation approach across the application
- Better error handling: Detailed validation error messages
