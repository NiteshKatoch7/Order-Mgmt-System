const redisClient = require('../index');

const updateOrderStatus = async (orderId, status) => {
    try {
        await redisClient.set(orderId, status);
        console.log(`✅ Order ${orderId} status updated to ${status}`);
    } catch (error) {
        console.error(`❌ Failed to update status for order ${orderId}:`, error);
    }
}

const getOrderStatus = async (orderId) => {
    try {
        return await redisClient.get(orderId);
    } catch (error) {
        console.error(`❌ Failed to get status for order ${orderId}:`, error);
        return null;
    }
}

module.exports = { updateOrderStatus, getOrderStatus };
