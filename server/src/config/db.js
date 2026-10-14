import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500 // Don't hang forever if MongoDB is offline
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB not reachable at ${uri} (${error.message})`);
    console.log(`[Database] Running in Local Storage Mode (Data persisted to server/data/campusconnect.db.json)`);
    console.log(`[Database] All API endpoints will function normally without requiring an active MongoDB daemon.`);
    return false;
  }
};

export const getDbStatus = () => ({
  type: isMongoConnected ? 'mongodb' : 'local-storage',
  connected: isMongoConnected
});
