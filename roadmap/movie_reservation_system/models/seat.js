// Seat model
const pool = require("../utils/db");

const createSeat = async ({ auditorium_id, seat_number }) => {
  const result = await pool.query(
    "INSERT INTO seats (auditorium_id, seat_number) VALUES ($1, $2) RETURNING *",
    [auditorium_id, seat_number],
  );
  return result.rows[0];
};

const getSeatsByAuditorium = async (auditorium_id) => {
  const result = await pool.query(
    "SELECT * FROM seats WHERE auditorium_id = $1",
    [auditorium_id],
  );
  return result.rows;
};

const getSeatById = async (id) => {
  const result = await pool.query("SELECT * FROM seats WHERE id = $1", [id]);
  return result.rows[0];
};

module.exports = {
  createSeat,
  getSeatsByAuditorium,
  getSeatById,
};
