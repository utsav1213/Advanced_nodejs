const pool = require("../utils/db");

// Admin: Get reservation stats (capacity, revenue)
const getReservationStats = async (req, res) => {
  // Total reservations, total seats, capacity per showtime
  const stats = await pool.query(`
    SELECT s.id as showtime_id, m.title, a.name as auditorium, COUNT(r.id) as reserved_seats, COUNT(se.id) as total_seats
    FROM showtimes s
    JOIN movies m ON s.movie_id = m.id
    JOIN auditoriums a ON s.auditorium_id = a.id
    LEFT JOIN reservations r ON r.showtime_id = s.id AND r.status = 'active'
    LEFT JOIN seats se ON se.auditorium_id = a.id
    GROUP BY s.id, m.title, a.name
    ORDER BY s.start_time DESC
  `);
  res.json(stats.rows);
};

// Admin: Get revenue (assuming 1 ticket = $10, can be extended)
const getRevenue = async (req, res) => {
  const revenue = await pool.query(`
    SELECT s.id as showtime_id, m.title, COUNT(r.id) as tickets_sold, COUNT(r.id)*10 as revenue
    FROM showtimes s
    JOIN movies m ON s.movie_id = m.id
    LEFT JOIN reservations r ON r.showtime_id = s.id AND r.status = 'active'
    GROUP BY s.id, m.title
    ORDER BY s.start_time DESC
  `);
  res.json(revenue.rows);
};

// Admin: List all reservations
const listAllReservations = async (req, res) => {
  const reservations = await pool.query(`
    SELECT r.*, u.email, m.title, s.start_time
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    JOIN showtimes s ON r.showtime_id = s.id
    JOIN movies m ON s.movie_id = m.id
    ORDER BY r.reserved_at DESC
  `);
  res.json(reservations.rows);
};

module.exports = {
  getReservationStats,
  getRevenue,
  listAllReservations,
};
