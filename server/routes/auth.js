import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import crypto from 'crypto';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendResetEmail } from '../utils/mailer.js';
import {
  getOfflineAdminUserByEmail,
  isOfflineAdminPassword,
} from '../utils/offlineAuth.js';

const router = express.Router();

// ── Helper: send JWT in cookie + JSON ─────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const cookieOptions = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        usn: user.usn,
        semester: user.semester,
        section: user.section,
        address: user.address,
        avatar: user.avatar,
      },
    });
};

// ── Validation rules ──────────────────────────────────────────────────────────
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('usn')
    .optional()
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9]+$/)
    .withMessage('USN must be alphanumeric'),
  body('role').optional().isIn(['student', 'faculty']).withMessage('Role must be student or faculty'),
  body('address').optional().trim().isString(),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post(
  '/register',
  registerRules,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, usn, role, section, semester, address } = req.body;

    // Gmail-only policy
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ success: false, message: 'Only Gmail addresses are allowed' });
    }

    // Section required, must be {1-8}{A-E} format (e.g. 4C, 6B)
    if (!section || !/^[1-8][A-E]$/.test(section)) {
      return res.status(400).json({ success: false, message: 'Section is required (e.g. 4C, 6B, 1A)' });
    }

    // Prevent self-promoting to admin via registration
    const safeRole = role === 'admin' ? 'student' : role || 'student';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const semNum = semester ? parseInt(semester) : parseInt(section[0]);
    const user = await User.create({ name, email, password, usn, role: safeRole, section, semester: semNum, address: address || '' });
    sendTokenResponse(user, 201, res);
  })
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post(
  '/login',
  loginRules,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const offlineUser = getOfflineAdminUserByEmail(email);

      if (offlineUser && isOfflineAdminPassword(password)) {
        return sendTokenResponse(offlineUser, 200, res);
      }

      return res.status(503).json({
        success: false,
        message: 'Authentication is temporarily unavailable while MongoDB is disconnected',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  })
);

// ── GET /api/auth/logout ──────────────────────────────────────────────────────
router.get('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// ── POST /api/auth/forgot-password ────────────────────────────────────────────
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail().withMessage('Valid email required')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return res.status(200).json({ success: true, message: 'Reset link sent to your email' });
    }

    if (!user.password && user.googleId) {
       return res.status(400).json({ success: false, message: 'This account uses Google sign-in. Password reset is not available.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set expire (10 mins)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    await user.save({ validateBeforeSave: false });

    // Send email
    const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : process.env.CLIENT_URL_DEV;
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    await sendResetEmail(user.email, resetUrl);

    res.status(200).json({ success: true, message: 'Reset link sent to your email' });
  })
);

// ── POST /api/auth/reset-password/:token ──────────────────────────────────────
router.post(
  '/reset-password/:token',
  [body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  })
);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: req.user });
    }

    const user = await User.findById(req.user._id)
      .populate('enrolledCourses', 'code name credits department')
      .populate('registeredEvents', 'title date location status');

    res.status(200).json({ success: true, data: user });
  })
);

// ── Google OAuth ──────────────────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Check if email already exists (link accounts)
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.googleId = profile.id;
              if (!user.avatar) user.avatar = profile.photos[0]?.value || '';
              await user.save({ validateBeforeSave: false });
            } else {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0]?.value || '',
                role: 'student',
              });
            }
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // GET /api/auth/google
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

  // GET /api/auth/google/callback
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
    (req, res) => {
      const token = req.user.getSignedJwtToken();
      // Redirect to frontend with token in query (frontend stores it)
      const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : process.env.CLIENT_URL_DEV;
      res.redirect(`${clientUrl}/portal?token=${token}`);
    }
  );
} else {
  // Stub routes when OAuth env vars are not set
  router.get('/google', (req, res) => {
    res.status(503).json({ success: false, message: 'Google OAuth is not configured' });
  });
  router.get('/google/callback', (req, res) => {
    res.status(503).json({ success: false, message: 'Google OAuth is not configured' });
  });
}

export default router;
