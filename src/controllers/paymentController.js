const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { v4: uuidv4 } = require('uuid');

const processPayment = async (req, res) => {
  try {
    const { bookingId, method } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    const payment = await Payment.create({
      booking: bookingId, amount: booking.totalPrice,
      method, status: 'Completed', transactionId: uuidv4(), paidAt: new Date(),
    });
    await Booking.findByIdAndUpdate(bookingId, { status: 'Confirmed' });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId }).populate('booking');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { processPayment, getPaymentByBooking };