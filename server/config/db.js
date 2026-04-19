import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.set('bufferTimeoutMS', 2000);
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
