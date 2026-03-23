const express = require("express");
const {
  reserveSeats,
  getUserReservations,
  cancelUserReservation,
} = require("../controllers/reservationController");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

router.post("/", authMiddleware, reserveSeats);
router.get("/", authMiddleware, getUserReservations);
router.delete("/:id", authMiddleware, cancelUserReservation);

module.exports = router;
