import express from 'express';
import Attendance from '../models/Attendance.js';
import Course from '../models/Course.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Helper: normalize a date to midnight UTC (for consistent per-day keying)
const toDay = (d = new Date()) => {
  const dt = new Date(d);
  dt.setUTCHours(0, 0, 0, 0);
  return dt;
};

// ── POST /api/attendance/mark-absent ─────────────────────────────────────────
// Mark the logged-in student absent for a course today.
router.post(
  '/mark-absent',
  protect,
  asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const date = toDay();

    const record = await Attendance.findOneAndUpdate(
      { user: req.user._id, course: courseId, date },
      { status: 'absent' },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: record });
  })
);

// ── POST /api/attendance/mark-present ────────────────────────────────────────
// Undo today's absence for a course.
router.post(
  '/mark-present',
  protect,
  asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    const date = toDay();
    await Attendance.deleteOne({ user: req.user._id, course: courseId, date });

    res.status(200).json({ success: true, message: 'Absence removed' });
  })
);

// ── GET /api/attendance/my ────────────────────────────────────────────────────
// All absent records for the logged-in student.
router.get(
  '/my',
  protect,
  asyncHandler(async (req, res) => {
    const records = await Attendance.find({ user: req.user._id, status: 'absent' })
      .populate('course', 'code name section totalClasses')
      .sort('-date');
    res.status(200).json({ success: true, data: records });
  })
);

// ── GET /api/attendance/my/:courseId ─────────────────────────────────────────
// Absent dates for a specific course.
router.get(
  '/my/:courseId',
  protect,
  asyncHandler(async (req, res) => {
    const records = await Attendance.find({
      user: req.user._id,
      course: req.params.courseId,
      status: 'absent',
    }).sort('-date');
    res.status(200).json({ success: true, data: records });
  })
);

// ── GET /api/attendance/summary ───────────────────────────────────────────────
// Attendance percentage summary per course for the logged-in student.
// Filters courses by user's section (if set).
router.get(
  '/summary',
  protect,
  asyncHandler(async (req, res) => {
    const { section } = req.user;
    const filter = section ? { section } : {};
    const courses = await Course.find(filter).lean();

    const today = toDay();
    const userId = req.user._id;

    const summary = await Promise.all(
      courses.map(async (course) => {
        const [absentCount, todayRecord] = await Promise.all([
          Attendance.countDocuments({ user: userId, course: course._id, status: 'absent' }),
          Attendance.findOne({ user: userId, course: course._id, date: today, status: 'absent' }),
        ]);

        const total = course.totalClasses || 0;
        const attended = Math.max(0, total - absentCount);
        const percent = total > 0 ? Math.round((attended / total) * 100) : null;
        // Max absences allowed = 25% of total; canSkip = headroom remaining
        const canSkip = total > 0 ? Math.floor(total * 0.25 - absentCount) : null;

        return {
          course: {
            _id: course._id,
            code: course.code,
            name: course.name,
            section: course.section,
            totalClasses: total,
          },
          absentCount,
          attendedClasses: attended,
          percent,
          canSkip,
          todayAbsent: !!todayRecord,
        };
      })
    );

    res.status(200).json({ success: true, data: summary });
  })
);

// ── GET /api/attendance/admin/summary ─────────────────────────────────────────
// Admin: per-course attendance overview (absent record count, unique students).
router.get(
  '/admin/summary',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const courses = await Course.find({}).lean();

    const summary = await Promise.all(
      courses.map(async (course) => {
        const [absentRecords, uniqueUsers] = await Promise.all([
          Attendance.countDocuments({ course: course._id, status: 'absent' }),
          Attendance.distinct('user', { course: course._id }),
        ]);

        return {
          _id: course._id,
          code: course.code,
          name: course.name,
          section: course.section || '',
          totalClasses: course.totalClasses || 0,
          totalStudents: uniqueUsers.length,
          absentRecords,
        };
      })
    );

    res.status(200).json({ success: true, data: summary });
  })
);

// ── PATCH /api/attendance/admin/add-class/:courseId ───────────────────────────
// Admin: increment totalClasses by 1 for a course.
router.patch(
  '/admin/add-class/:courseId',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { $inc: { totalClasses: 1 } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  })
);

export default router;
