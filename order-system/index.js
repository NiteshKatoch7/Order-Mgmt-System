const express = require('express')
const app = express()
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const customRoutes = require('./routes/order.routes');
const swaggerDocument = require('./swagger/swagger.json');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT

// Middlewares    
app.use(express.json());

// Swagger Middleware
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order System API',
      version: '1.0.0',
      description: 'API for managing customer orders'
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};
const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routings Middleware
app.use('/', customRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log(err);
})

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})