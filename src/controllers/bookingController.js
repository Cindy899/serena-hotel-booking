const Booking = require('../models/Booking');
const Room = require('../models/Room');

const createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;
    const room = await Room.findById(roomId);
    if (!room || !room.isAvailable) {
      return res.status(400).json({ success: false, message: 'Room not available' });
    }
    const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;
    const booking = await Booking.create({
      guest: req.guest.id, room: roomId, checkInDate,
      checkOutDate, numberOfGuests, totalPrice, specialRequests,
    });
    await Room.findByIdAndUpdate(roomId, { isAvailable: false });
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('guest', 'name email')
      .populate('room', 'roomNumber roomType');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.guest.id })
      .populate('room', 'roomNumber roomType pricePerNight');
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = 'Cancelled';
    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { isAvailable: true });
    res.status(200).json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getAllBookings, getMyBookings, updateBookingStatus, cancelBooking };