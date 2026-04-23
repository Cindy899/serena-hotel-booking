const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'],
    default: 'Pending',
  },
  specialRequests: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);