import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  busNumber: {
    type: Number,
    required: true,
    unique: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  driverName: {
    type: String,
    default: ''
  },
  driverContact: {
    type: String,
    default: ''
  },
  areasServed: [{
    type: String,
    trim: true
  }],
  schedule: {
    type: String,
    default: 'Standard College Hours (Up & Down)'
  }
}, { timestamps: true });

export default mongoose.model('Transport', transportSchema);
