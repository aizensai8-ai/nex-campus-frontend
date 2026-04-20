import express from 'express';
import { body, validationResult } from 'express-validator';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ── GET /api/courses ──────────────────────────────────────────────────────────
// Public. Supports: ?department=&status=&search=&page=&limit=&sort=
router.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { department, status, search, section, sort = '-createdAt', page = 1, limit = 20 } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (section) filter.section = section;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [courses, total] = await Promise.all([
      Course.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Course.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: courses,
    });
  })
);

// ── GET /api/courses/faculty — instructor directory grouped from courses ───────
router.get(
  '/faculty',
  asyncHandler(async (req, res) => {
    const courses = await Course.find({}).select('instructor department code name').lean();
    const map = {};
    courses.forEach(c => {
      if (!c.instructor) return;
      const key = c.instructor.trim();
      if (!map[key]) map[key] = { name: key, department: c.department || 'General', subjects: [] };
      if (!map[key].subjects.some(s => s.code === c.code)) {
        map[key].subjects.push({ code: c.code, name: c.name });
      }
    });
    res.status(200).json({ success: true, data: Object.values(map) });
  })
);

// ── GET /api/courses/:id ──────────────────────────────────────────────────────
router.get(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  })
);

// ── POST /api/courses ─────────────────────────────────────────────────────────
// Admin or Faculty only
router.post(
  '/',
  protect,
  authorize('admin', 'faculty'),
  [
    body('code').trim().notEmpty().withMessage('Course code is required'),
    body('name').trim().notEmpty().withMessage('Course name is required'),
    body('instructor').trim().notEmpty().withMessage('Instructor name is required'),
    body('credits').isInt({ min: 0, max: 20 }).withMessage('Credits must be between 0 and 20'),
    body('department').notEmpty().withMessage('Department is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  })
);

// ── PUT /api/courses/:id ──────────────────────────────────────────────────────
router.put(
  '/:id',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    // Prevent manually tweaking enrollment counters via PUT
    delete req.body.enrolled;

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  })
);

// ── DELETE /api/courses/:id ───────────────────────────────────────────────────
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await course.deleteOne();
    res.status(200).json({ success: true, message: 'Course deleted' });
  })
);

// ── POST /api/courses/:id/enroll ──────────────────────────────────────────────
router.post(
  '/:id/enroll',
  protect,
  authorize('student'),
  asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);

    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ success: false, message: 'Course is at full capacity' });
    }

    user.enrolledCourses.push(course._id);
    course.enrolled += 1;

    await Promise.all([user.save({ validateBeforeSave: false }), course.save()]);

    res.status(200).json({ success: true, message: 'Enrolled successfully', data: course });
  })
);

// ── DELETE /api/courses/:id/enroll ────────────────────────────────────────────
router.delete(
  '/:id/enroll',
  protect,
  authorize('student'),
  asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);

    if (!user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ success: false, message: 'Not enrolled in this course' });
    }

    user.enrolledCourses = user.enrolledCourses.filter((id) => id.toString() !== course._id.toString());
    if (course.enrolled > 0) course.enrolled -= 1;

    await Promise.all([user.save({ validateBeforeSave: false }), course.save()]);

    res.status(200).json({ success: true, message: 'Unenrolled successfully' });
  })
);

export default router;
