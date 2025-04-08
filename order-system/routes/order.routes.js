const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/order.controller');

router.post('/create-order', createOrder);

module.exports = router;
