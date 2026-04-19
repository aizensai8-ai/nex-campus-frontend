import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      validate: {
        validator: (v) => v.toLowerCase().endsWith('@gmail.com'),
        message: 'Only Gmail addresses are allowed',
      },
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    usn: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+$/, 'USN must be alphanumeric'],
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
    semester: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
      default: null,
    },
    section: {
      type: String,
      default: null,
      match: [/^[1-8][A-E]$/, 'Section must be format like 4C or 6B'],
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    registeredEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// ── Normalize USN to lowercase before saving ──────────────────────────────────
userSchema.pre('save', async function (next) {
  if (this.isModified('usn') && this.usn) {
    this.usn = this.usn.toLowerCase();
  }
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance methods ─────────────────────────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ── Sanitize output ──────────────────────────────────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.googleId;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

export default mongoose.model('User', userSchema);
