import express from 'express';
import { body, validationResult } from 'express-validator';
import Grade from '../models/Grade.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ── GET /api/grades/mine ──────────────────────────────────────────────────────
router.get(
  '/mine',
  protect,
  asyncHandler(async (req, res) => {
    const grades = await Grade.find({ student: req.user._id })
      .populate('course', 'name code credits');
    res.status(200).json({ success: true, count: grades.length, data: grades });
  })
);

// ── GET /api/grades (Admin only) ──────────────────────────────────────────────
router.get(
  '/',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    let query = {};
    if (req.query.student) query.student = req.query.student;
    if (req.query.course) query.course = req.query.course;

    const grades = await Grade.find(query)
      .populate('student', 'name usn')
      .populate('course', 'name code');
      
    res.status(200).json({ success: true, count: grades.length, data: grades });
  })
);

// ── POST /api/grades ──────────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  authorize('admin', 'faculty'),
  [
    body('student').notEmpty().withMessage('Student ID is required'),
    body('course').notEmpty().withMessage('Course ID is required'),
    body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1-8')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Check if grade already exists for this student/course combination
    let grade = await Grade.findOne({ student: req.body.student, course: req.body.course });
    
    if (grade) {
      // Update existing
      grade.cie1 = req.body.cie1 ?? grade.cie1;
      grade.cie2 = req.body.cie2 ?? grade.cie2;
      grade.cie3 = req.body.cie3 ?? grade.cie3;
      grade.totalMarks = (grade.cie1 + grade.cie2 + grade.cie3);
      await grade.save();
    } else {
      // Create new
      req.body.totalMarks = (req.body.cie1 || 0) + (req.body.cie2 || 0) + (req.body.cie3 || 0);
      grade = await Grade.create(req.body);
    }

    res.status(201).json({ success: true, data: grade });
  })
);

// ── PUT /api/grades/:id ───────────────────────────────────────────────────────
router.put(
  '/:id',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({ success: false, message: 'Grade record not found' });
    }

    grade.cie1 = req.body.cie1 ?? grade.cie1;
    grade.cie2 = req.body.cie2 ?? grade.cie2;
    grade.cie3 = req.body.cie3 ?? grade.cie3;
    grade.maxCie = req.body.maxCie ?? grade.maxCie;
    grade.totalMarks = grade.cie1 + grade.cie2 + grade.cie3;
    
    await grade.save();
    res.status(200).json({ success: true, data: grade });
  })
);

// ── DELETE /api/grades/:id ────────────────────────────────────────────────────
router.delete(
  '/:id',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) {
      return res.status(404).json({ success: false, message: 'Grade record not found' });
    }
    res.status(200).json({ success: true, data: {} });
  })
);

export default router;
