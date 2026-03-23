-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user'
);

-- Seed initial admin user
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@example.com', '$2a$10$replace_with_hashed_password', 'admin')
ON CONFLICT (email) DO NOTHING;
