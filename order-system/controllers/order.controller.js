const { produceOrderEvent } = require('../kafka/producer');
const orderSchema = require('../models/order.model');

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         itemId:
 *           type: string
 *           description: Unique identifier for the item
 *         itemName:
 *           type: string
 *           description: Name of the item
 *         price:
 *           type: number
 *           description: Price of the item
 *         discount:
 *           type: number
 *           description: Discount percentage for the item
 *         quantity:
 *           type: integer
 *           description: Quantity of the item ordered
 *           default: 1
 *       required:
 *         - itemId
 *         - itemName
 *         - price
 */

/**
 * @swagger
 * tags:
 *   name: Create Order
 *   description: Order management operations
 */

/**
 * @swagger
 * /create-order:
 *   post:
 *     summary: Create a new order  
 *     tags: [Create Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               customerName:
 *                 type: string
 *               items:  
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Item'
 *             required:
 *               - orderId
 *               - customerName
 *               - items
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object   
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

exports.createOrder = async (req, res) => {
    try{
        const { orderId, customerName, items } = req.body;
        
        if(!orderId || !customerName || !items || !Array.isArray(items) || items.length === 0){
            return res.status(400).json({
                message: 'Missing or invalid fields. Items must be a non-empty array.'
            });
        }
        
        // Validate each item
        for (const item of items) {
            if (!item.itemId || !item.itemName || !item.price) {
                return res.status(400).json({
                    message: 'Each item must have itemId, itemName, and price'
                });
            }
        }
        
        // Calculate total amount
        const totalAmount = items.reduce((total, item) => {
            const price = item.price;
            const discount = item.discount || 0;
            const quantity = item.quantity || 1;
            const itemTotal = price * quantity * (1 - discount / 100);
            return total + itemTotal;
        }, 0);
        
        const order = {
            orderId,
            customerName,
            items,
            totalAmount,
            timestamp: new Date().toISOString()
        };

        const newOrder = new orderSchema(order);
        await newOrder.save();  
        
        await produceOrderEvent(newOrder);
        
        res.status(201).json({
            message: 'Order created successfully',
            order: newOrder
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
