# Middleware Layer

This directory contains Express.js middleware functions that handle cross-cutting concerns across the application.

## Structure

```
middleware/
├── protectRoute.ts    # Authentication middleware
├── validate.ts        # Request validation middleware
├── index.ts           # Export all middleware
└── README.md          # This file
```

## Middleware Overview

### ProtectRoute Middleware

**Purpose**: Authentication and authorization middleware that verifies JWT tokens and adds user information to the request object.

**Function**: `protectRoute(req: Request, res: Response, next: NextFunction)`

**How it works**:

1. **Token Extraction**: Extracts JWT token from `req.cookies.jwt`
2. **Token Validation**: Verifies the token using the JWT secret from environment variables
3. **User Lookup**: Fetches user data from database using the decoded user ID
4. **Request Enhancement**: Adds the user object to `req.user` (excluding password)
5. **Error Handling**: Returns appropriate error responses for various failure scenarios

**Error Responses**:

- `401 Unauthorized` - No token provided or invalid token
- `404 Not Found` - User not found in database
- `500 Internal Server Error` - JWT verification or database errors

**Usage**:

```typescript
import { protectRoute } from "@/middleware";

// Protect a single route
router.get("/profile", protectRoute, getUserProfile);

// Protect multiple routes
router.use(protectRoute);
router.get("/conversations", getConversations);
router.post("/messages", sendMessage);
```

**Security Features**:

- JWT token verification using environment secret
- User existence validation
- Password exclusion from user object
- Comprehensive error handling

### Validate Middleware

**Purpose**: Request validation middleware that validates request body, parameters, and query strings using Joi schemas.

**Function**: `validate(schemas: SchemaMap)(req: Request, res: Response, next: NextFunction)`

**SchemaMap Interface**:

```typescript
type SchemaMap = {
  body?: Joi.ObjectSchema; // Request body validation
  params?: Joi.ObjectSchema; // URL parameters validation
  query?: Joi.ObjectSchema; // Query string validation
};
```

**How it works**:

1. **Schema Application**: Applies Joi schemas to request body, params, and query
2. **Data Sanitization**: Strips unknown properties from validated data
3. **Error Collection**: Collects all validation errors into a single message
4. **Request Modification**: Replaces original request data with validated/sanitized data
5. **Error Response**: Returns 400 Bad Request with detailed error messages

**Validation Features**:

- **Strip Unknown**: Removes properties not defined in schema
- **Error Formatting**: Combines multiple errors into readable format
- **Data Sanitization**: Ensures only valid data passes through
- **Flexible Schema**: Can validate any combination of body, params, and query

**Usage Examples**:

```typescript
import { validate } from "@/middleware";
import { signupSchema, loginSchema } from "@/validators";

// Validate request body only
router.post("/signup", validate({ body: signupSchema }), signup);

// Validate parameters only
router.get("/user/:id", validate({ params: userParamsSchema }), getUser);

// Validate multiple parts
router.post(
  "/message/:conversationId",
  validate({
    body: messageSchema,
    params: conversationParamsSchema,
  }),
  sendMessage,
);
```

**Error Response Format**:

```json
{
  "success": false,
  "message": "Validation error details..."
}
```

## Benefits of using middleware layer

1. **Security** - Centralized authentication and authorization
2. **Data Integrity** - Consistent input validation across all endpoints
3. **Code Reusability** - Middleware can be applied to multiple routes
4. **Error Handling** - Standardized error responses
5. **Maintainability** - Single place to modify authentication or validation logic
6. **Performance** - Early validation prevents unnecessary processing
7. **Consistency** - Uniform behavior across all protected routes
