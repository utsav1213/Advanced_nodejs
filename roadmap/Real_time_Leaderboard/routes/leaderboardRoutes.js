const express = require("express");
const {
  submitScore,
  getGlobalLeaderboard,
  getGameLeaderboard,
  getUserRank,
} = require("../controllers/leaderboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/submit", authMiddleware, submitScore);
router.get("/global", getGlobalLeaderboard);
router.get("/rank", authMiddleware, getUserRank); // Add query param `gameId` optionally
router.get("/:gameId", getGameLeaderboard);

module.exports = router;
