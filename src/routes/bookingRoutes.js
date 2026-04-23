const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBooking, getAllBookings, getMyBookings, updateBookingStatus, cancelBooking } = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/', protect, getAllBookings);
router.get('/my', protect, getMyBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;