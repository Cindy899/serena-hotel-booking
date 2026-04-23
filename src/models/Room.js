const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  roomType: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Suite', 'Presidential'],
    required: true,
  },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  amenities: [{ type: String }],
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);