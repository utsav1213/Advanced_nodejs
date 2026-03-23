import express from "express";
import {
  submitScore,
  getLeaderboard,
  getUserRank,
} from "../controllers/leaderboardController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/submit", authenticateToken, submitScore);
// user rank
router.get("/:gameId/rank", authenticateToken, getUserRank);
// global or game leaderboard
router.get("/:gameId", getLeaderboard);

export default router;
