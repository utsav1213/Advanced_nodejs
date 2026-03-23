# Real-time Leaderboard System

A backend system for a real-time leaderboard service using Node.js, TypeScript, and Redis Sorted Sets.

## Features

- **User Authentication**: Register and Login securely (JWT).
- **Score Submission**: Submit scores for different games or activities.
- **Real-time Updates**: Leaderboard updates are emitted via Socket.io.
- **Leaderboard Storage**: Uses Redis Sorted Sets for efficient ranking.
- **Multi-period Leaderboards**: Tracks Daily, Monthly, and All-time scores.
- **Rank Queries**: Efficiently query user rank and score.

## Setup

1.  **Prerequisites**:
    - Node.js (v18+)
    - Redis Server running locally on default port (6379) or configured via `.env`.

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Run Development Server**:

    ```bash
    npm run dev
    ```

4.  **Build and Run**:
    ```bash
    npm run build
    npm start
    ```

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user.
  - Body: `{ "username": "user1", "email": "user1@example.com", "password": "password" }`
- **POST /auth/login**: Login to get a JWT token.
  - Body: `{ "email": "user1@example.com", "password": "password" }`
  - Response: `{ "token": "..." }`

### Leaderboard

Headers: `Authorization: Bearer <token>`

- **POST /leaderboard/submit**: Submit a score.
  - Body: `{ "gameId": "game1", "score": 100 }`
  - Note: Score is added to the user's total for that game/period (Cumulative).
- **GET /leaderboard/:gameId**: Get top 10 players.
  - Query Params:
    - `period`: `daily`, `monthly`, `global` (default).
    - `limit`: Number of results (default 10).
    - `date`: ISO Date string (e.g., `2026-03-23`) to view historical leaderboards.
- **GET /leaderboard/:gameId/rank**: Get current user's rank.
  - Query Params: `period` (optional).

### Real-time Events (Socket.io)

Connect to the server using a Socket.io client.

- Event: `scoreUpdate`
  - Payload: `{ gameId, username, score, timestamp }`

## Project Structure

- `src/controllers`: Request handlers.
- `src/db`: Database connection and user model (Redis).
- `src/middleware`: Auth middleware.
- `src/routes`: API routes.
- `src/index.ts`: Entry point.
