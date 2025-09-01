# Services Layer

This directory contains the business logic services for the application.

## Structure

```
services/
├── auth.service.ts            # Authentication business logic
├── notification.service.ts    # Notification business logic
├── user.service.ts           # User business logic
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

- **createNotification()** - Create and send notifications
- **getNotifications()** - Get user notifications
- **markAllNotificationsAsRead()** - Mark all notifications as read
- **getUnreadNotificationsCount()** - Get unread notifications count
- **deleteAllNotifications()** - Delete all notifications for a user

### UserService

Handles all user-related business logic:

- **getAllUsersExceptCurrent()** - Get all users except current user
- **getUserById()** - Get a specific user by ID
- **searchUsers()** - Search users by username or fullName
- **getUsersWithPagination()** - Get users with pagination support

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

## Benefits of using services layer

1. **Separation of Concerns** - Business logic separated from HTTP handling
2. **Reusability** - Services can be used by multiple controllers
3. **Testability** - Easy to unit test business logic
4. **Maintainability** - Clean, organized code structure
5. **Scalability** - Easy to add new services and functionality
