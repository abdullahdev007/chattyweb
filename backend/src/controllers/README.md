# Controllers Layer

This directory contains the HTTP request handlers (controllers) for the application.

## Structure

```
controllers/
├── auth.controller.ts         # Authentication request handlers
├── user.controller.ts         # User-related request handlers
├── conversation.controller.ts # Conversation request handlers
├── message.controller.ts      # Message request handlers
├── notification.controller.ts # Notification request handlers
├── friends.controller.ts      # Friends request handlers
├── index.ts                   # Export all controllers
└── README.md                  # This file
```

## Controllers Overview

### AuthController

Handles all authentication-related HTTP requests:

- **signup()** - Handle user registration
- **login()** - Handle user login
- **logout()** - Handle user logout
- **changePassword()** - Handle password change
- **updateProfile()** - Handle profile updates
- **deleteAccount()** - Handle account deletion

### UserController

Handles all user-related HTTP requests:

- **getAllUsers()** - Get all users except current user
- **getUserById()** - Get a specific user by ID
- **searchUsers()** - Search users by username or fullName

### ConversationController

Handles all conversation-related HTTP requests:

- **getConversations()** - Get all conversations for a user
- **getConversationById()** - Get a specific conversation
- **markConversationAsRead()** - Mark conversation messages as read
- **createConversation()** - Create a new conversation
- **addParticipant()** - Add user to conversation
- **removeParticipant()** - Remove user from conversation

### MessageController

Handles all message-related HTTP requests:

- **sendMessage()** - Send a new message
- **getMessages()** - Get messages for a conversation
- **getUnreadCount()** - Get unread message count
- **markAllAsRead()** - Mark all messages as read

### NotificationController

Handles all notification-related HTTP requests:

- **getNotifications()** - Get user notifications
- **markAllAsRead()** - Mark all notifications as read
- **getUnreadCount()** - Get unread notifications count
- **deleteAll()** - Delete all notifications

### FriendsController

Handles all friends-related HTTP requests:

- **sendFriendRequest()** - Send friend request to another user
- **respondFriendRequest()** - Accept or reject friend request
- **deleteFriend()** - Delete friend relationship
- **getFriends()** - Get all friends for a user
- **getFriendRequests()** - Get all pending friend requests

## Benefits of using controllers layer

1. **HTTP Handling** - Centralized HTTP request/response handling
2. **Input Validation** - Request validation and sanitization
3. **Error Handling** - Consistent error responses
4. **Service Integration** - Bridge between HTTP layer and business logic
5. **Middleware Integration** - Authentication, authorization, and validation
6. **Response Formatting** - Consistent API response structure

## Usage

Controllers are used in route definitions to handle specific HTTP endpoints. They receive requests, validate input, call appropriate services, and return formatted responses.

Example:

```typescript
import { signup, login } from "@/controllers";

router.post("/signup", signup);
router.post("/login", login);
```
