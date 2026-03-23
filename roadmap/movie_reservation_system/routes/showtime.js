const express = require("express");
const {
  listShowtimesByMovie,
  listShowtimesByDate,
  addShowtime,
  getShowtimeSeats,
} = require("../controllers/showtimeController");
const { authMiddleware, requireRole } = require("../middleware/auth");
const router = express.Router();

router.get("/by-movie/:movie_id", listShowtimesByMovie);
router.get("/by-date", listShowtimesByDate);
router.post("/", authMiddleware, requireRole("admin"), addShowtime);
router.get("/:id/seats", getShowtimeSeats);

module.exports = router;
