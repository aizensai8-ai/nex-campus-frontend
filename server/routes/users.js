import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ── GET /api/users/profile ────────────────────────────────────────────────────
router.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses', 'code name credits department schedule instructor')
      .populate('registeredEvents', 'title date time location status category');

    res.status(200).json({ success: true, data: user });
  })
);

// ── PUT /api/users/profile ────────────────────────────────────────────────────
router.put(
  '/profile',
  [
    body('name').optional().trim().notEmpty().isLength({ max: 100 }).withMessage('Name must be <= 100 chars'),
    body('usn')
      .optional()
      .trim()
      .toLowerCase()
      .matches(/^[a-z0-9]+$/)
      .withMessage('USN must be alphanumeric'),
    body('section')
      .optional()
      .matches(/^[1-8][A-E]$/)
      .withMessage('Section must be format like 4C or 6B'),
    body('semester')
      .optional()
      .isInt({ min: 1, max: 8 })
      .withMessage('Semester must be 1–8'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Email is read-only — never update it through this endpoint
    const { name, usn, section, semester } = req.body;
    const updates = {};
    if (name    !== undefined) updates.name    = name;
    if (usn     !== undefined) updates.usn     = usn.toLowerCase();
    if (section !== undefined) updates.section = section;
    if (semester !== undefined) updates.semester = parseInt(semester);

    // Derive semester from section if not explicitly supplied
    if (section && semester === undefined) {
      updates.semester = parseInt(section[0]);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  })
);

// ── PUT /api/users/password ───────────────────────────────────────────────────
router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google sign-in. Password change is not available.',
      });
    }

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  })
);

// ── GET /api/users — Admin: list all users ────────────────────────────────────
router.get(
  '/',
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { role, sort = '-createdAt', page = 1, limit = 50, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { usn: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: users,
    });
  })
);

// ── GET /api/users/:id — Admin: get single user ───────────────────────────────
router.get(
  '/:id',
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
      .populate('enrolledCourses', 'code name credits')
      .populate('registeredEvents', 'title date');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  })
);

// ── PUT /api/users/:id/role — Admin: change user role ────────────────────────
router.put(
  '/:id/role',
  authorize('admin'),
  [body('role').isIn(['student', 'faculty', 'admin']).withMessage('Invalid role')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  })
);

// ── DELETE /api/users/:id — Admin: delete user ────────────────────────────────
router.delete(
  '/:id',
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account via this endpoint' });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  })
);

export default router;
