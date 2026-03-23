const {
  createReservation,
  getReservationsByUser,
  getReservationsByShowtime,
  cancelReservation,
  getReservationById,
} = require("../models/reservation");
const pool = require("../utils/db");

const reserveSeats = async (req, res) => {
  const { showtime_id, seat_ids } = req.body;
  const user_id = req.user.id;

  // Check if seats are available
  const reserved = await pool.query(
    "SELECT seat_id FROM reservations WHERE showtime_id = $1 AND status = $2 AND seat_id = ANY($3
  );
  if (reserved.rows.length > 0) {
    return res
      .status(409)
      .json({
        message: "Some seats are already reserved",
        reserved: reserved.rows,
      });
  }

  // Reserve seats atomically
  const reservations = [];
  for (const seat_id of seat_ids) {
    const reservation = await createReservation({
      user_id,
      showtime_id,
      seat_id,
    });
    reservations.push(reservation);
  }
  res.status(201).json(reservations);
};

const getUserReservations = async (req, res) => {
  const user_id = req.user.id;
  const reservations = await getReservationsByUser(user_id);
  res.json(reservations);
};

const cancelUserReservation = async (req, res) => {
  const { id } = req.params;
  const reservation = await getReservationById(id);
  if (!reservation || reservation.user_id !== req.user.id) {
    return res.status(404).json({ message: "Reservation not found" });
  }
  // Only allow cancel if upcoming
  const showtime = await pool.query("SELECT * FROM showtimes WHERE id = $1", [
    reservation.showtime_id,
  ]);
  if (new Date(showtime.rows[0].start_time) < new Date()) {
    return res.status(400).json({ message: "Cannot cancel past reservations" });
  }
  await cancelReservation(id);
  res.status(200).json({ message: "Reservation cancelled" });
};

module.exports = {
  reserveSeats,
  getUserReservations,
  cancelUserReservation,
};
