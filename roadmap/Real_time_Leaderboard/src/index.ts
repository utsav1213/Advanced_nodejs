import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import "./db/redis"; // Ensure Redis connects

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for simplicity
    methods: ["GET", "POST"],
  },
});

app.set("io", io); // Make io available in routes

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
  res.send("Real-time Leaderboard API is running");
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
