// Reservation model
const pool = require("../utils/db");

const createReservation = async ({ user_id, showtime_id, seat_id }) => {
  const result = await pool.query(
    "INSERT INTO reservations (user_id, showtime_id, seat_id) VALUES ($1, $2, $3) RETURNING *",
    [user_id, showtime_id, seat_id],
  );
  return result.rows[0];
};

const getReservationsByUser = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM reservations WHERE user_id = $1",
    [user_id],
  );
  return result.rows;
};

const getReservationsByShowtime = async (showtime_id) => {
  const result = await pool.query(
    "SELECT * FROM reservations WHERE showtime_id = $1",
    [showtime_id],
  );
  return result.rows;
};

const cancelReservation = async (id) => {
  await pool.query("UPDATE reservations SET status = $1 WHERE id = $2", [
    "cancelled",
    id,
  ]);
};

const getReservationById = async (id) => {
  const result = await pool.query("SELECT * FROM reservations WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

module.exports = {
  createReservation,
  getReservationsByUser,
  getReservationsByShowtime,
  cancelReservation,
  getReservationById,
};
