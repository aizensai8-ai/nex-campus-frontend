import mongoose from 'mongoose';

const CONNECT_OPTS = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

const connectDB = async () => {
  // Disable buffering so queries fail immediately when DB is unreachable
  // instead of queuing for bufferTimeoutMS milliseconds.
  mongoose.set('bufferCommands', false);

  const conn = await mongoose.connect(process.env.MONGODB_URI, CONNECT_OPTS);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

// Retry connection every 30 s until it succeeds (called after initial failure).
export const scheduleReconnect = () => {
  const DELAY = 30_000;
  const attempt = () => {
    if (mongoose.connection.readyState === 1) return;
    mongoose
      .connect(process.env.MONGODB_URI, CONNECT_OPTS)
      .then((conn) => console.log(`[DB] Reconnected: ${conn.connection.host}`))
      .catch((err) => {
        console.warn(`[DB] Reconnect failed — retrying in ${DELAY / 1000}s:`, err.message);
        setTimeout(attempt, DELAY);
      });
  };
  setTimeout(attempt, DELAY);
};

export default connectDB;
