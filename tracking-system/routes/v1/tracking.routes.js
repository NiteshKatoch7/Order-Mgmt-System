const express = require('express');
const router = express.Router();
const { getOrderStatus } = require('../../controllers/tracking.controller');

/**
 * @swagger
 * tags:
 *   name: Tracking
 *   description: Order tracking operations
 */


router.get('/track/:orderId', getOrderStatus);

module.exports = router;
