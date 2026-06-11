const app = require('./app');
const { connectDB, sequelize } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    console.log("Before authenticate");
    // 1. Authenticate connection with MySQL
    await connectDB();

    // 2. Synchronize models with Database
    // force: false ensures we do not drop existing tables on restart.
    // In production, database migrations are preferred.
    console.log('Synchronizing database models...');
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');

    // 3. Start HTTP server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`================================================`);
      console.log(`  GitHub Profile Analyzer API is running!       `);
      console.log(`  Port: ${PORT}                                 `);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`================================================`);
    });
  } catch (error) {
    console.error('Critical failure. Unable to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process if needed
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
