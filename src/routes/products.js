const express = require('express');
const { getProducts, getProductById, addProduct } = require('../controllers/productsController');
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', addProduct);

module.exports = router;
