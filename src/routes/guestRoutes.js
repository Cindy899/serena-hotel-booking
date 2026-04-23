const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerGuest, loginGuest, getGuestProfile } = require('../controllers/guestController');

router.post('/register', registerGuest);
router.post('/login', loginGuest);
router.get('/profile', protect, getGuestProfile);

module.exports = router;