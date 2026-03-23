// Auditorium model
const pool = require("../utils/db");

const createAuditorium = async ({ name, seat_count }) => {
  const result = await pool.query(
    "INSERT INTO auditoriums (name, seat_count) VALUES ($1, $2) RETURNING *",
    [name, seat_count],
  );
  return result.rows[0];
};

const getAuditoriums = async () => {
  const result = await pool.query("SELECT * FROM auditoriums");
  return result.rows;
};

const getAuditoriumById = async (id) => {
  const result = await pool.query("SELECT * FROM auditoriums WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

module.exports = {
  createAuditorium,
  getAuditoriums,
  getAuditoriumById,
};
