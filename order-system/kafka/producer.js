const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
dotenv.config();

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

const produceOrderEvent = async (orderData) => {
  await producer.connect();
  await producer.send({
    topic: 'order-topic',
    messages: [
      { value: JSON.stringify(orderData) }
    ]
  });
  console.log('✅ Order sent to Kafka:', orderData);
  await producer.disconnect();
};

module.exports = { produceOrderEvent };