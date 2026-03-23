require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("../routes/auth");
const movieRoutes = require("../routes/movie");
const reservationRoutes = require("../routes/reservation");
const showtimeRoutes = require("../routes/showtime");
const adminRoutes = require("../routes/admin");
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Movie Reservation System Backend");
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
