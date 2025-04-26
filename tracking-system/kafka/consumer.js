const { Kafka } = require('kafkajs')
const { updateOrderStatus } = require('../redis/services/orderStatus.service')

// Make sure we have a default value if environment variable is missing
const brokerAddress = process.env.KAFKA_BROKER || 'localhost:9092'

const kafka = new Kafka({
  clientId: 'tracking-service',
  brokers: [brokerAddress]
})

const consumer = kafka.consumer({ groupId: 'tracking-group' })

const consumerOrderEvent = async () => {
    try {
        console.log(`Connecting to Kafka broker at: ${brokerAddress}`);
        await consumer.connect()
        console.log('Kafka consumer connected, subscribing to topic');
        await consumer.subscribe({ topic: 'order-topic', fromBeginning: true })
        console.log('Subscribed to order-topic, starting consumer');
        
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            console.log(`Processing message from partition ${partition}`);
            try {
                const order = JSON.parse(message.value.toString());
                console.log('📩 New Order Consumed:', order);
                
                // Update the order status in Redis
                // Default to 'pending' if no status is provided
                await updateOrderStatus(order.orderId, order.status || 'received');
            } catch (error) {
                console.error('Error processing message:', error);
            }
          },
        })
    } catch (error) {
        console.error('Kafka consumer error:', error);
        throw error;
    }
}

module.exports = { consumerOrderEvent };
