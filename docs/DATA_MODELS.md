# Data Models

This document describes the main data models for the Chat App MVP, including Users, Chats, and Messages, along with their relationships.

---

## 1. User

```json
{
  "id": "ObjectId",
  "username": "toni23",
  "email": "toni@example.com",
  "password": "$2b$12$hash",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjM2NTQ4MzZiYjFlNWRiYzg2YWMxMCIsImVtYWlsIjoidG9uaUB0ZXN0LmNvbSIsInVzZXJuYW1lIjoiVG9uaSIsImlhdCI6MTc2MTEzODM4OX0.Cfz4zrEWlt4A9W8lfIO8hMYxFrSLrbV1XOFuCi0OXZI",
  "avatarUrl": "https://example.com/avatar.png",
  "friends": ["user1"],
  "createdAt": "2025-09-29T12:00:00Z",
  "lastLogin": "2025-09-29T12:05:00Z"
}
```

## 2. Chat

```json
{
  "id": "ObjectId",
  "name": "My Group",
  "participants": ["userId1", "userId2"],
  "lastMessageId": "messageId",
  "createdAt": "2025-09-29T12:00:00Z",
  "updatedAt": "2025-09-29T12:01:00Z"
}
```

## 3. Message

```json
{
  "id": "ObjectId",
  "chatId": "chatId",
  "senderId": "userId1",
  "receiverId": "userId2",
  "content": "Hey, how’s it going?",
  "timestamp": "2025-09-29T12:02:00Z",
  "status": "sent"
}
```

flowchart TD
User -->|participates in| Chat
Chat -->|contains| Message
Message -->|sent by| User
