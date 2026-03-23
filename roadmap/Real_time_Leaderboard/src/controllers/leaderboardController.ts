import { Response } from "express";
import client from "../db/redis";
import { AuthRequest } from "../middleware/auth";
import { Server } from "socket.io"; // Import type

export const getPeriodKeys = (
  gameId: string,
  timestamp: number = Date.now(),
) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  // Simple daily key
  const day = String(date.getDate()).padStart(2, "0");

  return {
    daily: `leaderboard:${gameId}:daily:${year}-${month}-${day}`,
    monthly: `leaderboard:${gameId}:monthly:${year}-${month}`,
    global: `leaderboard:${gameId}:global`,
  };
};

export const submitScore = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { gameId, score } = req.body;
    const userId = req.user?.userId;
    const username = req.user?.username;

    if (!userId || !username) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!gameId || typeof score !== "number") {
      res.status(400).json({ error: "Invalid gameId or score" });
      return;
    }

    const keys = getPeriodKeys(gameId);

    // Multi-write to all relevant leaderboards using pipeline for efficiency
    const pipeline = client.multi();

    // 1. Game Global Leaderboard
    pipeline.zIncrBy(keys.global, score, username);
    // 2. Monthly Game Leaderboard
    pipeline.zIncrBy(keys.monthly, score, username);
    // 3. Daily Game Leaderboard
    pipeline.zIncrBy(keys.daily, score, username);
    // 4. Main Global Leaderboard (Across all games)
    pipeline.zIncrBy("leaderboard:all_games", score, username);

    const results = await pipeline.exec();
    // Results array: [globalRes, monthlyRes, dailyRes, allGamesRes]
    // zIncrBy returns string (new score) in newer redis client or number dependent on version.
    // Assuming it works.

    // Emit real-time update via Socket.io
    const io = req.app.get("io") as Server;
    if (io) {
      io.emit("scoreUpdate", {
        gameId,
        username,
        score,
        timestamp: Date.now(),
      });
    }

    res.status(200).json({ message: "Score submitted successfully" });
  } catch (error: any) {
    console.error("Submit score error:", error);
    res.status(500).json({ error: "Failed to submit score" });
  }
};

export const getLeaderboard = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { gameId } = req.params;
    const period = req.query.period as string; // 'daily', 'monthly', 'global' (default)
    const dateQuery = req.query.date as string; // Optional: ISO date string for historical reports
    const limitStr = req.query.limit as string;
    const limit = parseInt(limitStr) || 10;

    let key = `leaderboard:${gameId}:global`; // Default to game global

    // Determine timestamp: uses current time unless date is provided
    const timestamp = dateQuery ? new Date(dateQuery).getTime() : Date.now();

    if (gameId === "all") {
      key = "leaderboard:all_games";
    } else if (period === "monthly") {
      const keys = getPeriodKeys(gameId, timestamp);
      key = keys.monthly;
    } else if (period === "daily") {
      const keys = getPeriodKeys(gameId, timestamp);
      key = keys.daily;
    }

    // Fetch leaderboard logic
    // ZREVRANGE key 0 limit-1 WITHSCORES
    // Note: zRangeWithScores returns { value, score } objects.
    const topPlayers = await client.zRangeWithScores(key, 0, limit - 1, {
      REV: true,
    });

    res.status(200).json({
      period: period || "global",
      gameId,
      date: dateQuery || new Date().toISOString().split("T")[0],
      leaderboard: topPlayers,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

export const getUserRank = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const username = req.user?.username;
    const { gameId } = req.params;
    const period = req.query.period as string;

    if (!username) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    let key = `leaderboard:${gameId}:global`;
    if (gameId === "all") {
      key = "leaderboard:all_games";
    } else if (period === "monthly") {
      const keys = getPeriodKeys(gameId);
      key = keys.monthly;
    } else if (period === "daily") {
      const keys = getPeriodKeys(gameId);
      key = keys.daily;
    }

    const rank = await client.zRevRank(key, username);
    const score = await client.zScore(key, username);

    if (rank === null || score === null) {
      res.status(404).json({ message: "User not found in leaderboard" });
      return;
    }

    // Rank is 0-based, so +1 for human readable
    res.status(200).json({
      rank: rank + 1,
      score,
      username,
      period: period || "global",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rank" });
  }
};
