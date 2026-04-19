import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import passport from 'passport';

import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// ── Route imports ──────────────────────────────────────────────────────────────
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import eventRoutes from './routes/events.js';
import facilityRoutes from './routes/facilities.js';
import announcementRoutes from './routes/announcements.js';
import userRoutes from './routes/users.js';
import attendanceRoutes from './routes/attendance.js';
import supportRoutes from './routes/support.js';
import timetableRoutes from './routes/timetables.js';
import transportRoutes from './routes/transport.js';
import resourceRoutes from './routes/resources.js';
import gradeRoutes from './routes/grades.js';
import lostFoundRoutes from './routes/lostfound.js';
import { seedTimetables } from './utils/seedTimetables.js';
import { claimPort } from './utils/portManager.js';

// ─────────────────────────────────────────────────────────────────────────────
// Connect to MongoDB
// ─────────────────────────────────────────────────────────────────────────────
connectDB()
  .then(() => {
    seedTimetables();
  })
  .catch((err) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  MongoDB unavailable; continuing in degraded local mode.');
      return;
    }

    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ─────────────────────────────────────────────────────────────────────────────
// Express app
// ─────────────────────────────────────────────────────────────────────────────
const app = express();

// ── Trust proxy (required for Vercel / Railway / Render) ─────────────────────
app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_DEV,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, same-origin)
      if (!origin) return callback(null, true);
      // Allow any ngrok domains dynamically
      if (origin.includes('ngrok')) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Security headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Sanitize MongoDB operators in req.body / req.query ───────────────────────
app.use(mongoSanitize());

// ── HTTP request logger (dev only) ───────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Passport (used for Google OAuth) ─────────────────────────────────────────
app.use(passport.initialize());

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiters
// ─────────────────────────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development';

const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — please try again later' },
  skip: () => isDev,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts — please wait 15 minutes' },
  skipSuccessfulRequests: true,
  skip: () => isDev,
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─────────────────────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/lostfound', lostFoundRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Nex Campus API is running',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── 404 for unmatched routes ──────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────────────────────────────────────
const DESIRED_PORT = parseInt(process.env.PORT, 10) || 5001;

const PORT = await claimPort(DESIRED_PORT);

const server = app.listen(PORT, () => {
  const isOriginal = PORT === DESIRED_PORT;
  console.log(`\n🚀  Nex Campus API`);
  console.log(`   Mode  : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port  : ${PORT}${isOriginal ? '' : `  (${DESIRED_PORT} was busy → auto-selected)`}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Unhandled promise rejections ──────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

export default app;
