const Guest = require('../models/Guest');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const registerGuest = async (req, res) => {
  try {
    const { name, email, password, phone, nationality } = req.body;
    const guestExists = await Guest.findOne({ email });
    if (guestExists) return res.status(400).json({ success: false, message: 'Guest already exists' });
    const guest = await Guest.create({ name, email, password, phone, nationality });
    res.status(201).json({ success: true, data: { id: guest._id, name: guest.name, email: guest.email, token: generateToken(guest._id) } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const loginGuest = async (req, res) => {
  try {
    const { email, password } = req.body;
    const guest = await Guest.findOne({ email });
    if (!guest || !(await guest.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.status(200).json({ success: true, data: { id: guest._id, name: guest.name, email: guest.email, token: generateToken(guest._id) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGuestProfile = async (req, res) => {
  try {
    const guest = await Guest.findById(req.guest.id).select('-password');
    res.status(200).json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerGuest, loginGuest, getGuestProfile };