-- Movies table
CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  poster VARCHAR(255),
  genre VARCHAR(50) NOT NULL
);

-- Auditoriums table
CREATE TABLE IF NOT EXISTS auditoriums (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  seat_count INT NOT NULL
);

-- Seats table
CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  auditorium_id INT REFERENCES auditoriums(id),
  seat_number VARCHAR(10) NOT NULL
);

-- Showtimes table
CREATE TABLE IF NOT EXISTS showtimes (
  id SERIAL PRIMARY KEY,
  movie_id INT REFERENCES movies(id),
  auditorium_id INT REFERENCES auditoriums(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  showtime_id INT REFERENCES showtimes(id),
  seat_id INT REFERENCES seats(id),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
