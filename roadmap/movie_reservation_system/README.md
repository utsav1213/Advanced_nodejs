# Movie Reservation System Backend

This project implements a backend service for reserving movie tickets. It features user authentication, movie and showtime management, seat reservation, and admin reporting.

## Features

- User signup, login, and role management (admin/user)
- Admins can manage movies, showtimes, and reporting
- Users can browse movies, reserve seats, view/cancel reservations
- Seat selection and overbooking prevention
- Reservation and revenue reporting for admins

## Tech Stack

- Node.js (Express)
- PostgreSQL
- JWT for authentication

## Project Structure

- `controllers/` — Route handlers
- `models/` — Database models
- `routes/` — API endpoints
- `middleware/` — Auth and role checks
- `utils/` — Helper functions

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Configure PostgreSQL connection in `.env`
4. Run migrations/seed admin user
5. Start server: `npm start`

## Extend

- Add payment processing, notifications, etc.

---

This README will be updated as development progresses.
