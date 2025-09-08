# Services Layer

This directory contains the business logic services for the application.

## Structure

```
services/
├── auth.service.ts            # Authentication business logic
├── notification.service.ts    # Notification business logic with pagination
├── user.service.ts           # User business logic with pagination
├── conversation.service.ts    # Conversation business logic
├── message.service.ts        # Message business logic
├── friends.service.ts        # Friends business logic
├── index.ts                   # Export all services
└── README.md                  # This file
```

## Services Overview

### AuthService

Handles all authentication-related business logic:

- **createUser()** - Create new user account with validation
- **authenticateUser()** - Authenticate user login
- **updateUserPassword()** - Update user password
- **updateUserProfile()** - Update user profile information
- **deleteUserAccount()** - Delete user account and all related data

### NotificationService

Handles all notification-related business logic:

- **createNotification()** - Create and send notifications with real-time socket updates
- **getNotifications()** - Get user notifications with pagination support (12 per page)
- **markAllNotificationsAsRead()** - Mark all notifications as read for a user
- **getUnreadNotificationsCount()** - Get unread notifications count for a user
- **deleteAllNotifications()** - Delete all notifications for a user

#### Notification Types

The service supports the following notification types:

- **NewFriendRequest** - When someone sends a friend request
- **FriendRequestAccepted** - When a friend request is accepted
- **FriendRequestRejected** - When a friend request is rejected
- **RemoveFriendShip** - When someone removes you from their friends list

### UserService

Handles all user-related business logic:

- **getAllUsersExceptCurrent()** - Get all users except current user (with optional limit/skip)
- **getUserById()** - Get a specific user by ID
- **searchUsers()** - Search users by username or fullName with regex matching
- **getUsers()** - Get users with pagination support (8 per page by default)

### ConversationService

Handles all conversation-related business logic:

- **getUserConversations()** - Get all conversations for a user
- **getConversationById()** - Get a specific conversation with access control
- **markConversationMessagesAsRead()** - Mark messages as read in conversation
- **createConversation()** - Create a new conversation between users
- **addParticipantToConversation()** - Add user to existing conversation
- **removeParticipantFromConversation()** - Remove user from conversation
- **getUnreadMessageCount()** - Get unread message count for a conversation
- **deleteConversation()** - Delete a conversation and all related messages

### MessageService

Handles all message-related business logic:

- **sendMessage()** - Send a new message with socket notification
- **getMessages()** - Get messages for a conversation
- **getUnreadMessageCount()** - Get unread message count
- **increaseUnreadMessageCount()** - Increase unread message count
- **markAllMessagesAsRead()** - Mark all messages as read

### FriendsService

Handles all friends-related business logic:

- **sendFriendRequest()** - Send friend request to another user
- **respondToFriendRequest()** - Accept or reject friend request
- **deleteFriend()** - Delete friend and remove all related data
- **getFriends()** - Get all friends for a user
- **getFriendRequests()** - Get all pending friend requests

## Pagination System

The services layer includes a comprehensive pagination system for handling large datasets:

### Notification Pagination

- **Page Size**: 12 notifications per page
- **Features**: Total count, current page, total pages
- **Sorting**: Newest notifications first (createdAt: -1)
- **Usage**: `getNotifications(userId, page, limit)`

### User Pagination

- **Page Size**: 8 users per page (default)
- **Features**: Total count, current page, total pages
- **Filtering**: Excludes current user from results
- **Usage**: `getUsers(currentUserId, page, limit)`

### Pagination Response Format

```typescript
{
  data: T[],           // Array of items (notifications/users)
  total: number,       // Total number of items
  page: number,        // Current page number
  totalPages: number   // Total number of pages
}
```

## Benefits of using services layer

1. **Separation of Concerns** - Business logic separated from HTTP handling
2. **Reusability** - Services can be used by multiple controllers
3. **Testability** - Easy to unit test business logic
4. **Maintainability** - Clean, organized code structure
5. **Scalability** - Easy to add new services and functionality
6. **Performance** - Built-in pagination for efficient data loading
7. **Consistency** - Standardized response formats across all services
