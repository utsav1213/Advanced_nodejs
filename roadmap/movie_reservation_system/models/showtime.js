// Showtimes model
const pool = require("../utils/db");

const createShowtime = async ({
  movie_id,
  auditorium_id,
  start_time,
  end_time,
}) => {
  const result = await pool.query(
    "INSERT INTO showtimes (movie_id, auditorium_id, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *",
    [movie_id, auditorium_id, start_time, end_time],
  );
  return result.rows[0];
};

const getShowtimesByMovie = async (movie_id) => {
  const result = await pool.query(
    "SELECT * FROM showtimes WHERE movie_id = $1",
    [movie_id],
  );
  return result.rows;
};

const getShowtimesByDate = async (date) => {
  const result = await pool.query(
    "SELECT * FROM showtimes WHERE DATE(start_time) = $1",
    [date],
  );
  return result.rows;
};

const getShowtimeById = async (id) => {
  const result = await pool.query("SELECT * FROM showtimes WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

module.exports = {
  createShowtime,
  getShowtimesByMovie,
  getShowtimesByDate,
  getShowtimeById,
};
