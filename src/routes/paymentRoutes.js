const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { processPayment, getPaymentByBooking } = require('../controllers/paymentController');

router.post('/', protect, processPayment);
router.get('/:bookingId', protect, getPaymentByBooking);

module.exports = router;