# Routes Layer

This directory contains the Express.js route definitions for the application's API endpoints.

## Structure

```
routes/
├── auth.routes.ts         # Authentication endpoints
├── user.routes.ts         # User management endpoints
├── conversation.routes.ts # Conversation management endpoints
├── message.routes.ts      # Message handling endpoints
├── notification.routes.ts # Notification management endpoints
├── friends.routes.ts      # Friends management endpoints
├── index.ts               # Export all routes
└── README.md              # This file
```

## Routes Overview

### Auth Routes (`/api/auth`)

Handles all authentication-related endpoints:

- **POST `/signup`** - Register a new user account
  - Validates signup data (fullName, username, password, gender)
  - Creates new user and returns user data with JWT token

- **POST `/login`** - Authenticate existing user
  - Validates login credentials (username, password)
  - Returns user data with JWT token

- **POST `/logout`** - Logout user
  - Clears JWT cookie and logs user out
  - Requires authentication

- **POST `/change-password`** - Change user password
  - Validates new password
  - Requires authentication

- **DELETE `/delete-account`** - Delete user account
  - Permanently deletes user and all related data
  - Requires authentication

- **PUT `/update-profile`** - Update user profile
  - Validates profile update data
  - Requires authentication

### User Routes (`/api/users`)

Handles user-related endpoints:

- **GET `/`** - Get all users except current user
  - Returns list of all users for friend requests/search
  - Requires authentication

- **GET `/:id`** - Get specific user by ID
  - Validates user ID parameter
  - Returns user profile data
  - Requires authentication

### Conversation Routes (`/api/conversations`)

Handles conversation management endpoints:

- **GET `/`** - Get all conversations for current user
  - Returns list of user's conversations
  - Requires authentication

- **GET `/:id`** - Get specific conversation by ID
  - Validates conversation ID parameter
  - Returns conversation with messages
  - Requires authentication

- **PUT `/read/:id`** - Mark conversation messages as read
  - Validates conversation ID parameter
  - Marks all messages in conversation as read
  - Requires authentication

### Message Routes (`/api/messages`)

Handles message-related endpoints:

- **POST `/send/:id`** - Send message to conversation
  - Validates conversation ID and message content
  - Sends message and notifies participants via socket
  - Requires authentication

- **GET `/:id`** - Get messages for conversation
  - Validates conversation ID parameter
  - Returns paginated messages for conversation
  - Requires authentication

- **GET `/unreadCount/:id`** - Get unread message count
  - Validates conversation ID parameter
  - Returns count of unread messages
  - Requires authentication

- **PUT `/increaseUnreadCount/:id`** - Increase unread message count
  - Validates conversation ID parameter
  - Increments unread message counter
  - Requires authentication

### Notification Routes (`/api/notifications`)

Handles notification management endpoints:

- **GET `/`** - Get user notifications
  - Returns all notifications for current user
  - Requires authentication

- **POST `/markAsReaded`** - Mark all notifications as read
  - Marks all user notifications as read
  - Requires authentication

- **POST `/clearAll`** - Delete all notifications
  - Permanently deletes all user notifications
  - Requires authentication

### Friends Routes (`/api/friends`)

Handles friends management endpoints:

- **GET `/`** - Get all friends for current user
  - Returns list of user's friends
  - Requires authentication

- **GET `/requests`** - Get pending friend requests
  - Returns list of pending friend requests
  - Requires authentication

- **POST `/send-request/:id`** - Send friend request
  - Validates target user ID parameter
  - Sends friend request to specified user
  - Requires authentication

- **POST `/respond-request/:id`** - Respond to friend request
  - Validates request user ID and response (accept/reject)
  - Accepts or rejects friend request
  - Requires authentication

- **DELETE `/delete-friend/:id`** - Delete friend relationship
  - Validates friend ID parameter
  - Removes friend relationship and related data
  - Requires authentication

## Middleware Integration

All routes use the following middleware:

1. **Authentication Middleware** (`protectRoute`) - Verifies JWT token and adds user to request
2. **Validation Middleware** (`validate`) - Validates request body, params, and query using Joi schemas
3. **Controller Functions** - Handle the actual business logic

## Route Protection

- **Public Routes**: `/signup`, `/login` (no authentication required)
- **Protected Routes**: All other routes require valid JWT authentication
- **Validation**: Most routes include input validation using Joi schemas

## API Response Format

All routes return consistent JSON responses:

```typescript
// Success Response
{
  success: true,
  message: "Operation completed successfully",
  ..... anthor data based on api
}

// Error Response
{
  success: false,
  message: "Error description"
}
```

## Usage

Routes are registered in the main server file:

```typescript
import {
  authRoutes,
  userRoutes,
  conversationRoutes,
  messageRoutes,
  notificationRoutes,
  friendsRoutes,
} from "@/routes";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendsRoutes);
```

## Benefits of using routes layer

1. **Modularity** - Each feature has its own route file
2. **Middleware Integration** - Centralized authentication and validation
3. **Clean URLs** - RESTful API design
4. **Separation of Concerns** - Routes only handle HTTP routing, not business logic
5. **Maintainability** - Easy to add, modify, or remove endpoints
6. **Security** - Consistent authentication and validation across all endpoints
