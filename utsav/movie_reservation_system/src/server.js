const express = require('express')
const app = express();
const authRoutes = require("../routes/auth");
const movieRoutes=require("../routes/movie")
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.get("/", (req, res) => {
  res.send("Movie Reservation System Backend");
});

app.listen(3000);