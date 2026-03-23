const express = require("express");
const {
  addMovie,
  listMovies,
  getMovie,
  editMovie,
  removeMovie,
} = require("../controllers/movieController");
const { authMiddleware, requireRole } = require("../middleware/auth");
const router = express.Router();

router.get("/", listMovies);
router.get("/:id", getMovie);
router.post("/", authMiddleware, requireRole("admin"), addMovie);
router.put("/:id", authMiddleware, requireRole("admin"), editMovie);
router.delete("/:id", authMiddleware, requireRole("admin"), removeMovie);

module.exports = router;
