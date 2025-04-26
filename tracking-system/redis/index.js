const { createClient } = require('redis');

// Create Redis client with proper error handling
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Handle Redis errors
redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err);
});

// Connect to Redis
async function initRedis() {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
    // Wait and retry
    setTimeout(initRedis, 5000);
  }
}

// Initialize Redis connection
initRedis();

module.exports = redisClient;
