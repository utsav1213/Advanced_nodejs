const {
  getShowtimesByMovie,
  getShowtimesByDate,
  getShowtimeById,
  createShowtime,
} = require("../models/showtime");
const pool = require("../utils/db");

const listShowtimesByMovie = async (req, res) => {
  const { movie_id } = req.params;
  const showtimes = await getShowtimesByMovie(movie_id);
  res.json(showtimes);
};

const listShowtimesByDate = async (req, res) => {
  const { date } = req.query;
  const showtimes = await getShowtimesByDate(date);
  res.json(showtimes);
};

const addShowtime = async (req, res) => {
  const { movie_id, auditorium_id, start_time, end_time } = req.body;
  const showtime = await createShowtime({
    movie_id,
    auditorium_id,
    start_time,
    end_time,
  });
  res.status(201).json(showtime);
};

const getShowtimeSeats = async (req, res) => {
  const { id } = req.params;
  // Get all seats for the showtime's auditorium
  const showtime = await getShowtimeById(id);
  if (!showtime) return res.status(404).json({ message: "Showtime not found" });
  const seats = await pool.query(
    "SELECT * FROM seats WHERE auditorium_id = $1",
    [showtime.auditorium_id],
  );
  // Get reserved seats for this showtime
  const reserved = await pool.query(
    "SELECT seat_id FROM reservations WHERE showtime_id = $1 AND status = $2",
    [id, "active"],
  );
  const reservedIds = reserved.rows.map((r) => r.seat_id);
  const seatList = seats.rows.map((seat) => ({
    ...seat,
    reserved: reservedIds.includes(seat.id),
  }));
  res.json(seatList);
};

module.exports = {
  listShowtimesByMovie,
  listShowtimesByDate,
  addShowtime,
  getShowtimeSeats,
};
