/**
 * Centralized error handling middleware.
 * Standardizes API responses for error conditions.
 */
const errorHandler = (err, req, res, next) => {
  // Log full error in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Middleware]:', err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle unique constraint / validation errors from Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Data already exists';
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = errorHandler;
