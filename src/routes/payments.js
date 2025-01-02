const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const verifyJWT = require('../middlewares/auth');

const router = express.Router();

router.post('/create-payment-intent', verifyJWT, createPaymentIntent);

module.exports = router;
