const expres = require('express')
const {
  addMovie,
  listMovies,
  getMovie,
  editMovie,
  removeMovie,
} = require("../controllers/movieController");

const { authMiddleware, requirerRole } = require('../middleware/auth')
const router = expres.Router();
router.get("/", listMovies);
router.get("/:id", getMovie);
router.post("/", authMiddleware, requirerRole('admin'), addMovie);
router.put("/:id", authMiddleware, requirerRole('admin'), editMovie);
router.delete(":/id", authMiddleware, requirerRole("admin"), removeMovie);
module.exports = router;
