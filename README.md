# 💬 ChattyWeb

A modern, real-time chat application built with React, Node.js, and Socket.io.

ChattyWeb provides a seamless messaging experience with friend management, notifications, and AI-powered conversation insights.

![ChattyWeb](https://img.shields.io/badge/ChattyWeb-v1.0.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18+-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-8.2+-green)

## ✨ Features

### 🔐 Authentication & User Management

- **Secure Registration & Login** - JWT-based authentication with bcrypt password hashing

- **Profile Management** - Update profile information and change passwords

- **Account Deletion** - Complete account removal with data cleanup

### 💬 Real-time Messaging

- **Instant Messaging** - Real-time chat using Socket.io

- **Message History** - Persistent message storage with pagination

- **Unread Message Tracking** - Visual indicators for unread messages

- **Message Status** - Read/unread status tracking

### 🤖 AI-Powered Insights

- **Conversation Analysis** - AI-generated conversation summaries

- **Sentiment Analysis** - Understand conversation mood and tone

- **Key Takeaways** - Extract important points from conversations

- **Google Gemini Integration** - Powered by Google's AI technology

### 👥 Friend System

- **Friend Requests** - Send and receive friend requests

- **Friend Management** - Accept, reject, or remove friends

- **Pending Requests** - Track pending friend requests

- **User Search** - Find users by username or full name

### 🔔 Smart Notifications

- **Real-time Notifications** - Instant notification delivery

- **Notification Types** - Friend requests, acceptances, rejections, and removals

- **Notification Management** - Mark as read, clear all notifications

- **Unread Count** - Track unread notification count

### 🎨 Modern UI/UX

- **Responsive Design** - Works seamlessly on desktop and mobile

- **Dark/Light Theme** - Beautiful UI with DaisyUI components

- **Toast Notifications** - User-friendly feedback system

## 🏗️ Architecture

### Project Structure

```

chattyweb/

├── 📁 backend/ # Node.js/Express API server

│ ├── 📁 src/

│ │ ├── 📁 controllers/ # HTTP request handlers

│ │ ├── 📁 services/ # Business logic layer

│ │ ├── 📁 routes/ # API route definitions

│ │ ├── 📁 models/ # MongoDB/Mongoose models

│ │ ├── 📁 middleware/ # Express middleware

│ │ ├── 📁 socket/ # Socket.io real-time communication

│ │ ├── 📁 validators/ # Input validation schemas

│ │ ├── 📁 utils/ # Utility functions

│ │ └── 📁 prompts/ # AI prompts

│ ├── 📁 scripts/ # Database seeding scripts

│ └── 📁 dist/ # Compiled TypeScript output

├── 📁 client/ # React frontend application

│ ├── 📁 src/

│ │ ├── 📁 components/ # Reusable UI components

│ │ ├── 📁 pages/ # Application pages

│ │ ├── 📁 hooks/ # Custom React hooks

│ │ ├── 📁 stores/ # Zustand state management

│ │ ├── 📁 context/ # React context providers

│ │ ├── 📁 layout/ # Layout components

│ │ └── 📁 utils/ # Frontend utility functions

│ └── 📁 dist/ # Built frontend assets

├── 📁 shared/ # Shared TypeScript types

│ └── 📁 types/ # Shared types between backend and frontend

└── 📄 package.json # Root package configuration

```

### Technology Stack

#### Backend

- **Node.js** - JavaScript runtime environment

- **Express.js** - Web application framework

- **TypeScript** - Type-safe JavaScript

- **MongoDB** - NoSQL database

- **Mongoose** - MongoDB object modeling

- **Socket.io** - Real-time bidirectional communication

- **JWT** - JSON Web Token authentication

- **bcryptjs** - Password hashing

- **Joi** - Input validation

- **Google Gemini AI** - AI conversation analysis

#### Frontend

- **React 18** - UI library with hooks

- **TypeScript** - Type-safe JavaScript

- **Vite** - Fast build tool and dev server

- **Tailwind CSS** - Utility-first CSS framework

- **DaisyUI** - Tailwind CSS component library

- **Zustand** - State management

- **React Router** - Client-side routing

- **Socket.io Client** - Real-time communication

- **React Hot Toast** - Toast notifications

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)

- **MongoDB** (v4.4 or higher)

- **npm** or **yarn** package manager

### Installation

1.  **Clone the repository**

```bash

git clone https://github.com/abdullahdev007/chattyweb.git

cd chattyweb

```

2.  **Install dependencies**

```bash

npm install

```

3.  **Environment Setup**

The project uses `dotenv-flow` in `backend` for managing environment variables across different environments. This allows for flexible configuration between development and production.

#### Backend Environment Files

Create the following files in the `backend` directory:

`.env` (default environment variables):

```env
# Database
MONGODB_URI=mongodb://localhost:27017/chattyweb

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Application
PORT=5000
APP_URL=http://localhost:5173

# Google Gemini AI
GOOGLE_API_KEY=your-google-gemini-api-key-here
```

`.env.development` (development-specific overrides):

```env
# Development Database
MONGODB_URI=mongodb://localhost:27017/chattyweb_dev

# Development App URL (Vite dev server)
APP_URL=http://localhost:5173
```

`.env.production` (production-specific overrides):

