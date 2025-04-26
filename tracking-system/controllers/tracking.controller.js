const { getOrderStatus } = require('../redis/services/orderStatus.service');


/**
 * @swagger
 * /track/{orderId}:
 *   get:
 *     summary: Get order tracking status
 *     description: Retrieve the current status of an order by its ID
 *     tags: [Tracking]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to retrieve status for
 *     responses:
 *       200:
 *         description: Order status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                   description: The order ID
 *                 status:
 *                   type: string
 *                   description: Current status of the order
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       500:
 *         description: Server error
 */
const getOrderStatusController = async (req, res) => {
    const orderId = req.params.orderId;
    const status = await getOrderStatus(orderId);

    if (!status) {
        return res.status(404).send({ message: 'Order not found' });
    }

    res.send({ orderId, status });
}

module.exports = {
    getOrderStatus: getOrderStatusController
};
