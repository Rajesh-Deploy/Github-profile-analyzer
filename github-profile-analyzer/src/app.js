const express = require('express');
const path = require('path');
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
// Configure Helmet with custom CSP so Swagger UI can load CDN assets correctly
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https://*.githubusercontent.com"],
      connectSrc: ["'self'", "*"],
    }
  }
}));

// Configure CORS to restrict allowed origins in production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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
        url: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : `http://localhost:${process.env.PORT || 5000}/api`,
        description: process.env.BACKEND_URL ? 'Production server' : 'Local development server'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve static files from the React app build folder
const frontendBuildPath = path.join(__dirname, '../../github-profile-analyzer-frontend/dist');
app.use(express.static(frontendBuildPath));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// 5. Mount API Routes
app.use('/api', profileRoutes);

// Catch-all route to serve the React frontend index.html for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// 6. Handle 404 Route Not Found
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// 7. Centered Error Handling Middleware
app.use(errorHandler);

module.exports = app;