```env
# Production Database
MONGODB_URI=your-production-mongodb-uri

# Production App URL
APP_URL=https://your-production-domain.com
```

#### Client Environment Files

Create the following files in the `client` directory:

`.env` (default environment variables):

```env
# Server URL
VITE_SERVER_URL=http://localhost:5000

# Developer Portfolio (Optional)
VITE_DEVELOPER_PORTFOLIO=https://your-portfolio.com
```

4.  **Start MongoDB**

```bash

# Make sure MongoDB is running on your system

mongod

```

5.  **Seed the database (Optional)**

```bash

cd backend

npm run seed

```

6.  **Start the development servers**

- Terminal 1 - Backend

```bash
cd backend

npm run dev
```

- Terminal 2 - Frontend

```bash
cd client

npm run dev
```

This will start:

- Backend server on `http://localhost:5000`

- Frontend development server on `http://localhost:5173`

### Production Build

1.  **Build the application**

```bash

npm run build

```

2.  **Start the production server**

```bash

npm start

```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration

- `POST /api/auth/login` - User login

- `POST /api/auth/logout` - User logout

- `PUT /api/auth/change-password` - Change password

- `PUT /api/auth/update-profile` - Update profile

- `DELETE /api/auth/delete-account` - Delete account

### User Endpoints

- `GET /api/users` - Get all users (except current user)

- `GET /api/users/search` - Search users by username/name

- `GET /api/users/:id` - Get user by ID

### Conversation Endpoints

- `GET /api/conversations` - Get user conversations

- `GET /api/conversations/:id` - Get specific conversation

- `PUT /api/conversations/read/:id` - Mark conversation as read

- `GET /api/conversations/unreadCount/:id` - Get unread message count

- `POST /api/conversations/insights/:id` - Get AI conversation insights

### Message Endpoints

- `POST /api/messages/send/:id` - Send message to conversation

- `GET /api/messages/:id` - Get conversation messages

- `GET /api/messages/unreadCount/:id` - Get unread message count

- `PUT /api/messages/markAsRead/:id` - Mark messages as read

### Friend Endpoints

- `POST /api/friends/send-request` - Send friend request

- `POST /api/friends/respond-request` - Accept/reject friend request

- `DELETE /api/friends/delete/:id` - Remove friend

- `GET /api/friends` - Get user's friends

- `GET /api/friends/requests` - Get pending friend requests

### Notification Endpoints

- `GET /api/notifications` - Get user notifications (paginated)

- `POST /api/notifications/markAsReaded` - Mark all notifications as read

- `POST /api/notifications/clearAll` - Delete all notifications

- `GET /api/notifications/unreadCount` - Get unread notification count

## 🔧 Development

### Available Scripts

#### Root Level

- `npm run build` - Build both client and backend

- `npm run format` - Format code with Prettier

- `npm start` - Start production server

#### Backend

- `npm run dev` - Start development server with hot reload

- `npm run build` - Build TypeScript to JavaScript

- `npm run seed` - Seed database with sample data

- `npm run seed:notifications` - Seed notifications

- `npm run clean` - Kill process on port 5000

#### Client

- `npm run dev` - Start Vite development server

- `npm run build` - Build for production

- `npm run preview` - Preview production build

- `npm run format` - Format code with Prettier

## 🎯 Key Features Deep Dive

###🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication

- **Password Hashing** - bcryptjs for secure password storage

- **Input Validation** - Joi schemas for request validation

- **CORS Protection** - Configured CORS for secure cross-origin requests

- **Helmet.js** - Security headers protection

- **Route Protection** - Middleware for protected routes

- **Data Sanitization** - Safe user data handling

### Real-time Communication

- **Socket.io Integration** - Bidirectional real-time communication

- **Event-driven Architecture** - Efficient message broadcasting

- **Connection Management** - Automatic reconnection handling

- **Room-based Messaging** - Conversation-specific message delivery

### State Management

- **Zustand Stores** - Lightweight state management

- **Optimistic Updates** - Immediate UI feedback

- **Persistent State** - Maintains state across sessions

- **Type-safe Stores** - Full TypeScript support

### AI Integration

- **Google Gemini AI** - Advanced conversation analysis

- **Conversation Insights** - AI-generated summaries and sentiment

- **Key Takeaways** - Important conversation points extraction

- **Configurable Prompts** - Customizable AI behavior

## 🤝 Contributing

This is a proprietary project created for portfolio demonstration purposes.

Contributions are not currently accepted as this is a personal project.

## 📝 License

This project is proprietary software. All rights reserved.

**Copyright (c) 2024 Abdullah Shaaban**

This software is provided for portfolio and demonstration purposes only.

Unauthorized copying, distribution, or use is strictly prohibited.

For licensing inquiries, contact: abdullahdev007@example.com

See the [LICENSE](LICENSE) file for complete terms and conditions.

## 👨‍💻 Author

**Abdullah Shaaban**

- GitHub: [@abdullahdev007](https://github.com/abdullahdev007)

- Project: [ChattyWeb](https://github.com/abdullahdev007/chattyweb)

<div  align="center">

<p>Made with ❤️ by Abdullah Shaaban</p>

<p>

<strong>Portfolio Project</strong>

<strong>Proprietary Software</strong>

</p>

</div>
