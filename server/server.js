import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { initStorage } from './src/utils/storage.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect DB (handles both MongoDB and fallback gracefully)
  await connectDB();

  // Initialize storage & auto-seed if needed
  await initStorage();

  const server = app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` CampusConnect API Server running on port ${PORT}`);
    console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
  });
};

startServer();
