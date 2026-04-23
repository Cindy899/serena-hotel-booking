const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Mobile Money', 'Bank Transfer'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  transactionId: { type: String },
  paidAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);