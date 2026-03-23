const {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../models/movie");

const addMovie =async  (req,res) => {
  const { title, description, poster, genre } = req.body;
  const movie=await createMovie( { title, description, poster, genre } )
return res.status(201).json(movie)
}
const listMovies = async (req, res) => {
  const movies = await getMovies();
  res.json(movies);
}
const getMovie = async (req, res) => {
  const { id } = req.params;
  const movie = await getMovieById(id);
 if (!movie) return res.status(404).json({ message: "Movie not found" });
 res.json(movie);
}
const editMovie = async (req, res) => {
  const { id } = req.params;
  const movie = await updateMovie(id, req.params);;
  res.json(movie)
}
const removeMovie = async (req, res) => {
  const { id } = req.params;
  await deleteMovie(id);
  res.status(204).end();
};
module.exports = {
  addMovie,
  listMovies,
  getMovie,
  editMovie,
  removeMovie,
};  