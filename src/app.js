// src/app.js
// Serena Hotel Kigali - Booking Management System
// Author: [Your Name]
// Best Practice: Use environment variables, modular routing

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Serena Hotel Kigali - Booking System API is running',
    version: '1.0.0',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;