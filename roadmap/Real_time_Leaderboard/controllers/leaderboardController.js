const { client } = require("../db/redis");

// Submit score for a game
const submitScore = async (req, res) => {
  try {
    const { gameId, score } = req.body;
    const username = req.user.username;

    if (!gameId || score === undefined) {
      return res.status(400).json({ error: "gameId and score are required" });
    }

    // Add to specific game leaderboard
    await client.zAdd(`leaderboard:${gameId}`, [
      { score: Number(score), value: username },
    ]);

    // Add to global leaderboard (sum of scores across all games for simplicity, or just highest total)
    await client.zIncrBy("leaderboard:global", Number(score), username);

    res.status(200).json({ message: "Score submitted successfully", score });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to submit score", details: error.message });
  }
};

// Get global leaderboard
const getGlobalLeaderboard = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) - 1 : 9; // default top 10
    const leaderboard = await client.zMembersWithScores("leaderboard:global");

    // ioredis / node-redis v4 specific for reversing list (highest to lowest)
    const entries = await client.zRangeWithScores(
      "leaderboard:global",
      0,
      limit,
      { REV: true },
    );

    res.status(200).json({ leaderboard: entries });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get leaderboard", details: error.message });
  }
};

// Get specific game leaderboard
const getGameLeaderboard = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) - 1 : 9;

    const entries = await client.zRangeWithScores(
      `leaderboard:${gameId}`,
      0,
      limit,
      { REV: true },
    );

    res.status(200).json({ gameId, leaderboard: entries });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to get game leaderboard",
        details: error.message,
      });
  }
};

// Get user ranking globally and per game
const getUserRank = async (req, res) => {
  try {
    const username = req.user.username;
    const { gameId } = req.query;

    let rank, score;

    if (gameId) {
      rank = await client.zRevRank(`leaderboard:${gameId}`, username);
      score = await client.zScore(`leaderboard:${gameId}`, username);
    } else {
      rank = await client.zRevRank("leaderboard:global", username);
      score = await client.zScore("leaderboard:global", username);
    }

    if (rank === null) {
      return res
        .status(404)
        .json({ message: "User has no score on this leaderboard" });
    }

    res
      .status(200)
      .json({ username, gameId: gameId || "global", rank: rank + 1, score });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get user rank", details: error.message });
  }
};

module.exports = {
  submitScore,
  getGlobalLeaderboard,
  getGameLeaderboard,
  getUserRank,
};
