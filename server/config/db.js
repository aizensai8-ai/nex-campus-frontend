import mongoose from 'mongoose';

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    // Mongoose 8 handles these internally — no deprecated options needed
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
