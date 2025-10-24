Looma – Real-Time Chat Application

Looma is a full-stack, real-time chat application that allows users to communicate securely with friends and groups. Built with React, Node.js, and MongoDB, Looma supports authentication, friend management, group chats, and live messaging.

🚀 Features

User Authentication: JWT-based authentication for secure login and session management.

Real-Time Messaging: Socket.io powers instant message delivery between users.

Friend Management: Add or remove friends easily.

Group Chats: Create groups from your friends list and chat with multiple participants.

Chat Management: Start 1-on-1 chats, delete chats, and send messages.

Responsive Design: Works seamlessly across desktop, tablet, and mobile devices.

Secure Passwords: User passwords are hashed with bcrypt for security.

🛠️ Tech Stack
Layer Technology
Frontend React, Axios, Tailwind CSS
Backend Node.js, Express, Socket.io
Database MongoDB, Mongoose
Authentication JWT, bcrypt
Real-Time Comm. Socket.io
API Requests Axios

📁 Project Structure

Frontend (React)

/frontend
├─ /src
│ ├─ /components # Reusable UI components
│ ├─ /context # Authentication, User and Chat contexts
│ ├─ /hooks # Custom hooks
│ ├─ /pages # Login, Sign up and Landing page
│ ├─ /services # Axios calls
│ ├─ /utils # Helper functions, socket initialization central API Error handler
│ └─ App.jsx

/backend
├─ /config # Database setup
├─ /controllers # Chat, User controllers
├─ /models # Mongoose schemas (User, Chat, Message)
├─ /routes # API routes
├─ /socket # Socket config
├─ /utils # JWT, logger, helpers
└─ server.js # Express app entry

⚙️ Environment Variables

Backend (server/.env)

# Secret used to sign JWT tokens

JWT_SECRET=your_jwt_secret_here

# Secret used for refresh tokens

REFRESH_TOKEN=your_refresh_token_here

# MongoDB connection string

MONGODB_URI=mongodb://localhost:27017/looma_db

# Frontend URL (for CORS and cookie settings)

FRONTEND_URL=http://localhost:5173

# Backend server port

PORT=3000

Frontend (client/.env)

# Backend API URL

VITE_API_URL=http://localhost:3000

💡 Installation

Backend

cd backend
npm install
npm run dev

Frontend

cd frontend
npm install
npm run dev

🔧 Usage

Register or login a user.

Add friends to your friend list.

Start a 1-on-1 chat or create a group chat with multiple friends.

Send and receive messages in real-time.

Delete chats if needed.

Logout User

🔒 Security

Passwords are hashed using bcrypt before storing in the database.

JWT tokens protect routes and manage sessions.

Cookies for JWT can be HTTP-only and secure for production environments.

📱 Responsive Design

Mobile, tablet, and desktop layouts supported.

React components are reusable and modular.

⚡ Future Improvements

Typing indicators for real-time feedback.

Push notifications for new messages.

Search friends and messages.

Message reactions or media attachments.
