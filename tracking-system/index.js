const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
// Load environment variables first
dotenv.config();

const port = process.env.PORT || 3000;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const customRoutes = require('./routes/v1/tracking.routes');
const { consumerOrderEvent } = require('./kafka/consumer');

// Enable CORS for all routes
app.use(cors());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Tracking API',
      version: '1.0.0',
      description: 'API for tracking order status',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
  },
  // Path to the API docs - look for JSDoc comments in these files
  apis: ['./controllers/*.js', './routes/**/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());    
app.use('/', customRoutes);

// Application startup
async function startApp() {
  try {
    // Start Kafka consumer
    console.log('Starting Kafka consumer...');
    await consumerOrderEvent();
    console.log('✅ Kafka consumer started successfully');
    
    // Start HTTP server
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
      console.log(`📚 Swagger documentation available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
startApp();

