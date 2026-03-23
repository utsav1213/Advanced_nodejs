const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectRedis } = require("./db/redis");
const authRoutes = require("./routes/authRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const startServer = async () => {
  try {
    await connectRedis();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to Redis and start server:", error);
    process.exit(1);
  }
};

startServer();
