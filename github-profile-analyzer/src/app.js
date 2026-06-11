const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const profileRoutes = require('./routes/profile.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// 1. Security Middlewares
app.use(helmet());
app.use(cors());

// 2. Body Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logger Middleware
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// 4. Swagger Documentation Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GitHub Profile Analyzer API',
      version: '1.0.0',
      description: 'A production-ready Node.js backend service that analyzes a GitHub user\'s public profile, generates insights, stores them in MySQL, and exposes REST APIs.',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Local development server'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirect root or index to Swagger Docs for easy access
app.get('/', (req, res) => {
  res.redirect('/api/docs');
});

// 5. Mount API Routes
app.use('/api', profileRoutes);

// 6. Handle 404 Route Not Found
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// 7. Centered Error Handling Middleware
app.use(errorHandler);

module.exports = app;
