const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');


router.post('/checkout-session', authController.isLoggedIn,bookingController.getCheckoutSession);


module.exports = router;