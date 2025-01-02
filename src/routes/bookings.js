const verifyAdmin = require('../middlewares/admin');
const verifyJWT = require('../middlewares/auth');
const express = require('express');
const { getBookingsByEmail, getBookingById, createBooking, deleteBooking, updateBooking, getAllBookings } = require('../controllers/bookingsController');
const router = express.Router();

// Booking routes
router.get('/', verifyJWT, getBookingsByEmail);
router.get('/all', verifyJWT, verifyAdmin, getAllBookings);
router.get('/:id', verifyJWT, getBookingById);
router.post('/', createBooking);
router.delete('/:id', deleteBooking);
router.patch('/:id', verifyJWT, updateBooking);

module.exports = router;
