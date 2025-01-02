const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewsController');
const router = express.Router();

router.post('/', addReview);
router.get('/', getReviews);

module.exports = router;
