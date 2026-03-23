// Movie model
const pool = require("../utils/db");

const createMovie = async ({ title, description, poster, genre }) => {
  const result = await pool.query(
    "INSERT INTO movies (title, description, poster, genre) VALUES ($1, $2, $3, $4) RETURNING *",
  [title, description, poster, genre],
  );
  return result.rows[0];
};

const getMovies = async () => {
  const result = await pool.query("SELECT * FROM movies");
  return result.rows;
};

const getMovieById = async (id) => {
  const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
  return result.rows[0];
};

const updateMovie = async (id, data) => {
  const { title, description, poster, genre } = data;
  const result = await pool.query(
    "UPDATE movies SET title = $1, description = $2, poster = $3, genre = $4 WHERE id = $5 RETURNING *",
    [title, description, poster, genre, id],
  );
  return result.rows[0];
};

const deleteMovie = async (id) => { 
  await pool.query("DELETE FROM movies WHERE id = $1", [id]);
};

module.exports = {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
