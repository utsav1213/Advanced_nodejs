const express = require("express");
const {
  getReservationStats,
  getRevenue,
  listAllReservations,
} = require("../controllers/adminController");
const { authMiddleware, requireRole } = require("../middleware/auth");
const router = express.Router();

router.get("/stats", authMiddleware, requireRole("admin"), getReservationStats);
router.get("/revenue", authMiddleware, requireRole("admin"), getRevenue);
router.get(
  "/reservations",
  authMiddleware,
  requireRole("admin"),
  listAllReservations,
);

module.exports = router;
